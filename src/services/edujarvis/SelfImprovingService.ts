// src/services/edujarvis/SelfImprovingService.ts
import { 
    collection, 
    addDoc, 
    serverTimestamp, 
    getDocs, 
    query, 
    where 
  } from 'firebase/firestore';
  import { db } from '../../lib/firebase';
  
  export interface AIFeedback {
    agent: string;
    prompt: string;
    response: string;
    score: number; // 1-5
    observation?: string;
    createdAt: any;
  }
  
  export class SelfImprovingService {
    private static COLLECTION = 'ai_feedback_logs';
  
    public static async logFeedback(feedback: Omit<AIFeedback, 'createdAt'>) {
      await addDoc(collection(db, this.COLLECTION), {
        ...feedback,
        createdAt: serverTimestamp()
      });
    }
  
    public static async getAgentQualityReport(agentName: string) {
      const q = query(
        collection(db, this.COLLECTION),
        where('agent', '==', agentName)
      );
      
      const snap = await getDocs(q);
      const feedbacks = snap.docs.map(d => d.data() as AIFeedback);
      
      if (feedbacks.length === 0) return { avgScore: 0, total: 0 };
      
      const sum = feedbacks.reduce((acc, f) => acc + f.score, 0);
      return {
        avgScore: sum / feedbacks.length,
        total: feedbacks.length,
        commonIssues: feedbacks.filter(f => f.score <= 2).map(f => f.observation)
      };
    }
  }
  
