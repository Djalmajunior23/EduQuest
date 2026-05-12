// src/services/aiService.ts
import { GoogleGenAI } from "@/services/aiClient";

// Abstração para suporte a fallback e governança (Seção 4.4, 13)
export class AIService {
  private static instance: GoogleGenAI;

  public static getAI() {
    if (!this.instance) {
      this.instance = new GoogleGenAI({});
    }
    return this.instance;
  }

  // Método unificado para geração de texto com suporte a sistema e usuário
  public static async generate(prompt: string, systemInstruction?: string, modelId: string = 'gemini-3-flash-preview') {
    const ai = this.getAI();

    try {
      const response = await ai.models.generateContent({
        model: modelId,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        systemInstruction: systemInstruction
      });
      return response.text || "Sem resposta da rede neural.";
    } catch (e) {
      console.error("[AIService Error]", e);
      return "IA Temporariamente Indisponível (Nexus Link Offline).";
    }
  }

  public static async generateJSON<T = any>(prompt: string, schema: any, modelTier?: string): Promise<T> {
    const ai = this.getAI();
    const modelId = modelTier === 'PREMIUM' ? 'gemini-3.1-pro-preview' : 'gemini-3-flash-preview'; // Updated to latest recommended models

    try {
      const result = await ai.models.generateContent({
        model: modelId,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: schema
        }
      });
      
      const text = result.text || "";
      return JSON.parse(text) as T;
    } catch (e) {
      console.error("AI JSON Generation Error", e);
      throw e;
    }
  }
}
