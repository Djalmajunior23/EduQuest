// src/services/edujarvis/agents/NarrativeBIAgent.ts
import { GoogleGenAI } from "@google/genai";
import { BIService } from "../BIService";

export class NarrativeBIAgent {
  private static ai: GoogleGenAI;

  private static getAI() {
    if (!this.ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY_MISSING");
      this.ai = new GoogleGenAI({ apiKey });
    }
    return this.ai;
  }

  public static async execute(turmaId: string) {
    const summary = await BIService.getClassPerformance(turmaId);
    if (!summary) return "Não há dados suficientes da turma para gerar um relatório narrativo ainda.";

    const ai = this.getAI();

    const systemPrompt = `
Você é o AnalystIA, o motor de BI Narrativo do EduJarvis. 
Sua função é traduzir logs frios de acertos e erros em diagnósticos pedagógicos acionáveis para o professor.

FORMATO DE RESPOSTA (Markdown):
1. **📊 PANORAMA DA TURMA**: Resumo rápido da saúde da turma.
2. **⚠️ ZONAS CRÍTICAS**: Conteúdos onde a taxa de acerto está baixa.
3. **💡 INSIGHTS PEDAGÓGICOS**: Por que os alunos estão errando? (Inverta o BI em pedagogia).
4. **🚀 PLANO DE INTERVENÇÃO**: 3 ações práticas que o professor pode tomar amanhã.

Seja técnico, factual e mantenha o tom de um consultor de elite.
`;

    const userPrompt = `
DADOS CONSOLIDADOS DA TURMA (ID: ${turmaId}):
${JSON.stringify(summary, null, 2)}

Gere o relatório narrativo para o professor.
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }]
    });
    
    return result.text || "Falha ao processar análise narrativa.";
  }
}
