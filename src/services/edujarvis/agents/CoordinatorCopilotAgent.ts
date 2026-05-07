// src/services/edujarvis/agents/CoordinatorCopilotAgent.ts
import { GoogleGenAI } from "@/services/aiClient";

export class CoordinatorCopilotAgent {
  private static ai: GoogleGenAI;

  private static getAI() {
    if (!this.ai) {
      
      this.ai = new GoogleGenAI({});
    }
    return this.ai;
  }

  public static async execute(data: {
    periodo: string;
    turmasSummary: any[];
    indicadoresGerais: any;
  }) {
    const ai = this.getAI();
    
    const systemPrompt = `
Você é o **CoordinatorCopilotIA** do EduJarvis. 
Sua função é apoiar a coordenação pedagógica na tomada de decisão estratégica baseada em dados.

### 📋 RESPONDA COM:
1. **Diagnóstico Institucional**: Panorama geral de performance.
2. **Turmas em Atenção**: Quais turmas precisam de suporte imediato e por quê.
3. **Conteúdos Críticos**: Tópicos onde os alunos estão mais travando.
4. **Recomendações para Professores**: Ações práticas para o corpo docente.
5. **Pauta de Reunião Pedagógica**: Sugestão de tópicos para discutir com a equipe.
6. **Plano de Ação sugerido**: Passos para os próximos 15 dias.

Mantenha um tom profissional, analítico e orientador.
`;

    const prompt = `
${systemPrompt}

DADOS DA COORDENAÇÃO (CONTEXTO):
Período: ${data.periodo}
Resumo das Turmas: ${JSON.stringify(data.turmasSummary, null, 2)}
Indicadores Gerais: ${JSON.stringify(data.indicadoresGerais, null, 2)}
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    return result.text || "Falha ao gerar análise de coordenação.";
  }
}
