import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

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
    const fullPrompt = `Você é um especialista em Design Pedagógico do Inteligência Educacional Interativa. 
    Gere uma Situação de Aprendizagem (SA) detalhada baseada no seguinte prompt: "${prompt}".
    Considere estas informações da Unidade Curricular: ${ucInfo || 'Área de TI/Desenvolvimento de Sistemas'}.
    Retorne EXCLUSIVAMENTE um objeto JSON com as seguintes chaves:
    titulo, contexto, problema_desafio, objetivo_geral, objetivos_especificos (array), entregas (array de objetos {descricao, prazo}), criterios_avaliacao (array), evidencias (array), recursos_necessarios (array), cronograma, orientacoes_aluno, orientacoes_professor.
    Não inclua markdown ou texto fora do JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: fullPrompt,
    });
    
    const text = response.text || "{}";
    
    try {
      // Basic cleanup in case Gemini returns markdown blocks
      const cleanJson = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error("Falha ao parsear JSON da IA:", text);
      throw new Error("A IA gerou um formato inválido. Tente novamente.");
    }
  },

  async generateRubricsWithIA(saId: string): Promise<any[]> {
    const sa = await this.getSA(saId);
    if (!sa) throw new Error("SA não encontrada");

    const fullPrompt = `Gere rubricas de avaliação para a seguinte Situação de Aprendizagem:
    Título: ${sa.titulo}
    Desafio: ${sa.problema_desafio}
    Critérios de Avaliação: ${sa.criterios_avaliacao.join(', ')}
    
    Retorne EXCLUSIVAMENTE um array JSON de objetos "Rubric", onde cada um tem:
    criterio (string), niveis (array de objetos {titulo, descricao, valor (0-10)}).
    Gere 3 níveis por critério (ex: Insuficiente, Regular, Excelente).`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: fullPrompt,
    });
    
    const text = response.text || "[]";
    
    try {
      const cleanJson = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error("Falha ao parsear rubricas da IA:", text);
      throw new Error("A IA gerou um formato de rubrica inválido.");
    }
  }
};
