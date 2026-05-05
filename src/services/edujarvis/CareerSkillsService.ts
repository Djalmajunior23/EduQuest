// src/services/edujarvis/CareerSkillsService.ts
import { collection, addDoc, serverTimestamp, query, where, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { GoogleGenAI } from '@google/genai';

export interface CareerPath {
  alunoId: string;
  tenantId: string;
  recommendedRoles: string[];
  skillsGap: string[];
  projectSuggestions: string[];
  updatedAt: any;
}

export class CareerSkillsService {
  private static COLLECTION = 'career_paths_ai';

  public static async generateCareerPath(alunoId: string, tenantId: string, profile: any) {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    
    // Simular RAG de Industry Skills
    const prompt = `
Atue como o Education-to-Workforce Intelligence.
O aluno tem o seguinte perfil técnico: ${JSON.stringify(profile)}

Com base no "Industry Skills Mapping" de 2026 para a área de Tecnologia, cruze as habilidades dominadas pelo aluno com as exigências de mercado.
Retorne um JSON estrito:
{
  "recommendedRoles": ["Junior Cloud Engineer", "SOC Analyst Tier 1"],
  "skillsGap": ["Terraform", "Kubernetes"],
  "projectSuggestions": ["Construir uma cloud privada simulada"]
}
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    const parsed = JSON.parse(result.text || "{}");

    // Persist
    const docRef = doc(db, this.COLLECTION, `${tenantId}_${alunoId}`);
    await setDoc(docRef, {
      ...parsed,
      alunoId,
      tenantId,
      updatedAt: serverTimestamp()
    }, { merge: true });

    return parsed;
  }
  
  public static async getCareerPath(alunoId: string, tenantId: string) {
      const docRef = doc(db, this.COLLECTION, `${tenantId}_${alunoId}`);
      const snap = await getDoc(docRef);
      if(snap.exists()) return snap.data();
      return null;
  }
}
