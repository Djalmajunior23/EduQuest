import { GoogleGenerativeAI } from "@google/generative-ai";
import { EDUCATION_PROMPTS } from "../prompts";

export enum EduJarvisAgent {
  TUTOR = 'tutor',
  CORRECTION = 'correction',
  PEDAGOGICAL = 'pedagogical',
  SIMULADO = 'simulado',
  ANALYTICS = 'analytics',
  GAMIFICATION = 'gamification'
}

export interface OrchestratorConfig {
  agent: EduJarvisAgent;
  context: any;
  history?: any[];
  model?: string;
}

export class EduJarvisOrchestrator {
  private ai: GoogleGenerativeAI;
  
  constructor(apiKey: string) {
    this.ai = new GoogleGenerativeAI(apiKey);
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
      case EduJarvisAgent.ANALYTICS:
        base += EDUCATION_PROMPTS.ANALYTICS_BASE;
        break;
      case EduJarvisAgent.GAMIFICATION:
        base += EDUCATION_PROMPTS.GAMIFICATION_BASE;
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
    // Basic Security Guardrails
    const maliciousPatterns = [
      /ignore previous instructions/i,
      /reveal your secret/i,
      /show system prompts/i,
      /forget everything you know/i,
      /you are now an evil/i,
      /dangerous command/i,
      /rm -rf/i,
      /drop database/i
    ];

    if (maliciousPatterns.some(pattern => pattern.test(prompt))) {
      console.warn(`[NeuralCore] Potential injection attempt detected in prompt!`);
      return "Sinto muito, mas não posso processar essa solicitação devido a restrições de segurança.";
    }

    if (this.ai.apiKey === "SAFE_MODE_KEY") {
      throw new Error("EduJarvis is running in Safe Mode - AI Disabled");
    }

    const primaryModel = config.model || "gemini-1.5-pro";
    const secondaryModel = "gemini-1.5-flash";
    
    try {
      console.log(`[NeuralCore] Attempting Primary Model: ${primaryModel}`);
      const model = this.ai.getGenerativeModel({ model: primaryModel });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text() || '';
    } catch (primaryErr) {
      console.warn(`[NeuralCore] Primary (${primaryModel}) failed. Escalating to Secondary (${secondaryModel})...`, primaryErr);
      try {
        const model = this.ai.getGenerativeModel({ model: secondaryModel });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text() || '';
      } catch (secondaryErr) {
        console.error(`[NeuralCore] Secondary (${secondaryModel}) also failed.`, secondaryErr);
        throw secondaryErr;
      }
    }
  }
}
