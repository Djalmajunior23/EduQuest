// src/services/edujarvis/agents/LearningPathAgent.ts
import { GoogleGenAI } from "@/services/aiClient";

export class LearningPathAgent {
  private static ai: GoogleGenAI;

  private static getAI() {
    if (!this.ai) {
      
      this.ai = new GoogleGenAI({});
    }
    return this.ai;
  }

  public static async execute(goal: string, context: any) {
    const ai = this.getAI();

    const systemPrompt = `
Você é o **LearningPathIA** do EduJarvis. 
Sua missão é criar Trilhas de Aprendizagem Personalizadas e Adaptativas.

### 🗺️ ESTRUTURA DA TRILHA:
1. **Nível de Partida**: Diagnóstico do que o aluno já sabe.
2. **Módulos de Conhecimento**: Títulos e resumo de cada etapa.
3. **Checkpoints Práticos**: Atividades "mão na massa" para validar o avanço.
4. **Recursos Recomendados**: Vídeos, documentação ou exercícios.
5. **Critério de Maestria**: O que o aluno deve ser capaz de fazer ao final.

### 🎯 FOCO:
Eficiência. O aluno deve aprender o máximo com o mínimo de esforço redundante.
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n[OBJETIVO]: ${goal}\n\n[CONTEXTO ATUAL]: ${JSON.stringify(context)}` }] }]
    });
    
    return result.text || "Falha ao gerar trilha de aprendizagem.";
  }
}
