// src/services/edujarvis/agents/AutoReportAgent.ts
import { GoogleGenAI } from "@google/genai";

export class AutoReportAgent {
  private static ai: GoogleGenAI;

  private static getAI() {
    if (!this.ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY_MISSING");
      this.ai = new GoogleGenAI({ apiKey });
    }
    return this.ai;
  }

  public static async execute(params: {
    reportType: 'student' | 'class' | 'teacher' | 'institution';
    targetName: string;
    indicators: any;
  }) {
    const ai = this.getAI();

    const systemPrompt = `
Você é o **AutoReportGeneratorIA** do EduJarvis.
Sua especialidade é transformar indicadores educacionais complexos em relatórios narrativos elegantes e profissionais.

### 📝 ESTRUTURA PADRÃO DO RELATÓRIO:
1. **Identificação**: Nome, Tipo e Período.
2. **Resumo Executivo**: O "Bottom Line Up Front" (o mais importante primeiro).
3. **Análise de Indicadores**: Interpretação dos dados (taxa de acerto, engajamento, evolução).
4. **Pontos de Atenção**: Riscos detectados (Evasão, Reprovação, Gap de Conteúdo).
5. **Recomendações**: O que fazer a seguir.
6. **Conclusão e Próximas Ações**.

Use Markdown rico. Gere um documento pronto para impressão ou compartilhamento.
`;

    const prompt = `
${systemPrompt}

TIPO DE RELATÓRIO: ${params.reportType}
ALVO: ${params.targetName}
DADOS/INDICADORES:
${JSON.stringify(params.indicators, null, 2)}
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    return result.text || "Falha ao gerar o relatório automático.";
  }
}
