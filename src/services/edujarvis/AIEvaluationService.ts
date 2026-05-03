// src/services/edujarvis/AIEvaluationService.ts

export interface EvaluationResult {
  score: number;
  issues: string[];
  status: 'approved' | 'review' | 'blocked';
  feedback?: string;
}

export class AIEvaluationService {
  /**
   * Avalia a qualidade pedagógica e técnica de uma resposta gerada pela IA.
   */
  public static evaluateResponse(data: {
    response: string;
    userRole: string;
    agentName: string;
  }): EvaluationResult {
    let score = 100;
    const issues: string[] = [];

    // 1. Verificação de Extensão
    if (data.response.length < 50) {
      score -= 15;
      issues.push("Resposta excessivamente curta para o contexto educacional.");
    }

    // 2. Verificação de "Entrega de Resposta" (Pedagogia)
    const shortcuts = ["a resposta final é", "o resultado é", "segue a resposta:"];
    if (data.userRole === "student" && shortcuts.some(s => data.response.toLowerCase().includes(s))) {
      score -= 30;
      issues.push("A IA pode estar entregando a resposta sem explicar o processo (Socrático fail).");
    }

    // 3. Verificação de "Não sei" vago
    if (data.response.toLowerCase().includes("não sei") && data.response.length < 100) {
      score -= 20;
      issues.push("A IA demonstrou incapacidade de ajudar sem sugerir caminhos alternativos.");
    }

    // 4. Verificação de Alucinação (Heurística simples de repetição)
    const words = data.response.split(/\s+/);
    if (words.length > 50 && new Set(words).size / words.length < 0.4) {
      score -= 25;
      issues.push("Detectada alta repetição de palavras, sinal de possível degradação do modelo.");
    }

    return {
      score: Math.max(0, score),
      issues,
      status: score >= 85 ? 'approved' : score >= 60 ? 'review' : 'blocked'
    };
  }
}
