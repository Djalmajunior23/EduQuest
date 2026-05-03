// src/services/edujarvis/AdaptiveExamService.ts
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

export type Nivel = "facil" | "medio" | "dificil";

export interface Question {
  id: string;
  tema: string;
  nivel: Nivel;
  enunciado: string;
  alternativas: string[];
  gabarito: string;
  explicacao: string;
}

export class AdaptiveExamService {
  private static SESSIONS_COLLECTION = 'simulado_adaptativo_sessoes';
  private static QUESTIONS_COLLECTION = 'questoes';
  private static ANSWERS_COLLECTION = 'simulado_adaptativo_respostas';

  public static async createSession(alunoId: string, turmaId?: string) {
    const docRef = await addDoc(collection(db, this.SESSIONS_COLLECTION), {
      alunoId,
      turmaId,
      status: 'em_andamento',
      nivelAtual: 'facil',
      acertos: 0,
      erros: 0,
      totalRespondidas: 0,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id };
  }

  public static async getNextQuestion(sessaoId: string, tema?: string): Promise<Question | null> {
    const sessaoSnap = await getDoc(doc(db, this.SESSIONS_COLLECTION, sessaoId));
    if (!sessaoSnap.exists()) throw new Error("Sessão não encontrada");
    
    const sessao = sessaoSnap.data();

    // Buscar IDs já respondidos
    const q = query(
      collection(db, this.ANSWERS_COLLECTION),
      where('sessaoId', '==', sessaoId)
    );
    const respondidasSnap = await getDocs(q);
    const respondidasIds = respondidasSnap.docs.map(d => d.data().questaoId);

    // Buscar próxima questão do nível atual
    let qBase = query(
      collection(db, this.QUESTIONS_COLLECTION),
      where('nivel', '==', sessao.nivelAtual),
      limit(20) // Pegar algumas para filtrar as já respondidas no código (limitador do Firestore)
    );

    if (tema) {
      qBase = query(qBase, where('tema', '==', tema));
    }

    const questoesSnap = await getDocs(qBase);
    const questoes = questoesSnap.docs
      .map(d => ({ id: d.id, ...d.data() } as Question))
      .filter(q => !respondidasIds.includes(q.id));

    return questoes.length > 0 ? questoes[0] : null;
  }

  public static async answerQuestion(params: {
    sessaoId: string,
    questaoId: string,
    alunoId: string,
    resposta: string
  }) {
    const questaoSnap = await getDoc(doc(db, this.QUESTIONS_COLLECTION, params.questaoId));
    if (!questaoSnap.exists()) throw new Error("Questão não encontrada");
    
    const questao = questaoSnap.data();
    const acertou = params.resposta.trim().toLowerCase() === questao.gabarito.trim().toLowerCase();

    // Salvar resposta
    await addDoc(collection(db, this.ANSWERS_COLLECTION), {
      sessaoId: params.sessaoId,
      questaoId: params.questaoId,
      alunoId: params.alunoId,
      resposta: params.resposta,
      acertou,
      createdAt: serverTimestamp()
    });

    // Atualizar sessão
    const sessaoRef = doc(db, this.SESSIONS_COLLECTION, params.sessaoId);
    const sessaoSnap = await getDoc(sessaoRef);
    const sessaoData = sessaoSnap.data()!;

    const novosAcertos = (sessaoData.acertos || 0) + (acertou ? 1 : 0);
    const novosErros = (sessaoData.erros || 0) + (acertou ? 0 : 1);
    const total = novosAcertos + novosErros;
    
    const nivelAtual = this.calculateNextLevel(novosAcertos, novosErros);

    await updateDoc(sessaoRef, {
      acertos: novosAcertos,
      erros: novosErros,
      totalRespondidas: total,
      nivelAtual: nivelAtual,
      status: total >= 10 ? 'finalizado' : 'em_andamento'
    });

    return {
      acertou,
      explicacao: questao.explicacao,
      proximoNivel: nivelAtual,
      finalizado: total >= 10
    };
  }

  private static calculateNextLevel(acertos: number, erros: number): Nivel {
    const total = acertos + erros;
    const taxa = total === 0 ? 0 : acertos / total;

    if (taxa >= 0.75) return "dificil";
    if (taxa >= 0.5) return "medio";
    return "facil";
  }
}
