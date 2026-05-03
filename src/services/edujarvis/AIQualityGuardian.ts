// src/services/edujarvis/AIQualityGuardian.ts
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export class AIQualityGuardian {
  public static async reviewAIQuality(data: {
    tenantId: string;
    response: string;
    userRole: "student" | "teacher" | "coordinator" | "admin";
    agentName: string;
  }) {
    let score = 100;
    const issues: string[] = [];

    if (data.response.length < 50) {
      score -= 15;
      issues.push("Resposta muito curta.");
    }

    if (data.userRole === "student") {
      const riskyPatterns = [
        "a resposta correta é",
        "copie isso",
        "não precisa entender"
      ];

      for (const pattern of riskyPatterns) {
        if (data.response.toLowerCase().includes(pattern)) {
          score -= 25;
          issues.push("Resposta pode incentivar cola ou baixa autonomia.");
        }
      }
    }

    if (data.response.includes("não tenho certeza") && data.response.length < 120) {
      score -= 10;
      issues.push("Resposta pouco conclusiva.");
    }

    const review = {
      qualityScore: Math.max(0, score),
      issues,
      status: score >= 80 ? "approved" : score >= 60 ? "review" : "blocked"
    };

    await addDoc(collection(db, "ai_quality_reviews"), {
      tenantId: data.tenantId,
      agentName: data.agentName,
      responseContent: data.response.substring(0, 500) + (data.response.length > 500 ? '...' : ''), // truncate
      qualityScore: review.qualityScore,
      issues: review.issues,
      status: review.status,
      createdAt: serverTimestamp()
    });

    return review;
  }
}
