// src/services/edujarvis/agents/RecoveryAgent.ts
import { GoogleGenAI } from "@google/genai";

export class RecoveryAgent {
  private static ai: GoogleGenAI;

  private static getAI() {
    if (!this.ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY_MISSING");
      this.ai = new GoogleGenAI({ apiKey });
    }
    return this.ai;
  }

  public static async execute(message: string, context: any) {
    const ai = this.getAI();

    const systemPrompt = `
Você é o **RecoveryIA** do EduJarvis, especialista em resgate pedagógico.
Sua missão é criar um plano de recuperação personalizado para alunos com dificuldades.

### 🚨 PLANO DE RECUPERAÇÃO:
1. **Conteúdos a Revisar**: Quais tópicos base precisam ser revisitados.
2. **Explicação Simplificada**: Use analogias e linguagem fácil para explicar o ponto de trava.
3. **Sequência de Estudo**: Um passo a passo lógico para o aluno se situar.
4. **Exercícios Práticos**: Desafios rápidos de fixação.
5. **Mini-Avaliação**: 2 ou 3 perguntas de validação.
6. **Missão Gamificada**: Transforme o estudo em um desafio épico.
7. **Critério de Sucesso**: Como saberemos que o aluno recuperou o conhecimento?

Use uma linguagem extremamente motivadora e acolhedora para adolescentes.
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nDificuldades: ${context.dificuldades?.join(", ") || message}\nNível do Aluno: ${context.nivel || "iniciante"}` }] }]
    });
    
    return result.text || "Falha ao gerar plano de recuperação.";
  }
}
