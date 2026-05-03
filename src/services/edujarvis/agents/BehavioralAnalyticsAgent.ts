// src/services/edujarvis/agents/BehavioralAnalyticsAgent.ts
import { BehavioralAnalyticsService } from '../BehavioralAnalyticsService';

export class BehavioralAnalyticsAgent {
  public static async execute(alunoId: string) {
    const summary = await BehavioralAnalyticsService.getStudentSummary(alunoId);

    return `
### 📈 BEHAVIORAL ANALYTICS:
O aluno teve **${summary.totalInteracoes}** interações rastreadas recentemente.

- **Uso de IA**: ${summary.usoIA} vezes (Indica curiosidade/apoio)
- **Erros de Questão**: ${summary.errosQuestao} (Indica pontos de trava)
- **Atividades Concluídas**: ${summary.conclusoes}

**Resumo behavioral**: O aluno apresenta um padrão de uso ${summary.totalInteracoes > 20 ? 'altamente ativo' : 'moderado'}.
`;
  }
}
