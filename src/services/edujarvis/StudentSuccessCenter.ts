// src/services/edujarvis/StudentSuccessCenter.ts
import { collection, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export class StudentSuccessCenter {
  public static async calculateStudentSuccess(data: {
    tenantId: string;
    studentId: string;
    engagement: number;
    performance: number;
    missionsCompleted: number;
    riskLevel: "baixo" | "medio" | "alto";
  }) {
    let score = 0;

    score += data.engagement * 0.35;
    score += data.performance * 0.45;
    score += Math.min(data.missionsCompleted * 5, 20);

    if (data.riskLevel === "alto") score -= 25;
    if (data.riskLevel === "medio") score -= 10;

    const successScore = Math.max(0, Math.min(100, Math.round(score)));
    const status =
        successScore >= 80
          ? "em_evolucao_forte"
          : successScore >= 60
          ? "estavel"
          : "precisa_apoio";
    
    const recommendation =
        successScore >= 80
          ? "Liberar desafio avançado e projeto para portfólio."
          : successScore >= 60
          ? "Manter trilha atual e monitorar evolução."
          : "Acionar plano de recuperação e apoio do professor.";

    const result = {
      successScore,
      status,
      recommendation
    };

    // Upsert success record
    const docRef = doc(db, 'student_success_center', `${data.tenantId}_${data.studentId}`);
    await setDoc(docRef, {
      tenantId: data.tenantId,
      studentId: data.studentId,
      engagementScore: data.engagement,
      successScore: result.successScore,
      riskLevel: data.riskLevel,
      status: result.status,
      recommendations: JSON.stringify({ r: result.recommendation }),
      updatedAt: serverTimestamp()
    }, { merge: true });

    return result;
  }
}
