// src/services/edujarvis/BusinessCopilot.ts
import { GoogleGenAI } from "@/services/aiClient";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export class BusinessCopilot {
  public static async analyzeBusiness(data: {
    tenantId: string;
    adminId: string;
    metrics: any;
  }) {
    const ai = new GoogleGenAI({});
    const prompt = `Como Copiloto de Negócios SaaS Educacional, analise: ${JSON.stringify(data.metrics)}.
    Gere um relatório JSON: {"healthAssessment": "", "churnRiskFactors": [], "growthOpportunities": []}`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    const parsed = JSON.parse(result.text || "{}");

    await addDoc(collection(db, "business_copilot_insights"), {
      tenantId: data.tenantId,
      adminId: data.adminId,
      inputMetrics: JSON.stringify(data.metrics),
      insight: JSON.stringify(parsed),
      createdAt: serverTimestamp()
    });

    return parsed;
  }
}
