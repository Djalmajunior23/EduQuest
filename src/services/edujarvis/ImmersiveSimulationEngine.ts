// src/services/edujarvis/ImmersiveSimulationEngine.ts
import { GoogleGenAI } from '@google/genai';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export class ImmersiveSimulationEngine {
  public static async createImmersiveScenario(data: {
    tenantId: string;
    type: string;
    difficulty: string;
    competencies: string[];
  }) {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const prompt = `Crie uma simulação imersiva estilo laboratório virtual. 
    Tipo: ${data.type}. Dificuldade: ${data.difficulty}.
    Competências a avaliar: ${data.competencies.join(', ')}.
    Retorne JSON: { "title": "", "scenario": "", "characters": [{"name": "", "role": ""}], "problem": "", "expectedDecisions": [] }`;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    const parsed = JSON.parse(result.text || "{}");

    await addDoc(collection(db, "immersive_simulations"), {
      tenantId: data.tenantId,
      title: parsed.title || "Immersive Simulation",
      simulationType: data.type,
      scenario: JSON.stringify(parsed),
      difficulty: data.difficulty,
      competencies: data.competencies,
      createdAt: serverTimestamp()
    });

    return parsed;
  }
}
