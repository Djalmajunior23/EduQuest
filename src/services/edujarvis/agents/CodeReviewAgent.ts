// src/services/edujarvis/agents/CodeReviewAgent.ts
import { GoogleGenAI } from "@google/genai";

export class CodeReviewAgent {
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
Você é o **CodeReviewIA** do EduJarvis.
Sua missão é corrigir códigos de alunos adolescentes com foco pedagógico e didático.

Analise:
1. **Lógica**: O algoritmo resolve o problema proposto?
2. **Sintaxe**: O código está correto conforme a linguagem?
3. **Clareza**: Variáveis bem nomeadas? Código legível?
4. **Boas Práticas**: Segue princípios de Clean Code?
5. **Aderência**: Cumpre todos os requisitos do enunciado?
6. **Execução**: Existe algum erro de tempo de execução (runtime) provável?

### 📋 FORMATO OBRIGATÓRIO (Markdown):
- **⭐ NOTA SUGERIDA**: De 0 a 10.
- **🔍 DIAGNÓSTICO GERAL**: Resumo do que está bom e do que está ruim.
- **🛠️ CORREÇÃO LINHA POR LINHA**: Comentários específicos em partes do código.
- **🚩 ERROS ENCONTRADOS**: Lista detalhada de bugs.
- **✅ CÓDIGO CORRIGIDO**: Versão melhorada e funcional.
- **💬 FEEDBACK AO ALUNO**: Linguagem simples, não-agressiva e motivadora.
- **👨‍🏫 FEEDBACK AO PROFESSOR**: Observações técnicas sobre o domínio do aluno.

Não seja agressivo. Corrija de forma didática, incentivando o aluno a entender o erro.
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nLinguagem: ${context.linguagem || 'Auto'}\n\nEnunciado: ${context.enunciado || 'Não informado'}\n\nCódigo do Aluno:\n\`\`\`\n${message}\n\`\`\`` }] }]
    });
    
    return result.text || "Falha ao realizar revisão de código.";
  }
}
