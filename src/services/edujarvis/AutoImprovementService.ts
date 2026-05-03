// src/services/edujarvis/AutoImprovementService.ts
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export interface AIExperiment {
  id?: string;
  tenantId: string;
  agentName: string;
  experimentName: string;
  variantA: any; // Prompt version or config
  variantB: any; 
  metricTarget: 'accuracy' | 'engagement' | 'speed';
  status: 'running' | 'completed' | 'applied';
  results?: {
    scoreA: number;
    scoreB: number;
    winner?: 'A' | 'B';
  };
  createdAt: any;
}

export class AutoImprovementService {
  private static COLLECTION = 'ai_auto_improvement_experiments';

  /**
   * Cria um novo experimento de auto-aprimoramento (A/B testing).
   */
  public static async createExperiment(data: Omit<AIExperiment, 'status' | 'createdAt'>) {
    await addDoc(collection(db, this.COLLECTION), {
      ...data,
      status: 'running',
      createdAt: serverTimestamp()
    });
  }

  /**
   * Avalia o resultado de um experimento e recomenda a promoção da melhor variante.
   */
  public static async evaluateExperiment(id: string, scoreA: number, scoreB: number) {
    const winner = scoreA > scoreB ? 'A' : 'B';
    const docRef = doc(db, this.COLLECTION, id);
    await updateDoc(docRef, {
      status: 'completed',
      results: { scoreA, scoreB, winner }
    });
    return winner;
  }
}
