// src/services/edujarvis/StrategicDecisionIA.ts
import { GoogleGenAI } from '@google/genai';

export class StrategicDecisionIA {
  private static ai: GoogleGenAI;

  /**
   * IA para tomada de decisão estratégica dos gestores e diretores.
   */
  public static async generateInsights(stats: any) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY_MISSING");
    this.ai = new GoogleGenAI({ apiKey });

    const prompt = `
Aja como Diretor Acadêmico Estratégico. Analise os dados da instituição e sugira 3 ações imediatas de alto impacto.
Dados de Performance: ${JSON.stringify(stats)}

Retorne um JSON:
{
  "topUrgency": "Onde agir agora",
  "investmentSuggestion": "Onde investir tempo/recurso",
  "teacherSupport": "Quais professores precisam de apoio",
  "curriculumHealth": "Score 0-100"
}
`;

    const result = await this.ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(result.text || "{}");
  }
}
