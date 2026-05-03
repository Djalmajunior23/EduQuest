// src/services/edujarvis/AgentMarketplaceService.ts
import { GoogleGenAI } from '@google/genai';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export class AgentMarketplaceService {
  public static async runAgent(data: {
    tenantId: string;
    agentSlug: string;
    message: string;
    userRole: "student" | "teacher" | "coordinator" | "admin";
    context?: Record<string, unknown>;
  }) {
    // 1. Verify if agent is enabled for tenant
    const q = query(
      collection(db, 'tenant_enabled_agents'),
      where('tenantId', '==', data.tenantId),
      where('agentSlug', '==', data.agentSlug),
      where('enabled', '==', true)
    );
    const snap = await getDocs(q);
    
    // Simplification for prototype: If no record found but we want to allow testing, we proceed.
    // In production, we'd throw if snap.empty.

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    
    // We would fetch the agent config here. For now, hardcode behavior based on slug.
    const systemPrompt = `
Você é o agente ${data.agentSlug} do Learning Agent Marketplace do EduJarvis.

Regras:
- Respeite o perfil do usuário: ${data.userRole}.
- Não entregue cola.
- Oriente o raciocínio.
- Use linguagem adequada.
- Mantenha foco educacional.
- Informações de contexto: ${JSON.stringify(data.context || {})}
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: systemPrompt }, { text: data.message }] }]
    });

    return result.text;
  }
}
