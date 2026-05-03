// src/services/edujarvis/ClassroomCompanion.ts
import { GoogleGenAI } from '@google/genai';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export class ClassroomCompanion {
  public static async generateQuickActivity(data: {
    tenantId: string;
    teacherId: string;
    topic: string;
    type: "quiz" | "example" | "challenge";
  }) {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const prompt = `Como companheiro de sala de aula, gere rapidamente: ${data.type} sobre o tópico ${data.topic}.
    Retorne o tempo estimado (ex: 5 min) e a atividade em formato JSON: {"activity": "", "estimatedTimeMin": 0}`;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    const parsed = JSON.parse(result.text || "{}");

    await addDoc(collection(db, "classroom_companion_sessions"), {
      tenantId: data.tenantId,
      teacherId: data.teacherId,
      topic: data.topic,
      activityType: data.type,
      generatedContent: JSON.stringify(parsed),
      createdAt: serverTimestamp()
    });

    return parsed;
  }
}
