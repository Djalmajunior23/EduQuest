import { api } from '../lib/api';



export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'COMPLETE_EXAM' | 'SCORE_ABOVE' | 'STREAK' | 'COMPLETE_EXAM_PLAIN';
  threshold: number;
  xpReward: number;
  tokenReward: number;
}

export interface MissionProgress {
  userId: string;
  missionId: string;
  progress: number;
  completed: boolean;
  completedAt?: any;
}

/**
 * Serviço para gerenciar missões dinâmicas e progresso do aluno.
 */
export const missionService = {
  /**
   * Verifica e atualiza missões baseadas em ações do aluno.
   */
  async checkMissions(userId: string, action: 'COMPLETE_EXAM', metadata: { score?: number, examId?: string }) {
    try {
      // 1. Buscar missões ativas do tipo correspondente
      const { data: missionsSnap, error: missionsError } = await api
        .from('gamificacao_missoes')
        .select('*')
        .eq('type', action);
        
      if (missionsError) throw missionsError;
      
      const results: any[] = [];
      
      for (const missionDoc of missionsSnap || []) {
        const mission = missionDoc as any;
        
        const { data: progressSnap } = await api
          .from('gamificacao_progresso_missoes')
          .select('*')
          .eq('userId', userId)
          .eq('missionId', mission.id)
          .maybeSingle();
          
        let progressData: MissionProgress;
        
        if (progressSnap) {
          progressData = progressSnap as MissionProgress;
          if (progressData.completed) continue; // Já completou
        } else {
          progressData = {
            userId,
            missionId: mission.id,
            progress: 0,
            completed: false
          };
        }

        // 2. Lógica de validação por tipo de missão
        let newlyCompleted = false;
        
        if (action === 'COMPLETE_EXAM') {
          if (mission.type === 'SCORE_ABOVE' && metadata.score !== undefined) {
             if (metadata.score >= mission.threshold) {
               newlyCompleted = true;
             }
          } else if (mission.type === 'COMPLETE_EXAM') {
             progressData.progress += 1;
             if (progressData.progress >= mission.threshold) {
               newlyCompleted = true;
             }
          }
        }

        // 3. Atualizar progresso e conceder recompensas
        if (newlyCompleted) {
          progressData.completed = true;
          progressData.completedAt = new Date().toISOString();
          
          // Use RPC para incrementar saldo ou buscar usuario primeiro
          // Fallback: update manual
          const { data: user } = await api
            .from('usuarios')
            .select('xp, saldoTokensIA')
            .eq('id', userId)
            .maybeSingle();
            
          if (user) {
             await api
               .from('usuarios')
               .update({
                 xp: (user.xp || 0) + mission.xpReward,
                 saldoTokensIA: (user.saldoTokensIA || 0) + mission.tokenReward,
                 updatedAt: new Date().toISOString()
               })
               .eq('id', userId);
          }
          
          // Registrar conquista
          await api
            .from('gamificacao_conquistas_aluno')
            .insert({
              userId,
              missionId: mission.id,
              title: mission.title,
            });

          results.push({ mission, status: 'COMPLETED' });
        }

        if (progressSnap) {
          await api
            .from('gamificacao_progresso_missoes')
            .update(progressData)
            .eq('userId', userId)
            .eq('missionId', mission.id);
        } else {
          await api
            .from('gamificacao_progresso_missoes')
            .insert(progressData);
        }
      }
      
      return results;
    } catch (error) {
      console.error("Erro ao processar missões:", error);
      return [];
    }
  },

  /**
   * Busca todas as missões ativas e anexa o progresso do aluno.
   */
  async getMissionsWithProgress(userId: string, tenantId: string) {
    try {
      const { data: missionsSnap, error: mErr } = await api
        .from('gamificacao_missoes')
        .select('*')
        .eq('tenantId', tenantId);
        
      if (mErr) throw mErr;
      const missions = missionsSnap || [];
      
      const { data: progressSnap, error: pErr } = await api
        .from('gamificacao_progresso_missoes')
        .select('*')
        .eq('userId', userId);
        
      if (pErr) throw pErr;
      const progressMap = new Map((progressSnap || []).map(doc => [doc.missionId, doc]));
      
      return (missions || []).map(m => ({
        ...m,
        progress: (progressMap.get(m.id) as MissionProgress)?.progress || 0,
        completed: (progressMap.get(m.id) as MissionProgress)?.completed || false
      }));
    } catch (error) {
      console.error("Erro ao buscar missões com progresso:", error);
      return [];
    }
  }
};
