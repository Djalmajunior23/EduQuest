import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Rubric } from '../types/activities';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const RUBRICS_COLLECTION = 'rubrics';

export const rubricService = {
  async createRubric(rubric: Omit<Rubric, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, RUBRICS_COLLECTION), {
        ...rubric,
        createdAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, RUBRICS_COLLECTION);
      throw e;
    }
  },

  async getTeacherRubrics(teacherId: string): Promise<Rubric[]> {
    try {
      const q = query(collection(db, RUBRICS_COLLECTION), where('teacherId', '==', teacherId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Rubric));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, RUBRICS_COLLECTION);
      return [];
    }
  },

  async getRubric(id: string): Promise<Rubric | null> {
    try {
      const docSnap = await getDoc(doc(db, RUBRICS_COLLECTION, id));
      if (docSnap.exists()) {
        return { ...docSnap.data(), id: docSnap.id } as Rubric;
      }
      return null;
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, `${RUBRICS_COLLECTION}/${id}`);
      return null;
    }
  },

  async updateRubric(id: string, updates: Partial<Rubric>): Promise<void> {
     try {
       await updateDoc(doc(db, RUBRICS_COLLECTION, id), updates);
     } catch (e) {
       handleFirestoreError(e, OperationType.UPDATE, `${RUBRICS_COLLECTION}/${id}`);
       throw e;
     }
  },

  async deleteRubric(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, RUBRICS_COLLECTION, id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `${RUBRICS_COLLECTION}/${id}`);
      throw e;
    }
  }
};
