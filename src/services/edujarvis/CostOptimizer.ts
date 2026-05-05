// src/services/edujarvis/CostOptimizer.ts

export type AITier = 'LOCAL' | 'PROMO' | 'PREMIUM';

export class CostOptimizer {
  /**
   * Decide qual nível de IA usar baseado na complexidade e urgência.
   * LOCAL: Questões simples, saudações, tarefas repetitivas (Ollama/Fallback).
   * PROMO: Interações padrão, resumos, geração de questões (Gemini Flash).
   * PREMIUM: Code Review complexo, Lesson Planning, Análise de Dados Sensíveis (Gemini Pro/Thinking).
   */
  public static route(message: string, context: any): AITier {
    const text = message.toLowerCase();

    // Prioridade PREMIUM
    if (
      text.includes("revisar código") || 
      text.includes("lesson") || 
      text.includes("plano de aula") ||
      text.length > 500
    ) {
      return 'PREMIUM';
    }

    // Prioridade LOCAL / Baixa complexidade
    if (
      text.length < 20 || 
      text.includes("oi") || 
      text.includes("bom dia") || 
      text.includes("obrigado")
    ) {
      return 'LOCAL';
    }

    // Padrão PROMO
    return 'PROMO';
  }

  public static getModelByTier(tier: AITier): string {
    switch (tier) {
      case 'PREMIUM': return 'gemini-2.5-flash'; // Imagine being Pro/Thinking here
      case 'PROMO': return 'gemini-2.0-flash-exp';
      case 'LOCAL': return 'gemini-2.0-flash-exp'; // In real world would be 'ollama-llama3'
      default: return 'gemini-2.0-flash-exp';
    }
  }
}
