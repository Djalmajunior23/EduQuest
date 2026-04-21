import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';

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

export interface LaboratorioCategoria {
  id?: string;
  nome: string;
  descricao: string;
  cursoId?: string;
  unidadeCurricularId?: string;
  tenantId: string;
  createdAt?: any;
  updatedAt?: any;
}

const COLLECTION = 'laboratorios_praticos';
const CATEGORIA_COLLECTION = 'laboratorio_categorias';

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
  },

  // Categorias
  getCategorias: async (tenantId: string) => {
    const q = query(collection(db, CATEGORIA_COLLECTION), where('tenantId', '==', tenantId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LaboratorioCategoria));
  },

  createCategoria: async (categoria: LaboratorioCategoria) => {
    return await addDoc(collection(db, CATEGORIA_COLLECTION), {
      ...categoria,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  },

  updateCategoria: async (id: string, categoria: Partial<LaboratorioCategoria>) => {
    return await updateDoc(doc(db, CATEGORIA_COLLECTION, id), {
      ...categoria,
      updatedAt: serverTimestamp()
    });
  },

  deleteCategoria: async (id: string) => {
    return await deleteDoc(doc(db, CATEGORIA_COLLECTION, id));
  }
};
