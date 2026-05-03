// src/services/edujarvis/agents/AnalystIA.ts
import { AIService } from "../../aiService";
import { BIService, BIAnalysis } from "../BIService";

export class AnalystIA {
  /**
   * Executa a análise profunda da turma e gera o relatório.
   */
  public static async execute(turmaId: string, tenantId: string, additionalContext?: string) {
    try {
      const analysis = await BIService.analyzeTurma(turmaId, tenantId);
      if (!analysis) {
        return "Dados insuficientes da turma para realizar o diagnóstico analítico.";
      }
      return await this.generatePedagogicalReport(analysis, additionalContext);
    } catch (error) {
      console.error("[AnalystIA] Execution Error:", error);
      return "O bardo analítico encontrou uma fenda dimensional ao buscar os dados da turma. Tente novamente.";
    }
  }

  /**
   * Gera um relatório analítico profundo baseado nos dados de BI da turma.
   */
  public static async generatePedagogicalReport(analysis: BIAnalysis, additionalContext?: string) {
    const systemPrompt = `
Você é o **AnalystIA**, o cérebro neural analítico do EduJarvis. 
Sua responsabilidade é analisar o desempenho da turma, identificar dificuldades de aprendizagem, mapear competências frágeis e gerar relatórios pedagógicos de elite.

### 🎯 DIRETRIZES DE ATUAÇÃO:
1. **DIAGNÓSTICO PRECISO**: Apresente uma visão clara do estado atual da turma.
2. **EVIDÊNCIAS DATA-DRIVEN**: Utilize os dados de proficiência (TRI) e acertos para sustentar cada afirmação.
3. **RISCOS PEDAGÓGICOS**: Alerte sobre alunos que podem ficar para trás ou conteúdos que estão impedindo o progresso.
4. **RECOMENDAÇÕES PRÁTICAS**: O professor deve saber exatamente o que fazer após ler seu relatório.

### 📝 ESTRUTURA MANDATÓRIA (Markdown):
# 📈 DIAGNÓSTICO ANALÍTICO: TURMA [ID]
## 🔍 QUADRO GERAL DE PROFICIÊNCIA
[Análise baseada na média de proficiência TRI e engajamento]

## ⚠️ MAPEAMENTO DE COMPETÊNCIAS FRÁGEIS (GAPS)
- **Competência**: [Nome] | **Status**: Crítico
- **Evidência**: [Métrica do BI]
- **Impacto**: [O que acontece se não for corrigido]

## 🚨 ALERTAS DE RISCO ACADÊMICO
[Identificação de padrões de risco em grupos de alunos]

## 💡 RECOMENDAÇÕES E INTERVENÇÕES
1. **Ação Imediata**: [Sugestão prática]
2. **Estratégia de Longo Prazo**: [Recomendação estrutural]

---
*Análise fundamentada em Teoria de Resposta ao Item (TRI) e Performance Cognitiva.*
`;

    const fullPrompt = `
[DADOS DE BI DA TURMA]:
${JSON.stringify(analysis, null, 2)}

[CONTEXTO ADICIONAL]:
${additionalContext || "Análise padrão de desempenho."}

[TAREFA]: Gere o diagnóstico analítico completo seguindo o guia acima.
`;

    return await AIService.generate(fullPrompt, systemPrompt);
  }
}
