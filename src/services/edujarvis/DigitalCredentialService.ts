// src/services/edujarvis/DigitalCredentialService.ts
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import crypto from 'crypto';

export interface DigitalCredential {
  alunoId: string;
  tenantId: string;
  type: 'badge' | 'certificate' | 'micro-credential';
  title: string;
  skills: string[];
  issuedAt: any;
  verificationCode?: string;
  publicUrl?: string;
  revoked?: boolean;
}

export class DigitalCredentialService {
  private static COLLECTION = 'digital_credentials';

  public static async issueCredential(data: Omit<DigitalCredential, 'issuedAt'>) {
    const verificationCode = crypto.randomBytes(16).toString('hex');
    const publicUrl = `https://edujarvis.com/verify/${verificationCode}`; // in a real app would use the host url

    await addDoc(collection(db, this.COLLECTION), {
      ...data,
      verificationCode,
      publicUrl,
      revoked: false,
      issuedAt: serverTimestamp()
    });
  }

  public static async getStudentCredentials(alunoId: string) {
    const q = query(collection(db, this.COLLECTION), where('alunoId', '==', alunoId));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  public static async verifyCredential(code: string) {
    const q = query(collection(db, this.COLLECTION), where('verificationCode', '==', code));
    const snap = await getDocs(q);
    if(snap.empty) return { valid: false };
    const docData = snap.docs[0].data();
    if(docData.revoked) return { valid: false, revoked: true };
    return { valid: true, credential: { id: snap.docs[0].id, ...docData } };
  }
}
