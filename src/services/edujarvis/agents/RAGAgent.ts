// src/services/edujarvis/agents/RAGAgent.ts
import { GoogleGenAI } from "@/services/aiClient";

export class RAGAgent {
  private static ai: GoogleGenAI;

  private static getAI() {
    if (!this.ai) {
      
      this.ai = new GoogleGenAI({});
    }
    return this.ai;
  }

  public static async execute(question: string, contextChunks: string[]) {
    const ai = this.getAI();

    const systemPrompt = `
Você é o **InstitutionalRAG** do EduJarvis. Sua base de conhecimento é restrita aos documentos institucionais fornecidos.

### 📜 DIRETRIZES:
1. Responda usando EXCLUSIVAMENTE o contexto institucional fornecido nos "chunks" abaixo.
2. Se o contexto não for suficiente para responder com segurança, diga educadamente que precisa de mais material ou que essa informação não consta na base institucional.
3. Não invente informações (proibido alucinar regras ou datas que não estejam no texto).
4. Mantenha o tom profissional e alinhado aos regulamentos da instituição.
`;

    const prompt = `
${systemPrompt}

PERGUNTA DO USUÁRIO:
${question}

CONTEXTO INSTITUCIONAL (CHUNKS):
${contextChunks.length > 0 ? contextChunks.join("\n\n---\n\n") : "Nenhum contexto encontrado."}
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    return result.text || "Não foi possível gerar uma resposta baseada na base de conhecimento.";
  }
}
