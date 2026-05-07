// src/services/edujarvis/StrategicDecisionIA.ts
import { GoogleGenAI } from "@/services/aiClient";

export class StrategicDecisionIA {
  private static ai: GoogleGenAI;

  /**
   * IA para tomada de decisão estratégica dos gestores e diretores.
   */
  public static async generateInsights(stats: any) {
    
    this.ai = new GoogleGenAI({});

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
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(result.text || "{}");
  }
}
