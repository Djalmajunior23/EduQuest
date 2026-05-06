// src/services/edujarvis/AdaptiveLearningEngine.ts
import { supabase } from '../../lib/supabase';
import { LearningEvent, StudentCognitiveMemory } from './types';

export class AdaptiveLearningEngine {
  private static COLLECTION = 'student_cognitive_memory';
  private static EVENTS_COLLECTION = 'learning_events';

  /**
   * Obtém a memória cognitiva do aluno
   */
  public static async getStudentMemory(alunoId: string): Promise<StudentCognitiveMemory | null> {
    const { data, error } = await supabase
      .from(this.COLLECTION)
      .select('*')
      .eq('aluno_id', alunoId)
      .single();
    
    if (error) return null;
    return {
      alunoId: data.aluno_id,
      nivel: data.nivel,
      estiloAprendizagem: data.estilo_aprendizagem || data.estiloAprendizagem,
      dificuldades: data.dificuldades || [],
      pontosFortes: data.pontos_fortes || data.pontosFortes || [],
      errosFrequentes: data.erros_frequentes || data.errosFrequentes || [],
      taxaAcerto: data.taxa_acerto || data.taxaAcerto,
      tempoMedioResposta: data.tempo_medio_resposta || data.tempoMedioResposta,
      totalEventos: data.total_eventos || data.totalEventos,
      ultimaInteracao: data.ultima_interacao || data.ultimaInteracao
    } as StudentCognitiveMemory;
  }

  /**
   * Processa um novo evento de aprendizagem e atualiza a memória do aluno
   */
  public static async processEvent(event: LearningEvent): Promise<StudentCognitiveMemory> {
    const existingMemory = await this.getStudentMemory(event.alunoId);

    // Salva o evento no histórico global para BI
    await supabase.from(this.EVENTS_COLLECTION).insert({
      ...event,
      timestamp: new Date().toISOString()
    });

    const memory: StudentCognitiveMemory = existingMemory || {
      alunoId: event.alunoId,
      nivel: "iniciante",
      estiloAprendizagem: "misto",
      dificuldades: [],
      pontosFortes: [],
      errosFrequentes: [],
      taxaAcerto: 0,
      tempoMedioResposta: 0,
      totalEventos: 0,
      ultimaInteracao: new Date().toISOString()
    };

    const newTotalEventos = (memory.totalEventos || 0) + 1;
    const acertosAnteriores = Math.round((memory.taxaAcerto || 0) * (memory.totalEventos || 0));
    const novosAcertos = acertosAnteriores + (event.acertou ? 1 : 0);
    const novaTaxaAcerto = novosAcertos / newTotalEventos;

    const novoTempoMedio = (((memory.tempoMedioResposta || 0) * (memory.totalEventos || 0)) + event.tempoRespostaSegundos) / newTotalEventos;

    // Lógica de atualização de listas
    const newDificuldades = [...(memory.dificuldades || [])];
    const newErrosFrequentes = [...(memory.errosFrequentes || [])];
    const newPontosFortes = [...(memory.pontosFortes || [])];

    if (!event.acertou) {
      if (!newDificuldades.includes(event.conteudo)) newDificuldades.push(event.conteudo);
      if (event.tipoErro && !newErrosFrequentes.includes(event.tipoErro)) newErrosFrequentes.push(event.tipoErro);
    } else {
      if (!newPontosFortes.includes(event.conteudo)) newPontosFortes.push(event.conteudo);
    }

    const updates: any = {
      aluno_id: event.alunoId,
      total_eventos: newTotalEventos,
      taxa_acerto: Number(novaTaxaAcerto.toFixed(2)),
      tempo_medio_resposta: Number(novoTempoMedio.toFixed(2)),
      ultima_interacao: new Date().toISOString(),
      nivel: this.calculateLevel(novaTaxaAcerto, novoTempoMedio),
      dificuldades: newDificuldades,
      erros_frequentes: newErrosFrequentes,
      pontos_fortes: newPontosFortes
    };

    const { data: updatedData, error: updateError } = await supabase
      .from(this.COLLECTION)
      .upsert(updates)
      .select()
      .single();

    if (updateError) throw updateError;

    return {
      alunoId: updatedData.aluno_id,
      nivel: updatedData.nivel,
      estiloAprendizagem: updatedData.estilo_aprendizagem || updatedData.estiloAprendizagem,
      dificuldades: updatedData.dificuldades || [],
      pontosFortes: updatedData.pontos_fortes || updatedData.pontosFortes || [],
      errosFrequentes: updatedData.erros_frequentes || updatedData.errosFrequentes || [],
      taxaAcerto: updatedData.taxa_acerto || updatedData.taxaAcerto,
      tempoMedioResposta: updatedData.tempo_medio_resposta || updatedData.tempoMedioResposta,
      totalEventos: updatedData.total_eventos || updatedData.totalEventos,
      ultimaInteracao: updatedData.ultima_interacao || updatedData.ultimaInteracao
    } as StudentCognitiveMemory;
  }

  private static calculateLevel(taxaAcerto: number, tempoMedio: number): "iniciante" | "intermediario" | "avancado" {
    if (taxaAcerto >= 0.8 && tempoMedio <= 60) return "avancado";
    if (taxaAcerto >= 0.55) return "intermediario";
    return "iniciante";
  }

  public static generateAdaptiveInstruction(memory: StudentCognitiveMemory): string {
    return `
[PERFIL COGNITIVO DO ALUNO]:
- Nível Atual: ${memory.nivel}
- Taxa de Acerto: ${(memory.taxaAcerto || 0) * 100}%
- Tempo Médio de Resposta: ${memory.tempoMedioResposta}s
- Pontos Fortes: ${(memory.pontosFortes || []).slice(-3).join(", ") || "Em mapeamento"}
- Principais Dificuldades: ${(memory.dificuldades || []).slice(-3).join(", ") || "Em mapeamento"}

ADAPTAÇÃO REQUERIDA:
1. Nível ${memory.nivel}: Ajuste o vocabulário e complexidade dos exemplos.
2. Foco em Reforço: Se houver dificuldades latentes, priorize explicá-las antes de novos temas.
3. Não dê a resposta pronta, use o perfil para guiar o raciocínio.
`;
  }
}

