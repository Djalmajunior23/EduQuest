// src/services/simulationService.ts
import { supabase } from '../lib/supabase';
import { AIService } from './aiService';

export interface Simulation {
  id?: string;
  tenantId: string;
  titulo: string;
  tipo: 'LOGICA' | 'CODIGO' | 'DB' | 'REDES' | 'DECISAO';
  cenario: string;
  etapas: SimulationStep[];
  createdBy: string;
  createdAt?: any;
}

export interface SimulationStep {
  id: string;
  descricao: string;
  opcoes: {
    texto: string;
    consequencia: string;
    proximaEtapaId?: string;
    feedback: string;
    pontosXP: number;
    correta?: boolean;
  }[];
}

export const simulationService = {
  async createSimulation(sim: Omit<Simulation, 'id' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('simuladores')
      .insert({
        tenant_id: sim.tenantId,
        titulo: sim.titulo,
        tipo: sim.tipo,
        cenario: sim.cenario,
        etapas: sim.etapas,
        created_by: sim.createdBy,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data.id;
  },

  async listSimulations(tenantId: string): Promise<Simulation[]> {
    const { data, error } = await supabase
      .from('simuladores')
      .select('*')
      .eq('tenant_id', tenantId);
    
    if (error) throw error;
    return (data || []).map(d => ({
      id: d.id,
      tenantId: d.tenant_id,
      titulo: d.titulo,
      tipo: d.tipo,
      cenario: d.cenario,
      etapas: d.etapas,
      createdBy: d.created_by,
      createdAt: d.created_at
    } as Simulation));
  },

  async generateWithIA(topic: string, type: Simulation['tipo']): Promise<Partial<Simulation>> {
    const prompt = `
      [SISTEMA]: Você é um designer de simuladores educacionais de tecnologia.
      [TAREFA]: Crie um simulador dinâmico do tipo ${type} sobre o tema: ${topic}.
      
      O simulador deve ter um cenário inicial e pelo menos 3 etapas de tomada de decisão.
      Cada decisão deve levar a uma consequência técnica e um feedback pedagógico.
      
      Retorne um JSON seguindo esta estrutura:
      {
        "titulo": "Nome Impactante",
        "cenario": "Contexto do problema real",
        "etapas": [
          {
            "id": "1",
            "descricao": "O que acontece agora?",
            "opcoes": [
              { "texto": "Opção A", "consequencia": "Resultado técnico", "feedback": "Por que isso é bom/ruim", "proximaEtapaId": "2", "pontosXP": 50 }
            ]
          }
        ]
      }
    `;

    try {
      const schema = {
        type: "object",
        properties: {
          titulo: { type: "string" },
          cenario: { type: "string" },
          etapas: { type: "array", items: { type: "object" } }
        },
        required: ["titulo", "cenario", "etapas"]
      };

      return await AIService.generateJSON<Partial<Simulation>>(prompt, schema, 'PREMIUM');
    } catch (error) {
      console.error("AI Simulation Error:", error);
      throw error;
    }
  }
};
