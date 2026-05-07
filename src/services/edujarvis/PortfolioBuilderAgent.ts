// src/services/edujarvis/PortfolioBuilderAgent.ts
import { GoogleGenAI } from "@/services/aiClient";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import crypto from 'crypto';

export class PortfolioBuilderAgent {
  public static async build(data: {
    tenantId: string;
    alunoId: string;
    alunoNome: string;
    skills: string[];
    projects: Array<{ title: string; description: string }>;
    credentials: string[];
  }) {
    const ai = new GoogleGenAI({});
    const systemPrompt = `
Você é o Portfolio Builder IA do EduJarvis.

Crie um portfólio educacional-profissional para aluno técnico.
Nome: ${data.alunoNome}
Skills: ${data.skills.join(", ")}
Projetos: ${JSON.stringify(data.projects)}
Credenciais: ${data.credentials.join(", ")}

Inclua:
1. Resumo profissional inicial
2. Competências principais
3. Projetos em destaque
4. Credenciais conquistadas
5. Texto para perfil público
6. Sugestões de melhoria do portfólio

Use linguagem profissional, mas adequada a aluno em formação.

Formato JSON:
{
  "title": "Portfólio de ...",
  "summary": "...",
  "publicProfileText": "...",
  "improvementSuggestions": ["..."]
}
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
      config: { responseMimeType: "application/json" }
    });

    const parsed = JSON.parse(result.text || "{}");
    const slug = crypto.randomUUID().split('-')[0] + '-' + data.alunoNome.replace(/\s+/g, '-').toLowerCase();

    await addDoc(collection(db, 'portfolio_pages'), {
      tenantId: data.tenantId,
      alunoId: data.alunoId,
      title: parsed.title,
      summary: parsed.summary,
      skills: data.skills,
      projects: JSON.stringify(data.projects),
      credentials: JSON.stringify(data.credentials),
      publicSlug: slug,
      visibility: 'private',
      createdAt: serverTimestamp()
    });

    return { slug, ...parsed };
  }
}
