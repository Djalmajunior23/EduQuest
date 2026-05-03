// src/services/edujarvis/agents/SelfImprovingAgent.ts
import { SelfImprovingService } from '../SelfImprovingService';

export class SelfImprovingAgent {
  public static async execute(agentName: string) {
    const report = await SelfImprovingService.getAgentQualityReport(agentName);

    return `
### 🛠️ SELF-IMPROVING AI (Relatório de Qualidade):
Agente: **${agentName}**

- **Score Médio**: ${report.avgScore.toFixed(1)}/5.0
- **Total de Avaliações**: ${report.total}
- **Status**: ${report.avgScore > 4 ? 'Alta Performance' : 'Necessita Ajuste de Prompt'}

**Pontos de Melhoria**: ${report.commonIssues?.slice(0, 3).join("; ") || "Nenhum feedback negativo recente."}
`;
  }
}
