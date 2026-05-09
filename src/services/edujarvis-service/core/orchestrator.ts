import { GoogleGenAI } from "@google/genai";
import { EDUCATION_PROMPTS } from "../prompts";

export enum EduJarvisAgent {
  TUTOR = 'tutor',
  CORRECTION = 'correction',
  PEDAGOGICAL = 'pedagogical',
  SIMULADO = 'simulado',
  ANALYTICS = 'analytics'
}

export interface OrchestratorConfig {
  agent: EduJarvisAgent;
  context: any;
  history?: any[];
  model?: string;
}

export class EduJarvisOrchestrator {
  private ai: GoogleGenAI;
  
  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async run(config: OrchestratorConfig): Promise<string> {
    console.log(`[EduJarvis] Orchestrating request for agent: ${config.agent}`);
    
    // 1. Context Selection & Prompt Construction
    const prompt = this.buildPrompt(config);

    // 2. IA Selection & Fallback Logic
    try {
      const response = await this.executeWithFallback(prompt, config);
      
      // 3. Validation & Confidence Scoring
      const validation = await this.validateResponse(response || '', config);
      
      if (validation.score < 0.6) {
        console.warn("[EduJarvis] Low confidence detected, retrying with stricter constraints...");
        return await this.executeWithFallback(prompt + "\nPOR FAVOR, SEJA EXTREMAMENTE FACTUAL E EVITE ALUCINAÇÕES.", config);
      }

      return response || '';
    } catch (error) {
      console.error("[EduJarvis] Orchestration failed:", error);
      throw error;
    }
  }

  private async validateResponse(response: string, config: OrchestratorConfig) {
    // Neural Validation Logic
    // In a real production system, this could call a smaller model (like Flash) 
    // to peer-review the output of the larger model.
    
    // For now, simple length and keyword check as proxy
    const score = response.length > 50 ? 0.9 : 0.5;
    return { score, isValid: score > 0.6 };
  }

  private buildPrompt(config: OrchestratorConfig): string {
    const { agent, context } = config;
    let base = EDUCATION_PROMPTS.SYSTEM_CORE + "\n\n";

    switch (agent) {
      case EduJarvisAgent.TUTOR:
        base += EDUCATION_PROMPTS.TUTOR_BASE;
        break;
      case EduJarvisAgent.CORRECTION:
        base += EDUCATION_PROMPTS.CORRECTION_BASE;
        break;
      case EduJarvisAgent.PEDAGOGICAL:
        base += EDUCATION_PROMPTS.PEDAGOGICAL_BASE;
        break;
      default:
        base += "Você é o EduJarvis, assistente educacional inteligente.";
    }

    // Replace variables (simple template engine)
    let finalPrompt = base;
    Object.entries(context || {}).forEach(([key, value]) => {
      finalPrompt = finalPrompt.split(`{{${key}}}`).join(String(value || ''));
    });

    return finalPrompt;
  }

  private async executeWithFallback(prompt: string, config: OrchestratorConfig) {
    // Primary = gemini-3.1-pro-preview (Complex Task)
    // Fallback = gemini-3-flash-preview (Basic Task)
    
    const primaryModel = config.model || "gemini-3.1-pro-preview";
    const fallbackModel = "gemini-3-flash-preview";
    
    try {
      const response = await this.ai.models.generateContent({
        model: primaryModel,
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });
      return response.text || '';
    } catch (primaryErr) {
      console.warn("[EduJarvis] Primary model failed, attempting fallback...", primaryErr);
      const response = await this.ai.models.generateContent({
        model: fallbackModel,
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });
      return response.text || '';
    }
  }
}
