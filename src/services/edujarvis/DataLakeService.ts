// src/services/edujarvis/DataLakeService.ts
import { collection, addDoc, getDocs, query, where, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export interface DataLakeEvent {
  id?: string;
  tenantId: string;
  userId?: string;
  userRole?: string;
  eventType: string;
  sourceModule?: string;
  payload?: any;
  anonymized?: boolean;
  createdAt: any;
}

export class DataLakeService {
  private static COLLECTION = 'education_data_lake_events';

  /**
   * Registra um evento educacional no Data Lake para análise futura e ML.
   */
  public static async registerEvent(data: Omit<DataLakeEvent, 'createdAt'>) {
    try {
      await addDoc(collection(db, this.COLLECTION), {
        ...data,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Data Lake Entry Failed", error);
    }
  }

  /**
   * Obtém um sumário de eventos para um tenant específico.
   */
  public static async getTenantSummary(tenantId: string) {
    const q = query(
      collection(db, this.COLLECTION),
      where('tenantId', '==', tenantId),
      orderBy('createdAt', 'desc'),
      limit(100)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}
