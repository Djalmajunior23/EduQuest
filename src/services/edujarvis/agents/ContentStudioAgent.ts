// src/services/edujarvis/agents/ContentStudioAgent.ts
import { GoogleGenAI } from "@/services/aiClient";

export class ContentStudioAgent {
  private static ai: GoogleGenAI;

  private static getAI() {
    if (!this.ai) {
      
      this.ai = new GoogleGenAI({});
    }
    return this.ai;
  }

  public static async execute(request: string, format: "video_script" | "presentation" | "exercise_sheet" | "podcast_script") {
    const ai = this.getAI();

    const systemPrompt = `
Você é o **ContentStudioIA** do EduJarvis. 
Sua missão é gerar conteúdo educacional multimídia de alta qualidade para professores.

### 🍱 FORMATOS SUPORTADOS:
- **Video Script**: Roteiro com falas e indicações visuais.
- **Presentation**: Tópicos para slides e notas do orador.
- **Exercise Sheet**: Lista de exercícios com gabarito comentado.
- **Podcast Script**: Roteiro de audio-aula dinâmico.

### 📐 DIRETRIZES:
- Siga a marca e o tom de voz do EduQuest (moderno, profissional, focado no sucesso).
- Alinhamento rigoroso com a BNCC e normas técnicas se aplicável.
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n[FORMATO]: ${format}\n\n[CONTEÚDO/TÓPICO]: ${request}` }] }]
    });
    
    return result.text || "Falha ao gerar conteúdo educacional.";
  }
}
