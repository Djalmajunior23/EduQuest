// src/services/edujarvis/MonetizationService.ts
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export interface SubscriptionPlan {
  name: string;
  creditLimit: number;
  enabledAgents: string[];
}

export class MonetizationService {
  private static COLLECTION = 'tenant_ai_usage';

  /**
   * Verifica se o tenant tem créditos suficientes para a operação.
   */
  public static async checkUsage(tenantId: string): Promise<{ allowed: boolean; remaining: number }> {
    const docRef = doc(db, this.COLLECTION, tenantId);
    const snap = await getDoc(docRef);
    
    if (!snap.exists()) {
      // Create default free account
      await setDoc(docRef, {
        tenantId,
        creditsUsed: 0,
        plan: 'free',
        creditLimit: 1000 // 1000 requests/month default
      });
      return { allowed: true, remaining: 1000 };
    }

    const data = snap.data();
    const remaining = data.creditLimit - data.creditsUsed;
    
    return {
      allowed: remaining > 0,
      remaining: Math.max(0, remaining)
    };
  }

  /**
   * Incrementa o uso de créditos.
   */
  public static async trackUsage(tenantId: string, agent: string, credits = 1) {
    const docRef = doc(db, this.COLLECTION, tenantId);
    await setDoc(docRef, {
      creditsUsed: increment(credits),
      lastActive: new Date().toISOString()
    }, { merge: true });
  }
}
