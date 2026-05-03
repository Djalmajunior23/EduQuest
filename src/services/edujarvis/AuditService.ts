// src/services/edujarvis/AuditService.ts
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';

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
  private static COLLECTION = 'ai_audit_logs';

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
      
      await addDoc(collection(db, this.COLLECTION), {
        ...rest,
        promptHash,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Failed to log AI interaction audit", error);
    }
  }

  public static async getTenantAuditSummary(tenantId: string) {
    const q = query(
      collection(db, this.COLLECTION),
      where('tenantId', '==', tenantId),
      orderBy('createdAt', 'desc'),
      limit(500)
    );
    
    const snap = await getDocs(q);
    const logs = snap.docs.map(doc => doc.data() as AuditLog);
    
    return {
      total: logs.length,
      bloqueios: logs.filter(l => l.blocked).length,
      custoEstimado: logs.reduce((sum, l) => sum + (l.estimatedCost || 0), 0),
      agentesMaisUsados: logs.reduce((acc: Record<string, number>, log) => {
        acc[log.agentName] = (acc[log.agentName] || 0) + 1;
        return acc;
      }, {})
    };
  }
}
