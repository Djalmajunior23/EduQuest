// src/services/edujarvis/PublicApiService.ts
import { collection, addDoc, getDocs, query, where, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import crypto from 'crypto';

export interface ApiKeyRecord {
  id?: string;
  tenantId: string;
  key: string;
  label: string;
  scopes: string[];
  lastUsedAt?: any;
  createdAt: any;
}

export class PublicApiService {
  private static COLLECTION = 'tenant_api_keys';

  /**
   * Gera uma nova chave de API pública para integração externa (LMS, ERP).
   */
  public static async generateKey(tenantId: string, label: string): Promise<string> {
    const key = `sk_live_${crypto.randomUUID().replace(/-/g, '')}`;
    await addDoc(collection(db, this.COLLECTION), {
      tenantId,
      key,
      label,
      scopes: ['chat', 'reports', 'assessments'],
      createdAt: serverTimestamp()
    });
    return key;
  }

  /**
   * Valida uma chave de API vinda de uma requisição externa.
   */
  public static async validateKey(key: string): Promise<string | null> {
    const q = query(collection(db, this.COLLECTION), where('key', '==', key));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data().tenantId;
  }

  /**
   * Revoga uma chave de API.
   */
  public static async revokeKey(docId: string) {
    await deleteDoc(doc(db, this.COLLECTION, docId));
  }
}
