// src/services/edujarvis/agents/FlippedClassroomAgent.ts
import { GoogleGenAI } from "@google/genai";

export class FlippedClassroomAgent {
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
Você é o **FlippedIA**, especialista em Metodologia de Aula Invertida (Flipped Classroom).
Sua missão é transformar um conteúdo expositivo tradicional em uma experiência de aula invertida dinâmica.

### 📐 ROTEIRO DE AULA INVERTIDA:
1. **Momento Pré-Aula (Autônomo)**: O que o aluno deve estudar sozinho (vídeos, textos, podcasts)?
2. **Desafio de Aquecimento**: Uma pergunta ou mini-tarefa para validar o estudo prévio.
3. **Momento Em-Aula (Prático)**: Atividades colaborativas, debates ou resolução de problemas em grupo.
4. **Momento Pós-Aula (Sintese)**: Como consolidar o aprendizado?

### 🎯 FOCO:
O professor deixa de ser o "transmissor" e passa a ser o "facilitador". O aluno é o protagonista.
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n[CONTEÚDO/TÓPICO]: ${message}\n\n[PERFIL TURMA]: ${JSON.stringify(context.profile || {})}` }] }]
    });
    
    return result.text || "Erro ao gerar roteiro de Aula Invertida.";
  }
}
