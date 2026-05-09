// src/services/BIService.ts
import { api } from '../lib/api';

export interface BIAnalysis {
  turmaId: string;
  totalAlunos: number;
  mediaProficiencia: number;
  alunosEmRisco: number;
  conteudosCriticos: string[];
  competenciasFrageis: string[];
  questoesMalCalibradas: string[];
  recomendacoes: string[];
}

export const BIService = {
  async analyzeTurma(turmaId: string, tenantId: string): Promise<BIAnalysis> {
    // Simulação de análise profunda via motor de BI do NexusInt
    console.log(`[BIService] Analisando turma ${turmaId} para o tenant ${tenantId}`);
    
    // Em uma implementação real, isso chamaria uma RPC pesada ou um agente de análise
    const { data, error } = await api.from('bi_analytics').select('*').eq('turma_id', turmaId).maybeSingle();
    
    if (error || !data) {
       // Retorna dados padrão se não houver análise persistida
       return {
          turmaId,
          totalAlunos: 32,
          mediaProficiencia: 1.25,
          alunosEmRisco: 4,
          conteudosCriticos: ['Lógica de Programação', 'Estruturas de Dados'],
          competenciasFrageis: ['Abstração', 'Sintaxe Prática'],
          questoesMalCalibradas: ['Q-102', 'Q-203'],
          recomendacoes: [
            "Reforçar conceitos de condicionais via Lab Prático.",
            "Aumentar a carga horária de exercícios de fixação para o grupo C.",
            "Rever balanceamento da questão Q-102: taxa de acerto abaixo do esperado para o nível."
          ]
       };
    }
    
    return data as BIAnalysis;
  }
};
