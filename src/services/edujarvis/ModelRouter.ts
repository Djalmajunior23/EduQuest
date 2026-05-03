// src/services/edujarvis/ModelRouter.ts

export type AIModelType = 'ollama-local' | 'gemini-flash' | 'gemini-pro' | 'cache';

export interface ModelRouterPolicy {
  complexity: 'low' | 'medium' | 'high';
  isCritical: boolean;
  tenantPlan: 'free' | 'pro' | 'enterprise';
}

export class ModelRouter {
  /**
   * Decide qual modelo de IA utilizar baseado na complexidade da tarefa,
   * plano do cliente e criticidade. No ambiente AI Studio, usamos Gemini,
   * mas a lógica permite roteamento futuro para Ollama.
   */
  public static route(policy: ModelRouterPolicy): AIModelType {
    // 1. Verificar plano
    if (policy.tenantPlan === 'free') {
      return 'gemini-flash'; // No cenário real aqui seria 'ollama-local'
    }

    // 2. Verificar complexidade
    if (policy.complexity === 'high' || policy.isCritical) {
      return 'gemini-pro';
    }

    // 3. Default
    return 'gemini-flash';
  }
}
