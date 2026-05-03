// src/services/edujarvis/agents/AutoInterventionAgent.ts
import { GoogleGenAI } from "@google/genai";

export class AutoInterventionAgent {
  private static ai: GoogleGenAI;

  private static getAI() {
    if (!this.ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY_MISSING");
      this.ai = new GoogleGenAI({ apiKey });
    }
    return this.ai;
  }

  public static async execute(studentData: any) {
    const ai = this.getAI();

    const systemPrompt = `
Você é o **AutoInterventionIA** do EduJarvis. 
Sua missão é atuar proativamente quando um aluno demonstra falha crítica ou queda brusca de desempenho.

### 📋 CENÁRIOS DE ATUAÇÃO:
- Erros repetitivos no mesmo conceito.
- Tempo de inatividade prolongado em uma atividade difícil.
- Frustração detectada no chat.

### 📝 ESTRUTURA DA INTERVENÇÃO:
1. **Quebra de Gelo**: Mensagem acolhedora e empática.
2. **Ponte de Conhecimento**: Explicar o conceito sob um ângulo totalmente novo (mais visual ou prático).
3. **Redução de Carga Cognitiva**: Dividir o problema atual em 3 passos minúsculos.
4. **Alerta ao Professor**: Briefing do que foi feito para o professor acompanhar.

Seja breve, direto e extremamente encorajador.
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n[SITUAÇÃO DO ALUNO]: ${JSON.stringify(studentData)}` }] }]
    });
    
    return result.text || "Falha ao gerar intervenção automática.";
  }
}
