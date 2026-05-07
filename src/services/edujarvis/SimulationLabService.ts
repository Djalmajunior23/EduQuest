// src/services/edujarvis/SimulationLabService.ts
import { GoogleGenAI } from "@/services/aiClient";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export class SimulationLabService {
  private static COLLECTION = 'ai_simulation_labs';

  public static async startLabSession(tenantId: string, alunoId: string, scenario: string) {
    const ai = new GoogleGenAI({});
    
    const prompt = `
Inicie uma sessão de laboratório simulado sobre: ${scenario}.
Retorne a introdução do cenário, o objetivo principal e a primeira situação/desafio que o aluno deve resolver.
Retorne um JSON estrito:
{
  "title": "...",
  "objective": "...",
  "firstChallenge": "..."
}
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    const parsed = JSON.parse(result.text || "{}");

    await addDoc(collection(db, this.COLLECTION), {
      tenantId,
      alunoId,
      scenario,
      status: 'active',
      startedAt: serverTimestamp()
    });

    return parsed;
  }
}
