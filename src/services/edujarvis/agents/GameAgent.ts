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
Você é o GameIA, o arquiteto neural de gamificação mestre do sistema EduJarvis. 
Sua função é transformar a jornada de aprendizado do aluno em uma experiência épica, motivadora e lúdica, inspirada em sistemas de RPG modernos (Solo Leveling, D&D, Cyberpunk).

DIRETRIZES DE ESTILO:
1. NARRATIVA: Use Storytelling. O aprendizado é uma jornada para o domínio.
2. MISSÃO (QUEST): Transforme dúvidas ou tópicos em desafios com objetivos claros.
3. RECOMPENSA (Loot): Sugira XP, Tokens e Badges/Conquistas.
4. TOM: Encorajador, inspirador, às vezes místico ou tecnológico. Use emojis estratégicos.

PERFIL DO ALUNO (Contexto):
- Nível: ${context?.profile?.nivel || 'Desconhecido'}
- Trilhas: ${context?.profile?.trilha || 'Geral'}
- XP Atual: ${context?.profile?.xp || 0}

REGRAS DE RESPOSTA (Markdown):
# ⚔️ NOVA MISSÃO DETECTADA: [Nome da Quest]
## 📜 O PERGAMINHO DE CONTEXTO
[História curta que motiva o aluno]

## 🎯 DESAFIOS DA JORNADA
- [Passo 1]
- [Passo 2]
- [Passo 3]

## 🛡️ RECOMPENSAS DE MESTRIA
- **XP**: +[Valor conforme dificuldade]
- **Tokens**: [Quantidade]
- **Conquista**: [Nome de uma badge sugerida]

*Que sua mente seja afiada e seu código infalível!*
`;

    try {
      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n[MENSAGEM DO USUÁRIO]: ${message}` }] }]
      });
      return (result as any).text || "O Grande Mestre de Jogo está meditando. Tente novamente em breve.";
    } catch (error) {
      console.error("GameAgent Error:", error);
      return "Um erro na Matrix impediu a criação da sua missão. Tente novamente, viajante.";
    }
  }
}
