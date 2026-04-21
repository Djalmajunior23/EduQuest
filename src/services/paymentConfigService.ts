// src/services/paymentConfigService.ts
import { collection, query, where, getDocs, doc, setDoc, addDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PaymentProviderConfig } from '../types/payment';

export const paymentConfigService = {
  async getProvidersByTenant(tenantId: string): Promise<PaymentProviderConfig[]> {
    const q = query(collection(db, 'config_pagamentos'), where('tenantId', '==', tenantId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentProviderConfig));
  },
  
  async saveProvider(config: Partial<PaymentProviderConfig>, userId: string): Promise<void> {
    const providerRef = config.id ? doc(db, 'config_pagamentos', config.id) : doc(collection(db, 'config_pagamentos'));
    await setDoc(providerRef, {
        ...config,
        updatedAt: serverTimestamp(),
        updatedBy: userId
    }, { merge: true });
    
    // Log audit
    await addDoc(collection(db, 'audit_pagamentos'), {
        tenantId: config.tenantId,
        acao: config.id ? 'UPDATE' : 'CREATE',
        userId,
        timestamp: serverTimestamp()
    });
  }
};
