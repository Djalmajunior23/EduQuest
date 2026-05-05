// src/services/edujarvis/AdvancedSimulationAgent.ts
import { GoogleGenAI } from '@google/genai';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export class AdvancedSimulationAgent {
  public static async createSimulation(data: {
    tenantId: string;
    alunoId: string;
    type: string;
    difficulty: "iniciante" | "intermediario" | "avancado";
    theme: string;
  }) {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const systemPrompt = `
Você é o Advanced Simulation Lab do EduJarvis.

Crie uma simulação prática em múltiplas etapas sobre o tema: ${data.theme}.
Dificuldade: ${data.difficulty}
Tipo: ${data.type}

Formato obrigatório em JSON:
{
  "title": "",
  "context": "",
  "role": "",
  "objective": "",
  "steps": [
    {
      "step": 1,
      "situation": "",
      "task": "",
      "expectedAction": "",
      "evaluationCriteria": ["..."]
    }
  ],
  "finalDeliverable": "",
  "rubric": ["..."]
}

Crie cenário realista, seguro e educacional.
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
      config: { responseMimeType: "application/json" }
    });

    const parsed = JSON.parse(result.text || "{}");

    // Persist session
    const docRef = await addDoc(collection(db, 'advanced_simulation_sessions'), {
      tenantId: data.tenantId,
      alunoId: data.alunoId,
      simulationType: data.type,
      difficulty: data.difficulty,
      scenario: JSON.stringify(parsed),
      currentStep: 1,
      status: 'running',
      score: 0,
      createdAt: serverTimestamp()
    });

    return { id: docRef.id, sessionData: parsed };
  }
}
