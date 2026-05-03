// src/services/edujarvis/BIService.ts
import { supabase } from '../../lib/supabase';
import { TRIService, TRIItem, TRIResponse } from './TRIService';

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

export class BIService {
  /**
   * Realiza uma análise completa de uma turma.
   */
  public static async analyzeTurma(turmaId: string, tenantId: string): Promise<BIAnalysis> {
    console.log(`[BI Intelligent] Analisando turma ${turmaId}...`);

    // 1. Buscar dados de provas e simulados
    const { data: results, error } = await supabase
      .from('resultados_exames')
      .select('*, questoes(*), alunos(*)')
      .eq('turma_id', turmaId)
      .eq('tenant_id', tenantId);

    if (error || !results) {
      console.error("[BI Error]", error);
      throw new Error("FALHA_AO_BUSCAR_DADOS_BI");
    }

    // 2. Processar Proficiência TRI por Aluno
    const itemsMap = new Map<string, TRIItem>();
    const studentProficiencies: Record<string, number> = {};
    const contentsPerformance: Record<string, { correct: number, total: number }> = {};
    
    results.forEach(res => {
        const studentId = res.aluno_id;
        const responses: TRIResponse[] = res.respostas || [];
        
        // Mapear itens se não estiverem no mapa
        res.questoes?.forEach((q: any) => {
            if (!itemsMap.has(q.id)) {
                itemsMap.set(q.id, {
                    id: q.id,
                    difficulty: q.difficultade_tri || 0,
                    discrimination: q.discriminacao_tri || 1,
                    guessing: q.acerto_casual || 0.2
                });
            }
            
            // Track performance por conteúdo/competência
            const content = q.conteudo || "Geral";
            if (!contentsPerformance[content]) contentsPerformance[content] = { correct: 0, total: 0 };
            contentsPerformance[content].total++;
            
            const studentResp = responses.find(r => r.itemId === q.id);
            if (studentResp?.isCorrect) {
                contentsPerformance[content].correct++;
            }
        });

        // Estimar proficiência do aluno
        studentProficiencies[studentId] = TRIService.estimateProficiency(responses, itemsMap);
    });

    // 3. Identificar Alunos em Risco (Proficiência < -1 ou queda brusca)
    const profVals = Object.values(studentProficiencies);
    const media = profVals.reduce((a, b) => a + b, 0) / profVals.length || 0;
    const alunosEmRisco = profVals.filter(p => p < -0.5).length;

    // 4. Identificar Conteúdos Críticos
    const conteudosCriticos = Object.entries(contentsPerformance)
        .filter(([_, perf]) => (perf.correct / perf.total) < 0.5)
        .sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total))
        .map(([name]) => name)
        .slice(0, 5);

    // 5. Analisar Questões (Calibração e Dificuldade)
    const questoesAnalise = Array.from(itemsMap.values()).map(item => {
        const questaoResultados = results.filter(r => r.respostas?.some((resp: any) => resp.itemId === item.id));
        const acertos = questaoResultados.filter(r => r.respostas?.find((resp: any) => resp.itemId === item.id)?.isCorrect).length;
        const total = questaoResultados.length;
        const taxaAcerto = total > 0 ? acertos / total : 0;
        
        return {
            id: item.id,
            taxaAcerto,
            isMalCalibrada: (taxaAcerto > 0.8 && item.difficulty > 1) || (taxaAcerto < 0.2 && item.difficulty < -1)
        };
    });

    const questoesMalCalibradas = questoesAnalise
        .filter(q => q.isMalCalibrada)
        .map(q => q.id);

    // 6. Gerar Recomendações Automáticas (Brainstorm IA)
    const recomendacoes = [
        `Reforçar o conteúdo de ${conteudosCriticos[0] || 'Base'} com atividades práticas.`,
        `Aplicar intervenção imediata para os ${alunosEmRisco} alunos com baixo desempenho.`,
        `Existem ${questoesMalCalibradas.length} questões com calibração incoerente detectada pela TRI.`
    ];

    return {
      turmaId,
      totalAlunos: Object.keys(studentProficiencies).length,
      mediaProficiencia: media,
      alunosEmRisco,
      conteudosCriticos,
      competenciasFrageis: conteudosCriticos, // Simplificação
      questoesMalCalibradas,
      recomendacoes
    };
  }

  /**
   * Alias para compatibilidade com NarrativeBIAgent.
   */
  public static async getClassPerformance(turmaId: string) {
    // In a real scenario, we'd fetch the tenantId properly. 
    // Here we use a placeholder or handle it.
    return this.analyzeTurma(turmaId, "default_tenant");
  }

  /**
   * Registra log de análise para auditoria.
   */
  public static async logAnalysis(analysis: BIAnalysis, triggeredBy: string) {
    await supabase.from('bi_logs').insert({
      turma_id: analysis.turmaId,
      result: analysis,
      triggered_by: triggeredBy,
      created_at: new Date().toISOString()
    });
  }
}
