// src/services/edujarvis/agents/GlobalMentorAgent.ts
import { GoogleGenAI } from "@google/genai";

export type MentorExpertise = 'coding' | 'database' | 'logic' | 'cyber' | 'business';

export class GlobalMentorAgent {
  private static ai: GoogleGenAI;

  private static getAI() {
    if (!this.ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY_MISSING");
      this.ai = new GoogleGenAI({ apiKey });
    }
    return this.ai;
  }

  /**
   * Executa mentorias especializadas baseadas em domínios de conhecimento ultra-profundos.
   */
  public static async execute(expertise: MentorExpertise, message: string, context: any) {
    const ai = this.getAI();
    
    const prompts: Record<MentorExpertise, string> = {
      coding: "Você é um Engenheiro de Software Staff. Foco em clean code, padrões de projeto e performance.",
      database: "Você é um DBA Expert em PostgreSQL e NoSQL. Foco em modelagem, indexação e escalabilidade.",
      logic: "Você é um Matemático e Professor de Computação. Foco em algoritmos, complexidade de tempo e resolução de problemas.",
      cyber: "Você é um Especialista em Red Teaming. Foco em segurança, criptografia e proteção de dados.",
      business: "Você é um Consultor Estratégico. Foco em visão de produto, mercado e viabilidade técnica."
    };

    const systemPrompt = `
${prompts[expertise]}
Atue no contexto do EduJarvis Intelligence Platform.
Sua missão é levar o aluno da base até o nível sênior através de desafios práticos e teoria profunda.
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nUsuário: ${message}\nContexto: ${JSON.stringify(context)}` }] }]
    });

    return result.text || "O mentor está indisponível para esta especialidade agora.";
  }
}
