// src/services/edujarvis/agents/AssessmentAgent.ts
import { GoogleGenAI } from "@google/genai";
import { AssessmentRubric } from "../types";

export class AssessmentAgent {
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
    activityDescription: string;
    studentSubmission: string;
    rubric: AssessmentRubric;
  }) {
    const ai = this.getAI();

    const systemPrompt = `
Você é o **AI Assessment Engine** do EduJarvis.
Sua missão é avaliar a entrega do aluno com base rigorosa em uma rubrica pedagógica.

### 📝 ESTRUTURA DA RESPOSTA:
1. **Nota por Critério**: Avaliação individual de cada critério da rubrica.
2. **Nota Final Estimada**: Valor numérico ou conceito.
3. **Evidências da Avaliação**: Trechos da entrega que sustentam a nota.
4. **Feedback ao Aluno**: Dicas didáticas de como melhorar.
5. **Feedback ao Professor**: Resumo executivo do desempenho.
6. **Sugestão de Recuperação**: Tópico ou atividade para compensar lacunas detectadas.

Mantenha a imparcialidade e o foco no crescimento acadêmico.
`;

    const prompt = `
${systemPrompt}

### ATIVIDADE:
${params.activityDescription}

### ENTREGA DO ALUNO:
${params.studentSubmission}

### RUBRICA DE AVALIAÇÃO:
${JSON.stringify(params.rubric, null, 2)}
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    return result.text || "Falha na avaliação automática.";
  }
}
