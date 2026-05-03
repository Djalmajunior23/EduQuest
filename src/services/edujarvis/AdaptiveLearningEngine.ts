// src/services/edujarvis/AdaptiveLearningEngine.ts
import { doc, getDoc, setDoc, updateDoc, increment, arrayUnion, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { LearningEvent, StudentCognitiveMemory } from './types';

export class AdaptiveLearningEngine {
  private static COLLECTION = 'student_cognitive_memory';
  private static EVENTS_COLLECTION = 'learning_events';

  /**
   * Obtém a memória cognitiva do aluno
   */
  public static async getStudentMemory(alunoId: string): Promise<StudentCognitiveMemory | null> {
    const memoryDoc = await getDoc(doc(db, this.COLLECTION, alunoId));
    if (memoryDoc.exists()) {
      return memoryDoc.data() as StudentCognitiveMemory;
    }
    return null;
  }

  /**
   * Processa um novo evento de aprendizagem e atualiza a memória do aluno
   */
  public static async processEvent(event: LearningEvent): Promise<StudentCognitiveMemory> {
    const memoryRef = doc(db, this.COLLECTION, event.alunoId);
    const existingMemory = await this.getStudentMemory(event.alunoId);

    // Salva o evento no histórico global para BI
    await addDoc(collection(db, this.EVENTS_COLLECTION), {
      ...event,
      timestamp: serverTimestamp()
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
      ultimaInteracao: serverTimestamp()
    };

    const newTotalEventos = memory.totalEventos + 1;
    const acertosAnteriores = Math.round(memory.taxaAcerto * memory.totalEventos);
    const novosAcertos = acertosAnteriores + (event.acertou ? 1 : 0);
    const novaTaxaAcerto = novosAcertos / newTotalEventos;

    const novoTempoMedio = (memory.tempoMedioResposta * memory.totalEventos + event.tempoRespostaSegundos) / newTotalEventos;

    // Lógica de atualização de listas
    const updates: any = {
      totalEventos: increment(1),
      taxaAcerto: Number(novaTaxaAcerto.toFixed(2)),
      tempoMedioResposta: Number(novoTempoMedio.toFixed(2)),
      ultimaInteracao: serverTimestamp(),
      nivel: this.calculateLevel(novaTaxaAcerto, novoTempoMedio)
    };

    if (!event.acertou) {
      updates.dificuldades = arrayUnion(event.conteudo);
      if (event.tipoErro) updates.errosFrequentes = arrayUnion(event.tipoErro);
    } else {
      updates.pontosFortes = arrayUnion(event.conteudo);
    }

    await setDoc(memoryRef, updates, { merge: true });

    return { ...memory, ...updates } as StudentCognitiveMemory;
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
- Taxa de Acerto: ${memory.taxaAcerto * 100}%
- Tempo Médio de Resposta: ${memory.tempoMedioResposta}s
- Pontos Fortes: ${memory.pontosFortes.slice(-3).join(", ") || "Em mapeamento"}
- Principais Dificuldades: ${memory.dificuldades.slice(-3).join(", ") || "Em mapeamento"}

ADAPTAÇÃO REQUERIDA:
1. Nível ${memory.nivel}: Ajuste o vocabulário e complexidade dos exemplos.
2. Foco em Reforço: Se houver dificuldades latentes, priorize explicá-las antes de novos temas.
3. Não dê a resposta pronta, use o perfil para guiar o raciocínio.
`;
  }
}

