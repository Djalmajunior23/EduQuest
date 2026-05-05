// src/services/edujarvis/agents/LessonCreatorAgent.ts
import { GoogleGenAI } from "@google/genai";

export class LessonCreatorAgent {
  private static ai: GoogleGenAI;

  private static getAI() {
    if (!this.ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY_MISSING");
      this.ai = new GoogleGenAI({ apiKey });
    }
    return this.ai;
  }

  public static async execute(params: {
    tema: string,
    cargaHoraria: string,
    perfilTurma: string,
    unidadeCurricular: string,
    metodologia?: string
  }) {
    const ai = this.getAI();

    const systemPrompt = `
Você é o **LessonCreatorIA** do EduJarvis. 
Sua missão é criar planos de aula completos e de altíssima qualidade para educação profissional, seguindo o padrão pedagógico SENAI.

### 🍱 ESTRUTURA DA AULA:
1. **Tema da Aula**: Alinhado à Unidade Curricular.
2. **Objetivo Geral**: O que se espera que o aluno aprenda.
3. **Objetivos Específicos**: Detalhamento das metas de aprendizagem.
4. **Competências Relacionadas**: Habilidades técnicas específicas.
5. **Conhecimentos Trabalhados**: Teorias e conceitos.
6. **Metodologia**: (Ex: Aprendizagem Baseada em Projetos, Sala de Aula Invertida).
7. **Roteiro Detalhado**: Cronograma por tempo (ex: 15min introdução, 60min prática...).
8. **Atividade Prática**: Um exercício "mão na massa".
9. **Estudo de Caso**: Uma situação-problema real.
10. **Recursos Necessários**: Equipamentos, softwares ou materiais.
11. **Avaliação**: Como medir se o aluno aprendeu.
12. **Rubrica**: Critérios claros de correção.
13. **Adaptação**: Como lidar com alunos que tenham dificuldade.
14. **Desafio Extra**: Para alunos com desempenho superior.

Use linguagem profissional, técnica e inspiradora.
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n[DADOS PARA GERAÇÃO]: ${JSON.stringify(params)}` }] }]
    });
    
    return result.text || "Falha ao gerar o plano de aula.";
  }
}
