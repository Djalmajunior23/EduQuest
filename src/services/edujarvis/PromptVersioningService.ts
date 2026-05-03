// src/services/edujarvis/PromptVersioningService.ts
import { collection, addDoc, getDocs, query, where, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export interface PromptVersion {
  id?: string;
  agentName: string;
  version: string;
  prompt: string;
  active: boolean;
  qualityScore?: number;
  changedBy: string;
  createdAt: any;
}

export class PromptVersioningService {
  private static COLLECTION = 'ai_prompt_versions';

  /**
   * Salva uma nova versão de prompt para um agente.
   */
  public static async saveVersion(data: Omit<PromptVersion, 'createdAt'>) {
    await addDoc(collection(db, this.COLLECTION), {
      ...data,
      createdAt: serverTimestamp()
    });
  }

  /**
   * Busca a versão ativa de um prompt para um agente específico.
   */
  public static async getActivePrompt(agentName: string): Promise<string | null> {
    const q = query(
      collection(db, this.COLLECTION),
      where('agentName', '==', agentName),
      where('active', '==', true),
      orderBy('createdAt', 'desc'),
      limit(1)
    );
    
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return (snap.docs[0].data() as PromptVersion).prompt;
  }
}
