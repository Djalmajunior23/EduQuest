// src/services/edujarvis/RAGService.ts
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

export interface RAGDocument {
  id?: string;
  tenantId?: string;
  title: string;
  sourceType: string;
  ownerId: string;
  visibility: 'private' | 'tenant' | 'public';
  createdAt: any;
}

export interface RAGChunk {
  id?: string;
  documentId: string;
  content: string;
  metadata: any;
  tenantId?: string;
}

export class RAGService {
  private static DOCS_COLLECTION = 'rag_documents';
  private static CHUNKS_COLLECTION = 'rag_chunks';

  public static splitText(text: string, maxLength = 1000): string[] {
    const paragraphs = text.split(/\n+/);
    const chunks: string[] = [];
    let current = "";

    for (const paragraph of paragraphs) {
      if ((current + paragraph).length > maxLength) {
        chunks.push(current.trim());
        current = "";
      }
      current += paragraph + "\n";
    }

    if (current.trim()) chunks.push(current.trim());

    return chunks;
  }

  public static async ingestDocument(data: {
    tenantId?: string;
    title: string;
    sourceType: string;
    ownerId: string;
    content: string;
    visibility?: 'private' | 'tenant' | 'public';
  }) {
    // 1. Create Document Entry
    const docRef = await addDoc(collection(db, this.DOCS_COLLECTION), {
      tenantId: data.tenantId,
      title: data.title,
      sourceType: data.sourceType,
      ownerId: data.ownerId,
      visibility: data.visibility || 'private',
      createdAt: serverTimestamp()
    });

    // 2. Split and Create Chunks
    const chunks = this.splitText(data.content);
    const batchPromises = chunks.map(chunk => 
      addDoc(collection(db, this.CHUNKS_COLLECTION), {
        documentId: docRef.id,
        content: chunk,
        tenantId: data.tenantId,
        metadata: { title: data.title }
      })
    );

    await Promise.all(batchPromises);

    return {
      documentId: docRef.id,
      chunksCount: chunks.length
    };
  }

  /**
   * Simple keyword-based search for context retrieval in Firebase
   * (Simulation of vector RAG until vector extension is available)
   */
  public static async searchContext(queryText: string, tenantId?: string, limit = 5): Promise<string[]> {
    const q = tenantId 
      ? query(collection(db, this.CHUNKS_COLLECTION), where('tenantId', '==', tenantId))
      : query(collection(db, this.CHUNKS_COLLECTION));

    const snap = await getDocs(q);
    const allChunks = snap.docs.map(d => d.data() as RAGChunk);

    // Simple keyword scoring
    const searchTerms = queryText.toLowerCase().split(/\s+/).filter(t => t.length > 3);
    
    const scoredChunks = allChunks.map(chunk => {
      const contentLower = chunk.content.toLowerCase();
      let score = 0;
      searchTerms.forEach(term => {
        if (contentLower.includes(term)) score++;
      });
      return { content: chunk.content, score };
    });

    return scoredChunks
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .filter(c => c.score > 0)
      .map(c => c.content);
  }
}
