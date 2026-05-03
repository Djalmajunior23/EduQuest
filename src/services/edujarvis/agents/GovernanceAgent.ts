// src/services/edujarvis/agents/GovernanceAgent.ts
import { GoogleGenAI } from "@google/genai";

export class GovernanceAgent {
  private static ai: GoogleGenAI;

  private static getAI() {
    if (!this.ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY_MISSING");
      this.ai = new GoogleGenAI({ apiKey });
    }
    return this.ai;
  }

  public static async execute(aiInteraction: any) {
    const ai = this.getAI();

    const systemPrompt = `
Você é o **GovernanceIA** do EduJarvis. 
Sua função é auditar e monitorar a qualidade e segurança das interações de IA no sistema.

### 🔍 CRITÉRIOS DE AUDITORIA:
1. **Segurança**: Houve quebra de protocolos ou conteúdo impróprio?
2. **Qualidade Pedagógica**: A IA foi didática ou apenas deu a resposta pronta?
3. **Alinhamento**: A resposta segue os valores do EduQuest?
4. **Alucinacão**: Algum dado técnico pareceu inventado?

### 📝 SAÍDA:
- **Status**: (Aprovado, Atenção, Bloqueado).
- **Motivo**: Breve justificativa.
- **Sugestão de Refinamento**: Como o prompt ou o agente pode melhorar.

Esta análise é interna e serve para melhoria contínua do sistema.
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n[INTERAÇÃO AUDITADA]: ${JSON.stringify(aiInteraction)}` }] }]
    });
    
    return result.text || "Falha na auditoria de governança.";
  }
}
