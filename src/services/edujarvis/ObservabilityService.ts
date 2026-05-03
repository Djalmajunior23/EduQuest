// src/services/edujarvis/ObservabilityService.ts
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export interface ObservabilityEvent {
  tenantId: string;
  agentName: string;
  modelUsed: string;
  latencyMs: number;
  success: boolean;
  errorMessage?: string;
  tokensInput: number;
  tokensOutput: number;
  estimatedCost: number;
}

export class ObservabilityService {
  private static COLLECTION = 'ai_observability_events';

  /**
   * Loga eventos técnicos de observabilidade para monitoramento de infraestrutura de IA.
   */
  public static async logEvent(event: ObservabilityEvent) {
    try {
      await addDoc(collection(db, this.COLLECTION), {
        ...event,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Observability Log Failed", error);
    }
  }
}
