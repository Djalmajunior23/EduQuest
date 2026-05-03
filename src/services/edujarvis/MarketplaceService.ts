// src/services/edujarvis/MarketplaceService.ts
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp,
  updateDoc,
  doc,
  increment
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

export interface MarketplaceContent {
  id?: string;
  authorId: string;
  tenantId?: string;
  title: string;
  contentType: 'activity' | 'simulado' | 'project' | 'lesson_plan' | 'rubric' | 'learning_path';
  content: any;
  visibility: 'private' | 'public' | 'tenant';
  rating: number;
  downloads: number;
  tags: string[];
  createdAt: any;
}

export class MarketplaceService {
  private static COLLECTION = 'ai_content_marketplace';

  public static async createContent(data: Omit<MarketplaceContent, 'id' | 'createdAt' | 'rating' | 'downloads'>) {
    const docRef = await addDoc(collection(db, this.COLLECTION), {
      ...data,
      rating: 0,
      downloads: 0,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  }

  public static async searchContent(params: {
    queryText?: string;
    contentType?: string;
    visibility?: 'public' | 'tenant';
    tenantId?: string;
  }) {
    let q = query(collection(db, this.COLLECTION));

    if (params.visibility === 'public') {
      q = query(q, where('visibility', '==', 'public'));
    } else if (params.visibility === 'tenant' && params.tenantId) {
      q = query(q, where('tenantId', '==', params.tenantId));
    }

    if (params.contentType) {
      q = query(q, where('contentType', '==', params.contentType));
    }

    const snap = await getDocs(q);
    let results = snap.docs.map(d => ({ id: d.id, ...d.data() } as MarketplaceContent));

    if (params.queryText) {
      const search = params.queryText.toLowerCase();
      results = results.filter(item => 
        item.title.toLowerCase().includes(search) || 
        item.tags.some(t => t.toLowerCase().includes(search))
      );
    }

    return results;
  }

  public static async trackDownload(contentId: string) {
    const docRef = doc(db, this.COLLECTION, contentId);
    await updateDoc(docRef, {
      downloads: increment(1)
    });
  }
}
