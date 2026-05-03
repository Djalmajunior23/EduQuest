// src/services/edujarvis/AdvancedPersonalizationService.ts
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { GoogleGenAI } from '@google/genai';

export interface PersonalizationProfile {
  alunoId: string;
  tenantId: string;
  learningStyle: 'visual' | 'practical' | 'theoretical' | 'mixed';
  preferredContentType: 'video' | 'text' | 'demo' | 'quiz' | 'project';
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  engagementScore: number;
  masteryMap: Record<string, number>;
  updatedAt: any;
}

export class AdvancedPersonalizationService {
  private static COLLECTION = 'personalization_profiles';

  /**
   * Atualiza o perfil adaptativo do aluno baseado no comportamento recente.
   */
  public static async updateProfile(data: Partial<PersonalizationProfile> & { alunoId: string; tenantId: string }) {
    const docRef = doc(db, this.COLLECTION, `${data.tenantId}_${data.alunoId}`);
    await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
  }

  /**
   * Gera uma recomendação ultra-personalizada usando IA.
   */
  public static async getPersonalizedRecommendation(profile: PersonalizationProfile, topic: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    const prompt = `
Aja como o AI Personalization Engine do EduJarvis. 
Gere uma estratégia de estudo personalizada para um aluno com o seguinte perfil:
- Estilo: ${profile.learningStyle}
- Nível: ${profile.difficultyLevel}
- Domínio Atual: ${JSON.stringify(profile.masteryMap)}

Tópico Alvo: ${topic}

Retorne uma recomendação prática, uma missão gamificada e o próximo passo ideal.
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    return result.text || "Continue focado em seus estudos!";
  }
}
