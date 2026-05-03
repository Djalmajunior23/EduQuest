// src/services/edujarvis/GameIAService.ts
import { supabase } from '../../lib/supabase';
import { AIService } from '../aiService';
import { StudentDigitalTwinService } from './StudentDigitalTwinService';
import { adaptiveMissionService } from '../adaptiveMissionService';

export class GameIAService {
  /**
   * Gera uma missão épica baseada no contexto atual do aluno.
   */
  public static async generateEpicQuest(userId: string, tenantId: string, topic?: string) {
    const twin = await StudentDigitalTwinService.getTwin(userId);
    const profile = await adaptiveMissionService.determineStudentProfile(userId);
    
    const prompt = `
      CONTEXTO DO ALUNO:
      - Perfil: ${profile}
      - Nível: ${twin?.nivel || 'Iniciante'}
      - Disciplinas Fortes: ${twin?.pontosFortes?.join(', ') || 'Não identificado'}
      - Lacunas de Aprendizado: ${twin?.dificuldades?.join(', ') || 'Nenhuma identificada'}
      - Engajamento: ${twin?.engajamento || 0}%
      
      TÓPICO ATUAL (Opcional): ${topic || 'Geral/Tecnologia'}
      
      TAREFA:
      Crie uma MISSÃO ÉPICA (Quests) que engaje esse aluno. A missão deve ter:
      1. Título Narrativo (ex: "O Despertar do Código", "Invasão no Servidor Central")
      2. Descrição com Storytelling (um pequeno contexto de RPG)
      3. Objetivo Técnico Claro (o que ele deve aprender ou praticar)
      4. Recompensas (XP, Tokens, Badge sujerida)
    `;

    const schema = {
      type: "object",
      properties: {
        title: { type: "string" },
        story: { type: "string" },
        objective: { type: "string" },
        difficulty: { type: "string", enum: ["EASY", "MEDIUM", "HARD"] },
        xp: { type: "number" },
        tokens: { type: "number" },
        badgeName: { type: "string" }
      },
      required: ["title", "story", "objective", "difficulty", "xp", "tokens", "badgeName"]
    };

    try {
      return await AIService.generateJSON(prompt, schema);
    } catch (error) {
      console.error("[GameIA] Erro ao gerar quest épica:", error);
      return {
        title: "🛡️ Desafio de Proteção do Reino",
        story: "Os firewalls do sistema estão enfraquecendo. Sua missão é reforçar as defesas.",
        objective: "Resolver 5 exercícios de lógica básica.",
        difficulty: "EASY",
        xp: 150,
        tokens: 10,
        badgeName: "Defensor Iniciante"
      };
    }
  }

  /**
   * Sincroniza o progresso do "Gêmeo Digital" com os sistemas de gamificação.
   */
  public static async syncRewardSystem(userId: string, xpGained: number) {
    // Busca saldo atual
    const { data: user, error: fetchError } = await supabase
      .from('usuarios')
      .select('xp, nivel')
      .eq('id', userId)
      .single();

    if (fetchError || !user) return;

    const newXp = (user.xp || 0) + xpGained;
    const newLevel = Math.floor(newXp / 1000) + 1; // Regra de negócio: cada 1000 XP mata um nível

    // Atualiza no banco
    await supabase
      .from('usuarios')
      .update({
        xp: newXp,
        nivel: newLevel.toString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    // Registra no histórico de gamificação
    await supabase
      .from('gamificacao_historico')
      .insert({
        user_id: userId,
        xp: xpGained,
        tipo: 'RECOMPENSA_IA',
        descricao: 'Missão concluída via GameIA Agent',
        created_at: new Date().toISOString()
      });
      
    return { newXp, newLevel };
  }

  /**
   * Gera um sistema de recompensa dinâmico para uma atividade específica que o professor criou.
   */
  public static async createActivityRewards(activityId: string, difficulty: string) {
    const xpBase = difficulty === 'HARD' ? 500 : difficulty === 'MEDIUM' ? 300 : 150;
    const tokenBase = difficulty === 'HARD' ? 50 : difficulty === 'MEDIUM' ? 25 : 10;
    
    return {
      activityId,
      xp: xpBase,
      tokens: tokenBase,
      bonusEligible: true
    };
  }
}
