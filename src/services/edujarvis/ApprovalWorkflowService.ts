// src/services/edujarvis/ApprovalWorkflowService.ts
import { collection, addDoc, getDocs, query, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ApprovalRequest {
  id?: string;
  tenantId: string;
  requestedBy: string;
  type: 'critical_report' | 'student_risk_alert' | 'curriculum_change' | 'official_intervention';
  payload: any;
  status: ApprovalStatus;
  reviewedBy?: string;
  reviewedAt?: any;
  createdAt: any;
}

export class ApprovalWorkflowService {
  private static COLLECTION = 'ai_approval_requests';

  /**
   * Cria uma solicitação de aprovação para uma ação crítica da IA.
   */
  public static async requestApproval(data: Omit<ApprovalRequest, 'status' | 'createdAt'>) {
    try {
      await addDoc(collection(db, this.COLLECTION), {
        ...data,
        status: 'pending',
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Failed to create approval request", error);
    }
  }

  /**
   * Lista solicitações pendentes para um tenant.
   */
  public static async getPendingRequests(tenantId: string): Promise<ApprovalRequest[]> {
    const q = query(
      collection(db, this.COLLECTION), 
      where('tenantId', '==', tenantId),
      where('status', '==', 'pending')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ApprovalRequest));
  }

  /**
   * Aprova ou rejeita uma solicitação.
   */
  public static async processRequest(requestId: string, status: 'approved' | 'rejected', userId: string) {
    const docRef = doc(db, this.COLLECTION, requestId);
    await updateDoc(docRef, {
      status,
      reviewedBy: userId,
      reviewedAt: serverTimestamp()
    });
  }
}
