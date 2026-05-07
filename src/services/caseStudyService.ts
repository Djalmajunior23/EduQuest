import { api } from '../lib/api';


// src/services/caseStudyService.ts
import { AIService } from './aiService';export interface CaseStudy {
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
    const { data, error } = await api
      .from('estudos_caso')
      .insert({
        tenant_id: cs.tenantId,
        titulo: cs.titulo,
        descricao: cs.descricao,
        cenario: cs.cenario,
        questoes_discursivas: cs.questoesDiscursivas,
        materiais_apoio: cs.materiaisApoio,
        created_by: cs.createdBy,
        created_at: new Date().toISOString()
      })
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data.id;
  },

  async listCaseStudies(tenantId: string): Promise<CaseStudy[]> {
    const { data, error } = await api
      .from('estudos_caso')
      .select('*')
      .eq('tenant_id', tenantId);
    
    if (error) throw error;
    return (data || []).map(d => ({
      id: d.id,
      tenantId: d.tenant_id,
      titulo: d.titulo,
      descricao: d.descricao,
      cenario: d.cenario,
      questoesDiscursivas: d.questoes_discursivas,
      materiaisApoio: d.materiais_apoio,
      createdBy: d.created_by,
      createdAt: d.created_at
    } as CaseStudy));
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
