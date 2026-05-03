// src/services/edujarvis/AgentQualityService.ts
import { AuditLog } from './AuditService';

export interface AgentQualityReport {
  agentName: string;
  totalUses: number;
  averageFeedback: number;
  averageLatency: number;
  blockRate: number;
  totalCost: number;
  status: 'saudavel' | 'precisa_melhorar' | 'critico';
}

export class AgentQualityService {
  /**
   * Analisa logs de auditoria para medir a saúde e performance de cada agente de IA.
   */
  public static analyzeQuality(logs: any[]): AgentQualityReport[] {
    const grouped: Record<string, any> = {};

    for (const log of logs) {
      if (!grouped[log.agentName]) {
        grouped[log.agentName] = {
          total: 0,
          feedbackSum: 0,
          feedbackCount: 0,
          blocked: 0,
          latencyMs: 0,
          cost: 0
        };
      }

      const item = grouped[log.agentName];

      item.total++;
      item.latencyMs += log.latencyMs || log.responseTimeMs || 2000;
      item.cost += log.estimatedCost || 0;

      if (log.blocked) item.blocked++;

      if (log.metadata?.feedbackScore) {
        item.feedbackSum += log.metadata.feedbackScore;
        item.feedbackCount++;
      }
    }

    return Object.entries(grouped).map(([agentName, data]: [string, any]) => {
      const avgFeedback = data.feedbackCount > 0 ? data.feedbackSum / data.feedbackCount : 0;
      const blockRate = data.total > 0 ? data.blocked / data.total : 0;
      
      let status: AgentQualityReport['status'] = 'saudavel';
      if (avgFeedback > 0 && avgFeedback < 3) status = 'precisa_melhorar';
      if (blockRate > 0.3) status = 'critico';

      return {
        agentName,
        totalUses: data.total,
        averageFeedback: avgFeedback,
        averageLatency: data.total > 0 ? data.latencyMs / data.total : 0,
        blockRate,
        totalCost: data.cost,
        status
      };
    });
  }
}
