// src/services/edujarvis/IntelligentContentFactory.ts
import { GoogleGenAI } from "@/services/aiClient";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export class IntelligentContentFactory {
  public static async generateContentPack(data: {
    tenantId: string;
    teacherId: string;
    theme: string;
    level: string;
  }) {
    const ai = new GoogleGenAI({});
    
    const prompt = `Gere um pacote completo de conteúdo sobre: ${data.theme}. Nível: ${data.level}.
    O pacote deve conter: Aula, Exercícios, Projeto, Rubrica.
    Responda em um JSON robusto e estruturado: {"lessonPlan": {}, "exercises": [], "projectDesc": "", "rubric": []}`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    const parsed = JSON.parse(result.text || "{}");

    await addDoc(collection(db, "ai_content_factory_packs"), {
      tenantId: data.tenantId,
      teacherId: data.teacherId,
      theme: data.theme,
      contentPack: JSON.stringify(parsed),
      createdAt: serverTimestamp()
    });

    return parsed;
  }
}
