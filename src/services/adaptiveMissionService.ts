import { supabase } from '../lib/supabase';
import { AIService } from './aiService';

export type StudentProfileType = 
  | 'INICIANTE_INSEGURO' 
  | 'EM_EVOLUCAO' 
  | 'CONSISTENTE' 
  | 'AVANCADO' 
  | 'DESENGAJADO' 
  | 'EM_RECUPERACAO' 
  | 'ALTO_POTENCIAL';

export interface AdaptiveMission {
  id?: string;
  userId: string;
  courseId: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  xpReward: number;
  tokenReward: number;
  technicalSkill: string;
  type: 'CORE_REVIEW' | 'CHALLENGE' | 'QUICK_WIN' | 'BOSS_PREP';
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'EXPIRED';
  createdAt?: any;
  tenantId?: string;
}

export const adaptiveMissionService = {
  /**
   * Determina o perfil do aluno com base em métricas reais.
   */
  async determineStudentProfile(userId: string): Promise<StudentProfileType> {
    const { data: userData } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (!userData) return 'INICIANTE_INSEGURO';
    
    const xp = userData.xp || 0;
    const streak = userData.streak || 0;
    
    if (streak === 0 && xp > 100) return 'DESENGAJADO';
    if (xp > 5000) return 'AVANCADO';
    if (xp > 1000) return 'CONSISTENTE';
    if (xp > 300) return 'EM_EVOLUCAO';
    
    return 'INICIANTE_INSEGURO';
  },

  /**
   * Gera missões adaptativas personalizadas usando o Motor de IA.
   */
  async generateAdaptiveMissions(userId: string, courseId: string, tenantId: string) {
    const profile = await this.determineStudentProfile(userId);
    const { data: userData } = await supabase
      .from('usuarios')
      .select('nome')
      .eq('id', userId)
      .single();
      
    const userName = userData ? userData.nome : 'Aluno';

    const prompt = `
      [SISTEMA]: Você é o arquiteto de gamificação do Nexus.
      O aluno ${userName} possui o perfil "${profile}".
      Crie 2 missões adaptativas para engajá-lo e ensiná-lo algo valioso relacionado a tecnologia/programação.
      
      Se o aluno for DESENGAJADO, faça missões fáceis e rápidas.
      Se for AVANÇADO, crie desafios complexos de Cibersegurança ou Engenharia de Software.
      
      Retorne um JSON contendo as missões.
    `;

    const schema = {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string", description: "O nome criativo da missão (inclua um emoji)" },
          description: { type: "string" },
          difficulty: { type: "string", description: "EASY, MEDIUM ou HARD" },
          xpReward: { type: "number", description: "XP entre 50 e 1000" },
          tokenReward: { type: "number", description: "Tokens entre 5 e 50" },
          type: { type: "string", description: "CORE_REVIEW, CHALLENGE, QUICK_WIN ou BOSS_PREP" },
          technicalSkill: { type: "string" }
        },
        required: ["title", "description", "difficulty", "xpReward", "tokenReward", "type", "technicalSkill"]
      }
    };

    let generatedMissions: any[] = [];
    
    try {
      generatedMissions = await AIService.generateJSON(prompt, schema, 'FLEET');
    } catch (error) {
      console.error("AI failure softly fallback to default mission", error);
      generatedMissions = [{
        title: '🧩 Recuperação Manual',
        description: 'Resolva 3 exercícios lógicos para continuar sua jornada.',
        difficulty: 'EASY',
        xpReward: 100,
        tokenReward: 10,
        type: 'CORE_REVIEW',
        technicalSkill: 'Lógica Básica'
      }];
    }

    // Limpa missões antigas pendentes/ativas (opcional, mas boa prática para evitar spam)
    await supabase
      .from('gamificacao_missoes_adaptativas')
      .update({ status: 'EXPIRED' })
      .eq('userId', userId)
      .eq('tenantId', tenantId)
      .eq('status', 'ACTIVE');

    // Salvar novas missões
    const finalMissions: AdaptiveMission[] = [];
    for (const m of generatedMissions) {
      const newMission = {
        ...m,
        userId,
        tenantId,
        courseId,
        status: 'ACTIVE',
      };
      
      const { data } = await supabase
        .from('gamificacao_missoes_adaptativas')
        .insert(newMission)
        .select()
        .single();
        
      if (data) {
        finalMissions.push(data as AdaptiveMission);
      }
    }

    return finalMissions;
  },

  /**
   * Busca as missões adaptativas ativas do aluno.
   */
  async getActiveAdaptiveMissions(userId: string, tenantId: string) {
    const { data } = await supabase
      .from('gamificacao_missoes_adaptativas')
      .select('*')
      .eq('userId', userId)
      .eq('tenantId', tenantId)
      .eq('status', 'ACTIVE');
      
    return data || [];
  }
};
