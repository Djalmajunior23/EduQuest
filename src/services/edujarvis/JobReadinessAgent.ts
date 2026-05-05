// src/services/edujarvis/JobReadinessAgent.ts
import { GoogleGenAI } from '@google/genai';

export class JobReadinessAgent {
  public static async evaluate(data: {
    skills: Record<string, number>;
    projects: string[];
    credentials: string[];
    targetRole: string;
  }) {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const systemPrompt = `
Você é o Job Readiness AI do EduJarvis.

Analise se o aluno está pronto para a função de: ${data.targetRole}.
Skills atuais: ${JSON.stringify(data.skills)}
Projetos: ${data.projects.join(', ')}
Credenciais: ${data.credentials.join(', ')}

Gere:
1. Score de prontidão (0-100)
2. Pontos fortes
3. Lacunas técnicas
4. Projetos recomendados
5. Preparação para entrevista
6. Plano de evolução em 30 dias

Formato JSON:
{
  "readinessScore": 0,
  "strengths": ["..."],
  "gaps": ["..."],
  "recommendedProjects": ["..."],
  "interviewPrep": "...",
  "evolutionPlan": "..."
}
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(result.text || "{}");
  }
}
