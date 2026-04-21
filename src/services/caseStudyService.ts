// src/services/caseStudyService.ts
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AIService } from './aiService';

export interface CaseStudy {
  id?: string;
  tenantId: string;
  titulo: string;
  descricao: string;
  cenario: string;
  questoesDiscursivas: { pergunta: string; rubricaSugerida: string }[];
  materiaisApoio?: { nome: string; url: string }[];
  createdBy: string;
  createdAt?: any;
}

export const caseStudyService = {
  async createCaseStudy(cs: Omit<CaseStudy, 'id' | 'createdAt'>) {
    const docRef = await addDoc(collection(db, 'estudos_caso'), {
      ...cs,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  async listCaseStudies(tenantId: string): Promise<CaseStudy[]> {
    const q = query(collection(db, 'estudos_caso'), where('tenantId', '==', tenantId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as CaseStudy));
  },

  async generateWithIA(topic: string): Promise<Partial<CaseStudy>> {
    const prompt = `
      [SISTEMA]: Você é um especialista em Aprendizagem Baseada em Problemas (PBL).
      [TAREFA]: Crie um Estudo de Caso denso sobre: ${topic}.
      
      O estudo deve apresentar um problema técnico real, um contexto organizacional e 3 questões discursivas que desafiem o pensamento crítico. 
      Para cada questão, forneça uma rubrica de avaliação.
      
      Retorne um JSON:
      {
        "titulo": "Nome do Caso",
        "descricao": "Resumo executivo",
        "cenario": "Texto longo em Markdown descrevendo a situação",
        "questoesDiscursivas": [
          { "pergunta": "...", "rubricaSugerida": "..." }
        ]
      }
    `;

    try {
      const schema = {
        type: "object",
        properties: {
          titulo: { type: "string" },
          descricao: { type: "string" },
          cenario: { type: "string" },
          questoesDiscursivas: { type: "array", items: { type: "object" } }
        },
        required: ["titulo", "descricao", "cenario", "questoesDiscursivas"]
      };

      return await AIService.generateJSON<Partial<CaseStudy>>(prompt, schema, 'PREMIUM');
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
};
