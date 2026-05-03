// src/services/edujarvis/ModelVersioningService.ts
import { collection, addDoc, getDocs, query, where, orderBy, limit, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export interface ModelConfig {
  id?: string;
  modelName: string;
  provider: 'gemini' | 'openai' | 'ollama';
  version: string;
  active: boolean;
  capabilities: string[];
  deploymentDate: any;
}

export class ModelVersioningService {
  private static COLLECTION = 'ai_model_configs';

  /**
   * Registra uma nova versão de modelo no inventário da instituição.
   */
  public static async registerModel(config: Omit<ModelConfig, 'deploymentDate'>) {
    await addDoc(collection(db, this.COLLECTION), {
      ...config,
      deploymentDate: serverTimestamp()
    });
  }

  /**
   * Retorna o modelo ativo para roteamento dinâmico.
   */
  public static async getActiveModel(): Promise<ModelConfig | null> {
    const q = query(
      collection(db, this.COLLECTION),
      where('active', '==', true),
      orderBy('deploymentDate', 'desc'),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as ModelConfig;
  }

  /**
   * Realiza o Switch de modelo (Blue/Green Deployment) em tempo real.
   */
  public static async activateModel(modelId: string) {
    const docRef = doc(db, this.COLLECTION, modelId);
    await updateDoc(docRef, { active: true });
  }
}
