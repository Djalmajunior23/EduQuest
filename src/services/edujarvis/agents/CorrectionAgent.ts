// src/services/edujarvis/agents/CorrectionAgent.ts
import { GoogleGenAI } from "@/services/aiClient";

export class CorrectionAgent {
  private static ai: GoogleGenAI;

  private static getAI() {
    if (!this.ai) {
      
      this.ai = new GoogleGenAI({});
    }
    return this.ai;
  }

  public static async execute(message: string, context: any) {
    const ai = this.getAI();

    const systemPrompt = `
Você é o **CorrectorIA** do EduJarvis, especialista em avaliação formativa.
Sua missão é corrigir respostas de alunos com foco no desenvolvimento de competências.

### 📋 CRITÉRIOS DE CORREÇÃO:
1. **Nota (0 a 10)**: Atribua uma pontuação justa.
2. **Pontos Positivos**: O que o aluno demonstrou dominar.
3. **Pontos a Melhorar**: Lacunas identificadas.
4. **Feedback ao Aluno**: Linguagem simples, encorajadora e clara.
5. **Feedback Técnico ao Professor**: Insights sobre o nível de maturidade técnica.
6. **Sugestão de Melhoria**: Um próximo passo prático.

### 💻 SE FOR CÓDIGO:
- Analise a lógica e a eficiência.
- Verifique a sintaxe.
- Sugira boas práticas de clean code.

Use linguagem motivadora e pedagógica.
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n[ATIVIDADE/PERGUNTA]: ${context.pergunta || "Não informada"}\n\n[RESPOSTA DO ALUNO]: ${message}\n\n[TIPO]: ${context.tipo || "discursiva"}` }] }]
    });
    
    return result.text || "Falha ao gerar correção.";
  }
}
