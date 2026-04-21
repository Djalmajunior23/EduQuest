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
    console.log(`Gerando texto (${modelOrTier || 'DEFAULT'}): ${prompt.substring(0, 50)}...`);
    return "# Missão Gerada pela IA\n\nEssa é uma missão exemplo.";
  }

  public static async generateJSON<T = any>(prompt: string, schema: any, model: string): Promise<T> {
    console.log(`Gerando JSON com ${model}...`);
    // Em um cenário real, retornaria o objeto parseado conforme o schema
    return {} as T; 
  }

  public static async tutorStudent(prompt: string, context: string) {
    console.log(`Tutoria de aluno: ${prompt.substring(0, 50)}...`);
    return "Resposta do tutor: " + prompt;
  }
}
