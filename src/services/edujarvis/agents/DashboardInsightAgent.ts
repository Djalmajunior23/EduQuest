// src/services/edujarvis/agents/DashboardInsightAgent.ts
import { GoogleGenAI } from "@/services/aiClient";

export class DashboardInsightAgent {
  private static ai: GoogleGenAI;

  private static getAI() {
    if (!this.ai) {
      
      this.ai = new GoogleGenAI({});
    }
    return this.ai;
  }

  public static async execute(tituloGrafico: string, dados: any, perfil: string = "professor") {
    const ai = this.getAI();

    const systemPrompt = `
Você é o **DashboardInsightIA** do EduJarvis. 
Sua missão é explicar gráficos e indicadores educacionais complexos em linguagem clara e acionável.

### 📝 ESTRUTURA DO INSIGHT:
1. **O que o gráfico mostra**: Uma síntese rápida da informação visual.
2. **Principal ponto de atenção**: O dado mais relevante ou preocupante.
3. **Possível causa**: Uma hipótese baseada na tendência dos dados.
4. **Recomendação prática**: O que o ${perfil} deve fazer com essa informação?
5. **Próxima ação sugerida**: Um passo concreto imediato.

Não invente dados. Use estritamente o que foi fornecido. Seja direto e focado em melhoria pedagógica.
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nTítulo do Gráfico: ${tituloGrafico}\n\nDados do Gráfico: ${JSON.stringify(dados)}` }] }]
    });
    
    return result.text || "Falha ao gerar insight do dashboard.";
  }
}
