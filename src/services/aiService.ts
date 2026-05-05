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

  // Método unificado para geração de texto com suporte a sistema e usuário
  public static async generate(prompt: string, systemInstruction?: string, modelId: string = 'gemini-2.5-flash') {
    const ai = this.getAI();
    if (!ai) return "IA Temporariamente Indisponível.";

    try {
      const contents: any[] = [];
      if (systemInstruction) {
        // No SDK @google/genai 1.x, a instrução de sistema pode ser passada como um papel 'system' ou na config
        // Para simplificar e garantir compatibilidade, vamos concatenar no prompt ou usar a estrutura correta se disponível
        contents.push({ role: "user", parts: [{ text: `[INSTRUÇÃO DE SISTEMA]: ${systemInstruction}\n\n[MENSAGEM]: ${prompt}` }] });
      } else {
        contents.push({ role: "user", parts: [{ text: prompt }] });
      }

      const response = await ai.models.generateContent({
        model: modelId,
        contents
      });
      return response.text || "Sem resposta da rede neural.";
    } catch (e) {
      console.error("[AIService Error]", e);
      return "Erro na Matrix: Falha ao processar resposta da IA.";
    }
  }

  public static async generateJSON<T = any>(prompt: string, schema: any, modelTier?: string): Promise<T> {
    const ai = this.getAI();
    if (!ai) throw new Error("IA_OFFLINE");

    const modelId = modelTier === 'PREMIUM' ? 'gemini-2.5-flash' : 'gemini-2.5-flash';

    try {
      const fullPrompt = `${prompt}\n\nResponda estritamente em JSON seguindo este schema: ${JSON.stringify(schema)}`;
      
      const result = await ai.models.generateContent({
        model: modelId,
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }]
      });
      
      const text = result.text || "";
      
      // Limpeza básica de markdown
      const cleanJson = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson) as T;
    } catch (e) {
      console.error("AI JSON Generation Error", e);
      throw e;
    }
  }
}
