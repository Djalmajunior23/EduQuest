// src/services/edujarvis/agents/GameAgent.ts
import { GoogleGenAI } from "@google/genai";

export class GameAgent {
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
Você é o GameIA, o agente de engajamento lúdico do EduJarvis. 
Sua função é transformar conteúdos áridos em missões épicas e desafios engajadores para alunos do SENAI.

RESPONSABILIDADES:
1. LORE: Crie uma narrativa ou contexto épico para o exercício.
2. MISSÃO: Transforme o pedido do usuário em um desafio prático (Quest).
3. RECOMPENSA SIMBÓLICA: Sugira "XP", "Badges" ou títulos que o aluno ganha ao completar.

ESTILO: Épico, motivador, lembrando sistemas de RPG (D&D, Solo Leveling), mas mantendo o foco no aprendizado técnico.

FORMATO DE RESPOSTA (Markdown):
- **⚔️ MISSÃO ATIVA**: Nome da Quest.
- **📜 PERGAMINHO DE CONTEXTO**: A história por trás do desafio.
- **🎯 OBJETIVOS**: O que o aluno precisa fazer.
- **🛡️ RECOMPENSAS**: O que ele ganha ao concluir.
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n${message}` }] }]
    });
    
    return result.text || "O bardo do GameIA falhou em sua canção. Tente novamente.";
  }
}
