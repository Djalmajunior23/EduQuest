import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AIService } from './aiService';
import { Type } from '@google/genai';

export interface LearningSituation {
  id?: string;
  titulo: string;
  contexto: string;
  problema_desafio: string;
  objetivo_geral: string;
  objetivos_especificos: string[];
  entregas: { descricao: string; prazo: string }[];
  criterios_avaliacao: string[];
  rubricas: any[];
  evidencias: string[];
  ucId: string;
  conhecimentoTecnicoIds: string[];
  capacidadeTecnicaIds: string[];
  recursos_necessarios: string[];
  cronograma: string;
  orientacoes_aluno: string;
  orientacoes_professor: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isTemplate: boolean;
  createdBy: string;
  createdAt?: any;
  updatedAt?: any;
}

export const saService = {
  async createSA(sa: Omit<LearningSituation, 'id' | 'createdAt' | 'updatedAt'>) {
    const docRef = await addDoc(collection(db, 'situacoes_aprendizagem'), {
      ...sa,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  async updateSA(id: string, sa: Partial<LearningSituation>) {
    const docRef = doc(db, 'situacoes_aprendizagem', id);
    await updateDoc(docRef, {
      ...sa,
      updatedAt: serverTimestamp()
    });
  },

  async getSA(id: string): Promise<LearningSituation | null> {
    const docSnap = await getDoc(doc(db, 'situacoes_aprendizagem', id));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as LearningSituation;
    }
    return null;
  },

  async listSAs(professorId?: string): Promise<LearningSituation[]> {
    let q = query(collection(db, 'situacoes_aprendizagem'));
    if (professorId) {
      q = query(q, where('createdBy', '==', professorId));
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LearningSituation));
  },

  async generateSAWithIA(prompt: string, ucInfo?: string): Promise<Partial<LearningSituation>> {
    const fullPrompt = `Você é um especialista em Design Pedagógico. 
    Gere uma Situação de Aprendizagem (SA) detalhada baseada no seguinte prompt: "${prompt}".
    Considere estas informações: ${ucInfo || 'Área de TI/Desenvolvimento de Sistemas'}.`;

    const schema = {
       type: Type.OBJECT,
       properties: {
          titulo: { type: Type.STRING },
          contexto: { type: Type.STRING },
          problema_desafio: { type: Type.STRING },
          objetivo_geral: { type: Type.STRING },
          objetivos_especificos: { type: Type.ARRAY, items: { type: Type.STRING } },
          entregas: {
             type: Type.ARRAY,
             items: {
                type: Type.OBJECT,
                properties: {
                   descricao: { type: Type.STRING },
                   prazo: { type: Type.STRING }
                }
             }
          },
          criterios_avaliacao: { type: Type.ARRAY, items: { type: Type.STRING } },
          evidencias: { type: Type.ARRAY, items: { type: Type.STRING } },
          recursos_necessarios: { type: Type.ARRAY, items: { type: Type.STRING } },
          cronograma: { type: Type.STRING },
          orientacoes_aluno: { type: Type.STRING },
          orientacoes_professor: { type: Type.STRING }
       }
    };

    return AIService.generateJSON<Partial<LearningSituation>>(fullPrompt, schema, 'PREMIUM');
  },

  async generateRubricsWithIA(saId: string): Promise<any[]> {
    const sa = await this.getSA(saId);
    if (!sa) throw new Error("SA não encontrada");

    const fullPrompt = `Gere rubricas de avaliação para a seguinte Situação de Aprendizagem:
    Título: ${sa.titulo}
    Desafio: ${sa.problema_desafio}
    Critérios de Avaliação: ${(sa.criterios_avaliacao || []).join(', ')}`;

    const schema = {
       type: Type.ARRAY,
       items: {
          type: Type.OBJECT,
          properties: {
             criterio: { type: Type.STRING },
             niveis: {
                type: Type.ARRAY,
                items: {
                   type: Type.OBJECT,
                   properties: {
                      titulo: { type: Type.STRING },
                      descricao: { type: Type.STRING },
                      valor: { type: Type.NUMBER }
                   }
                }
             }
          }
       }
    };

    return AIService.generateJSON<any[]>(fullPrompt, schema, 'PREMIUM');
  }
};
