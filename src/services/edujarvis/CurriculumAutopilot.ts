// src/services/edujarvis/CurriculumAutopilot.ts
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { GoogleGenAI } from "@/services/aiClient";

export class CurriculumAutopilot {
  private static COLLECTION = 'curriculum_autopilot_proposals';

  public static async analyzeAndPropose(tenantId: string, performanceData: any) {
    const ai = new GoogleGenAI({});
    
    const prompt = `
Você é o AI Curriculum Autopilot. 
Dado o desempenho agregado da instituição:
${JSON.stringify(performanceData)}

Proponha 3 ajustes curriculares. 
Retorne um JSON estrito:
{
  "proposals": [
    {
      "course": "nome do curso",
      "adjustment": "descrição",
      "reason": "motivo baseado nos dados"
    }
  ]
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
      proposals: parsed.proposals || [],
      createdAt: serverTimestamp()
    });

    return parsed;
  }
}
