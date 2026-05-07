import { api } from '../lib/api';


import { AIService } from './aiService';
import { Type } from '@google/genai';export interface LearningSituation {
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
    const { data, error } = await api
      .from('situacoes_aprendizagem')
      .insert({
        ...sa,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .maybeSingle();

    if (error) throw error;
    return data.id;
  },

  async updateSA(id: string, sa: Partial<LearningSituation>) {
    const { error } = await api
      .from('situacoes_aprendizagem')
      .update({
        ...sa,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  },

  async getSA(id: string): Promise<LearningSituation | null> {
    const { data, error } = await api
      .from('situacoes_aprendizagem')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) return null;
    return data as LearningSituation;
  },

  async listSAs(professorId?: string): Promise<LearningSituation[]> {
    let query = api.from('situacoes_aprendizagem').select('*');
    if (professorId) {
      query = query.eq('created_by', professorId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data as LearningSituation[] || [];
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
