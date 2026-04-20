import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

export interface Laboratorio {
  id?: string;
  titulo: string;
  versaoProfessor: string;
  versaoAluno: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  tenantId: string;
  createdAt?: any;
  updatedAt?: any;
}

const COLLECTION = 'laboratorios_praticos';

export const laboratorioService = {
  getLaboratorios: async (tenantId: string) => {
    const q = query(collection(db, COLLECTION), where('tenantId', '==', tenantId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Laboratorio));
  },
  
  createLaboratorio: async (lab: Laboratorio) => {
    return await addDoc(collection(db, COLLECTION), {
      ...lab,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  },

  updateLaboratorio: async (id: string, lab: Partial<Laboratorio>) => {
    return await updateDoc(doc(db, COLLECTION, id), {
      ...lab,
      updatedAt: serverTimestamp()
    });
  }
};
