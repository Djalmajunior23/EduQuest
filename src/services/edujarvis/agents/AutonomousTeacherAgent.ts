// src/services/edujarvis/agents/AutonomousTeacherAgent.ts
import { GoogleGenAI } from "@google/genai";

export class AutonomousTeacherAgent {
  private static ai: GoogleGenAI;

  private static getAI() {
    if (!this.ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY_MISSING");
      this.ai = new GoogleGenAI({ apiKey });
    }
    return this.ai;
  }

  public static async execute(predictionResult: any, studentTwin: any) {
    const ai = this.getAI();

    const systemPrompt = `
Você é o **AutonomousTeacherIA** do EduJarvis. 
Sua missão é atuar como um copiloto proativo para o professor, sugerindo intervenções pedagógicas precisas baseadas em dados preditivos.

### 📋 DADOS RECEBIDOS:
- **Gêmeo Digital**: ${JSON.stringify(studentTwin)}
- **Predição**: ${JSON.stringify(predictionResult)}

### 📝 ESTRUTURA DA SUGESTÃO DE INTERVENÇÃO:
1. **Diagnóstico**: O que está acontecendo de fato com o aluno.
2. **Motivo da Intervenção**: Por que agir agora? (Base preditiva).
3. **Plano de Ação**: 3 passos claros para o professor.
4. **Atividade Recomendada**: Um tipo específico de tarefa que ajudaria esse perfil.
5. **Mensagem Sugerida**: Texto pronto para o professor enviar ao aluno (acolhedor e motivador).
6. **Critério de Acompanhamento**: Como saberemos se a intervenção funcionou?

Foco em ser útil, economizar tempo do professor e salvar a trajetória do aluno.
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nGere uma intervenção imediata.` }] }]
    });
    
    return result.text || "Falha ao gerar intervenção autônoma.";
  }
}
