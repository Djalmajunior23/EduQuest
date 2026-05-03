// src/services/aiService.ts
import { GoogleGenAI } from "@google/genai";

// Abstração para suporte a fallback e governança (Seção 4.4, 13)
export class AIService {
  private static instance: GoogleGenAI;

  public static getAI() {
    if (!this.instance) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("GEMINI_API_KEY não configurada. IA indisponível.");
        return null;
      }
      this.instance = new GoogleGenAI({ apiKey });
    }
    return this.instance;
  }

  // Exemplos de métodos para otimização de custo (Section 13)
  public static async generateText(prompt: string, modelOrTier?: string) {
    const ai = this.getAI();
    if (!ai) return "IA Temporariamente Indisponível (Chave ausente).";

    // Mapeamento de Tiers para modelos específicos (Arquitetura Seção 4.10)
    // PROMO: Flash 2.0 (Equilíbrio)
    // PREMIUM: Flash 2.0 Thinking ou pro (Raciocínio)
    // LOCAL: Fallback para mensagem de erro ou chamada local (Ollama)
    const modelId = modelOrTier === 'PREMIUM' ? 'gemini-2.0-flash-exp' : 'gemini-2.0-flash-exp';

    try {
      const response = await ai.models.generateContent({
        model: modelId,
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      });
      return response.text || "Sem resposta.";
    } catch (e) {
      console.error("AI Generation Error", e);
      return "Erro ao gerar resposta da IA. Tente novamente.";
    }
  }

  public static async generateJSON<T = any>(prompt: string, schema: any, model: string): Promise<T> {
    // Em um cenário real, retornaria o objeto parseado conforme o schema
    return {} as T; 
  }

  public static async tutorStudent(prompt: string, context: string) {
    return "Resposta do tutor: " + prompt;
  }
}
