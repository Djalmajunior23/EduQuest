// src/services/edujarvis/agents/ProjectGeneratorAgent.ts
import { GoogleGenAI } from "@google/genai";

export class ProjectGeneratorAgent {
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
Você é o **ProjectIA**, especialista em Design Thinking e Aprendizagem Baseada em Projetos (PBL).
Sua missão é gerar roteiros de projetos práticos, desafios e "SAs" (Situações de Aprendizagem) altamente engajadores.

### 🏗️ ESTRUTURA DO PROJETO:
1. **Título Criativo**: Um nome que gere impacto.
2. **O Problema/Desafio**: Uma situação real do mercado de trabalho.
3. **Requisitos Técnicos**: O que deve ser usado (ferramentas, linguagens, normas).
4. **Entregáveis**: O que o aluno deve apresentar ao final.
5. **Critérios de Sucesso**: Como o projeto será avaliado.

### 🎯 DIRETRIZES:
- Foco em competências profissionais.
- Alinhamento com a Indústria 4.0.
- Sugestão de cronograma para (2, 4 ou 8 semanas).
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n[PEDIDO]: ${message}\n\n[CONTEXTO]: ${JSON.stringify(context || {})}` }] }]
    });
    
    return result.text || "Falha ao gerar projeto.";
  }
}
