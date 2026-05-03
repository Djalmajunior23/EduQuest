// src/services/edujarvis/BehavioralAnalyticsService.ts
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

export type EventType = 
  | 'login' 
  | 'activity_started' 
  | 'activity_completed' 
  | 'simulado_started' 
  | 'simulado_finished' 
  | 'chat_ia_used' 
  | 'question_error';

export interface BehavioralEvent {
  alunoId: string;
  tipo: EventType;
  metadata: any;
  createdAt: any;
}

export class BehavioralAnalyticsService {
  private static COLLECTION = 'behavioral_logs';

  public static async logEvent(alunoId: string, tipo: EventType, metadata: any = {}) {
    await addDoc(collection(db, this.COLLECTION), {
      alunoId,
      tipo,
      metadata,
      createdAt: serverTimestamp()
    });
  }

  public static async getStudentSummary(alunoId: string) {
    const q = query(
      collection(db, this.COLLECTION),
      where('alunoId', '==', alunoId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    const snap = await getDocs(q);
    const events = snap.docs.map(d => d.data() as BehavioralEvent);
    
    return {
      totalInteracoes: events.length,
      usoIA: events.filter(e => e.tipo === 'chat_ia_used').length,
      errosQuestao: events.filter(e => e.tipo === 'question_error').length,
      conclusoes: events.filter(e => e.tipo === 'activity_completed').length,
      recentEvents: events.slice(0, 5)
    };
  }
}
