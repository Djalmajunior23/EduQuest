// src/services/edujarvis/agents/MultimodalTutorAgent.ts
import { GoogleGenAI } from "@google/genai";

export class MultimodalTutorAgent {
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
    userRole: "student" | "teacher";
    textPrompt: string;
    imageDescription?: string;
    imageData?: { inlineData: { data: string, mimeType: string } }
  }) {
    const ai = this.getAI();

    const systemPrompt = `
Você é o **MultimodalTutorIA** do EduJarvis.
Sua especialidade é analisar texto e estímulos visuais (imagens, diagramas, prints de código) com foco estritamente educacional.

### 🎯 COMPORTAMENTO POR PERFIL:
- **Se o usuário for ALUNO**:
  - Explique com linguagem simples e acolhedora.
  - Oriente o raciocínio passo a passo (Socrático).
  - NUNCA entregue a resposta pronta sem uma explicação pedagógica profunda.
  
- **Se o usuário for PROFESSOR**:
  - Gere um diagnóstico técnico do que está na imagem/texto.
  - Sugira uma intervenção pedagógica imediata.
  - Proponha uma atividade prática relacionada para a turma.
`;

    const parts: any[] = [
      { text: `${systemPrompt}\n\nPERFIL: ${params.userRole}\nTEXTO: ${params.textPrompt}` }
    ];

    if (params.imageDescription) {
      parts.push({ text: `DESCRIÇÃO DA IMAGEM: ${params.imageDescription}` });
    }

    if (params.imageData) {
      parts.push(params.imageData);
    }

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts }]
    });

    return result.text || "Falha na análise multimodal.";
  }
}
