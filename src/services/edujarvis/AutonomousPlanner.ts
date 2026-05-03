// src/services/edujarvis/AutonomousPlanner.ts
import { GoogleGenAI } from '@google/genai';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export class AutonomousPlanner {
  public static async generatePlan(data: {
    tenantId: string;
    classId: string;
    topic: string;
    durationWeeks: number;
    studentNeeds: string[];
  }) {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const prompt = `Crie um planejamento pedagógico autônomo sobre ${data.topic} para ${data.durationWeeks} semanas.
    Necessidades da turma: ${data.studentNeeds.join(', ')}.
    Retorne em JSON: { "planTitle": "", "weeklyPlans": [{"week": 1, "topics": [], "activities": [], "interventions": []}] }`;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    const parsed = JSON.parse(result.text || "{}");

    await addDoc(collection(db, "autonomous_planners"), {
      tenantId: data.tenantId,
      classId: data.classId,
      planData: JSON.stringify(parsed),
      createdAt: serverTimestamp()
    });

    return parsed;
  }
}
