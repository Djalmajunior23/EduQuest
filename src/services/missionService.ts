import { collection, query, where, getDocs, doc, getDoc, setDoc, updateDoc, increment, serverTimestamp, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

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
      const missionsQuery = query(collection(db, 'gamificacao_missoes'), where('type', '==', action));
      const missionsSnap = await getDocs(missionsQuery);
      
      const results = [];
      
      for (const missionDoc of missionsSnap.docs) {
        const mission = { id: missionDoc.id, ...missionDoc.data() } as Mission;
        const progressId = `${userId}_${mission.id}`;
        const progressRef = doc(db, 'gamificacao_progresso_missoes', progressId);
        const progressSnap = await getDoc(progressRef);
        
        let progressData: MissionProgress;
        
        if (progressSnap.exists()) {
          progressData = progressSnap.data() as MissionProgress;
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
          progressData.completedAt = serverTimestamp();
          
          // Conceder recompensas no perfil do usuário
          const userRef = doc(db, 'usuarios', userId);
          await updateDoc(userRef, {
            xp: increment(mission.xpReward),
            saldoTokensIA: increment(mission.tokenReward),
            updatedAt: serverTimestamp()
          });
          
          // Registrar conquista
          await addDoc(collection(db, 'gamificacao_conquistas_aluno'), {
            userId,
            missionId: mission.id,
            title: mission.title,
            awardedAt: serverTimestamp()
          });

          results.push({ mission, status: 'COMPLETED' });
        }

        await setDoc(progressRef, progressData);
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
      const q = query(collection(db, 'gamificacao_missoes'), where('tenantId', '==', tenantId));
      const missionsSnap = await getDocs(q);
      const missions = missionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Mission));
      
      const progressQuery = query(collection(db, 'gamificacao_progresso_missoes'), where('userId', '==', userId));
      const progressSnap = await getDocs(progressQuery);
      const progressMap = new Map(progressSnap.docs.map(doc => [doc.data().missionId, doc.data()]));
      
      return missions.map(m => ({
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
