// src/services/edujarvis/WhiteLabelConfigService.ts
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { TenantAIConfig } from './types';

export class WhiteLabelConfigService {
  private static COLLECTION = 'tenant_ai_config';

  public static async getConfig(tenantId: string): Promise<TenantAIConfig | null> {
    const docRef = doc(db, this.COLLECTION, tenantId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as TenantAIConfig;
    }
    return null;
  }

  public static async updateConfig(tenantId: string, updates: Partial<TenantAIConfig>) {
    const docRef = doc(db, this.COLLECTION, tenantId);
    await setDoc(docRef, { ...updates, tenantId }, { merge: true });
  }

  /**
   * Obtém o nome personalizado do assistente ou o padrão 'EduJarvis'
   */
  public static async getAssistantName(tenantId: string): Promise<string> {
    const config = await this.getConfig(tenantId);
    return config?.assistantName || 'EduJarvis';
  }
}
