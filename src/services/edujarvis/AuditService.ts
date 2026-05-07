import { api } from '../../lib/api';


// src/services/edujarvis/AuditService.ts

export interface AuditLog {
  tenantId: string | null;
  userId: string;
  userRole: string;
  agentName: string;
  modelUsed: string;
  promptHash: string;
  blocked: boolean;
  safetyScore: number;
  estimatedCost: number;
  metadata?: any;
  createdAt?: any;
}

export class AuditService {
  private static TABLE = 'ai_audit_logs';

  private static async hashPrompt(prompt: string): Promise<string> {
    const msgUint8 = new TextEncoder().encode(prompt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  public static async logInteraction(data: {
    tenantId: string | null;
    userId: string;
    userRole: string;
    agentName: string;
    modelUsed: string;
    prompt: string;
    blocked: boolean;
    safetyScore: number;
    estimatedCost: number;
    metadata?: any;
  }) {
    try {
      const promptHash = await this.hashPrompt(data.prompt);
      const { prompt, ...rest } = data;
      
      const { error } = await api.from(this.TABLE).insert({
        ...rest,
        tenant_id: rest.tenantId,
        user_id: rest.userId,
        user_role: rest.userRole,
        agent_name: rest.agentName,
        model_used: rest.modelUsed,
        prompt_hash: promptHash,
        safety_score: rest.safetyScore,
        estimated_cost: rest.estimatedCost,
        created_at: new Date().toISOString()
      });

      if (error) throw error;
    } catch (error) {
      console.error("Failed to log AI interaction audit", error);
    }
  }

  public static async getTenantAuditSummary(tenantId: string) {
    const { data: logs, error } = await api
      .from(this.TABLE)
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(500);
    
    if (error) throw error;
    
    const typedLogs = (logs || []) as AuditLog[];
    
    return {
      total: typedLogs.length,
      bloqueios: typedLogs.filter(l => l.blocked).length,
      custoEstimado: typedLogs.reduce((sum, l) => sum + (l.estimatedCost || 0), 0),
      agentesMaisUsados: typedLogs.reduce((acc: Record<string, number>, log) => {
        acc[log.agentName] = (acc[log.agentName] || 0) + 1;
        return acc;
      }, {})
    };
  }
}
