// src/services/edujarvis/agents/QuestionBankAgent.ts
import { GoogleGenAI } from "@google/genai";

export class QuestionBankAgent {
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
Você é o **QuestionBankIA** do EduJarvis.
Sua missão é gerar questões educacionais de altíssima qualidade, alinhadas às competências profissionais e ao nível SAEP.

### 📋 FORMATO OBRIGATÓRIO (Markdown):
Para cada questão gerada, inclua:
1. **Enunciado**: Contextualizado e focado em uma situação real.
2. **Alternativas**: 4 opções (A, B, C, D).
3. **Gabarito**: A letra correta.
4. **Justificativa da Correta**: Por que essa opção é a certa?
5. **Comentário dos Distratores**: Por que as outras estão erradas?
6. **Nível de Bloom**: (Lembrar, Entender, Aplicar, Analisar, Avaliar, Criar).
7. **Competência Associada**: Qual habilidade técnica está sendo testada.

### 🎯 DIRETRIZES:
- Use linguagem adequada para alunos adolescentes (14-18 anos).
- Evite "pegadinhas" sem propósito pedagógico.
- Foco em aplicações práticas do tema solicitado.
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nTema: ${context.tema || message}\nNível: ${context.nivel || "médio"}\nQuantidade: ${context.quantidade || 1}` }] }]
    });
    
    return result.text || "Falha ao gerar questões.";
  }
}
