// src/services/labService.ts
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { LaboratorioPratico } from '../types/laboratorio';

export const labService = {
  async getLaboratoriosByTenant(tenantId: string): Promise<LaboratorioPratico[]> {
    const q = query(collection(db, 'laboratorios_praticos'), where('tenantId', '==', tenantId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LaboratorioPratico));
  },
  
  async getLaboratorioById(labId: string): Promise<LaboratorioPratico | null> {
    const docRef = doc(db, 'laboratorios_praticos', labId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as LaboratorioPratico;
    }
    return null;
  }
};
