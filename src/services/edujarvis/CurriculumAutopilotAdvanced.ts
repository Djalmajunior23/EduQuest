// src/services/edujarvis/CurriculumAutopilotAdvanced.ts
import { GoogleGenAI } from '@google/genai';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export class CurriculumAutopilotAdvanced {
  private static COLLECTION = 'curriculum_recommendations';

  public static async analyze(data: {
    tenantId: string;
    courseName: string;
    unitName?: string;
    studentWeaknesses: Record<string, number>;
    marketSkills: string[];
    currentCurriculum: string;
  }) {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    const prompt = `
Você é o Curriculum Autopilot do EduJarvis.

Analise currículo, dificuldades dos alunos e habilidades exigidas pelo mercado.

Gere:
1. Diagnóstico curricular
2. Conteúdos que precisam de reforço
3. Conteúdos que podem ser acelerados
4. Novos tópicos recomendados
5. Sugestão de sequência didática
6. Prioridade de implementação
7. Justificativa pedagógica

Não remova a essência do curso. Apenas recomende melhorias.

Formato JSON:
{
  "diagnosis": "...",
  "reinforcement": ["..."],
  "accelerated": ["..."],
  "newTopics": ["..."],
  "suggestedSequence": ["..."],
  "priority": "alta|media|baixa",
  "justification": "..."
}
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: JSON.stringify(data, null, 2) }, { text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    const recommendation = JSON.parse(result.text || "{}");

    await addDoc(collection(db, this.COLLECTION), {
      tenantId: data.tenantId,
      courseName: data.courseName,
      unitName: data.unitName || null,
      weaknessMap: data.studentWeaknesses,
      marketSkills: data.marketSkills,
      recommendation: JSON.stringify(recommendation),
      priority: recommendation.priority || 'media',
      status: 'pending',
      createdAt: serverTimestamp()
    });

    return recommendation;
  }
}
