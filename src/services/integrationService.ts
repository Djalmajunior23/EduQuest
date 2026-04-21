// src/services/integrationService.ts
import { collection, query, where, getDocs, doc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { IntegrationProviderConfig } from '../types/integracoes';

export const integrationService = {
  async getIntegrationsByTenant(tenantId: string): Promise<IntegrationProviderConfig[]> {
    const q = query(collection(db, 'config_integracoes'), where('tenantId', '==', tenantId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IntegrationProviderConfig));
  },
  
  async saveIntegration(config: Partial<IntegrationProviderConfig>, userId: string): Promise<void> {
    const integrationRef = config.id ? doc(db, 'config_integracoes', config.id) : doc(collection(db, 'config_integracoes'));
    
    // In production, chavePrivada should NEVER be stored here, only masked or ref.
    // Logic for key storage is offloaded to backend.
    await setDoc(integrationRef, {
        ...config,
        updatedAt: serverTimestamp(),
        updatedBy: userId
    }, { merge: true });
    
    // Log audit
    await addDoc(collection(db, 'audit_integracoes'), {
        tenantId: config.tenantId,
        acao: config.id ? 'UPDATE' : 'CREATE',
        userId,
        timestamp: serverTimestamp()
    });
  }
};
