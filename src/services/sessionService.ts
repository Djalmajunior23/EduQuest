// src/services/sessionService.ts
import { collection, addDoc, serverTimestamp, query, where, getDocs, onSnapshot, updateDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface ClassSession {
  id?: string;
  tenantId: string;
  professorId: string;
  turmaId: string;
  atividadeId: string; // Pode ser Lab, Simulador, Questão, Caso
  tipoAtividade: 'LAB' | 'SIMULADOR' | 'CASO' | 'EXAM';
  status: 'ACTIVE' | 'FINISHED';
  startedAt: any;
  studentsProgress: {
    [studentId: string]: {
      nome: string;
      currentStep?: string;
      status: 'WORKING' | 'HELP_NEEDED' | 'FINISHED';
      lastUpdate: any;
      performanceScore?: number;
    }
  };
}

export const sessionService = {
  async startSession(session: Omit<ClassSession, 'id' | 'startedAt' | 'studentsProgress'>) {
    const docRef = await addDoc(collection(db, 'sessoes_ativas'), {
      ...session,
      startedAt: serverTimestamp(),
      studentsProgress: {}
    });
    return docRef.id;
  },

  async finishSession(sessionId: string) {
    const docRef = doc(db, 'sessoes_ativas', sessionId);
    await updateDoc(docRef, { status: 'FINISHED', finishedAt: serverTimestamp() });
  },

  subscribeToSession(sessionId: string, callback: (session: ClassSession) => void) {
    const docRef = doc(db, 'sessoes_ativas', sessionId);
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        callback({ id: snapshot.id, ...snapshot.data() } as ClassSession);
      }
    });
  },

  async updateStudentProgress(sessionId: string, studentId: string, progress: any) {
    const docRef = doc(db, 'sessoes_ativas', sessionId);
    await setDoc(docRef, {
      studentsProgress: {
        [studentId]: {
          ...progress,
          lastUpdate: serverTimestamp()
        }
      }
    }, { merge: true });
  }
};
