// src/services/edujarvis/agents/DropoutRiskAgent.ts
import { GoogleGenAI } from "@/services/aiClient";
import { DropoutRiskService } from "../DropoutRiskService";

export class DropoutRiskAgent {
  private static ai: GoogleGenAI;

  private static getAI() {
    if (!this.ai) {
      
      this.ai = new GoogleGenAI({});
    }
    return this.ai;
  }

  public static async execute(data: any) {
    const ai = this.getAI();
    const riskAnalysis = DropoutRiskService.calculateDropoutRisk(data);

    const systemPrompt = `
Você é o **DropoutRiskIA** do EduJarvis. 
Sua missão é analisar o risco pedagógico e a possível evasão escolar (dropout) de um aluno.

Você recebeu uma análise matemática prévia:
${JSON.stringify(riskAnalysis, null, 2)}

### 📝 FORMATO DA RESPOSTA PARA O PROFESSOR:
1. **Nível de Risco**: Confirme ou ajuste o nível (Baixo, Médio ou Alto) baseado no contexto extra se houver.
2. **Evidências**: Explique quais métricas estão mais críticas.
3. **Possíveis Causas**: Hipóteses pedagógicas (falta de base, desmotivação, tempo).
4. **Recomendações**: Ações práticas imediatas para o professor.
5. **Plano de Acompanhamento**: Sugestão de passos para as próximas semanas.

Gere a resposta com cuidado e empatia, sem julgamentos sobre o aluno. Foco na solução.
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n[DADOS DO ALUNO]: ${JSON.stringify(data)}` }] }]
    });
    
    return result.text || "Falha ao analisar risco de evasão.";
  }
}
