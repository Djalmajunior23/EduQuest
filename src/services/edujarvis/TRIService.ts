// src/services/edujarvis/TRIService.ts

export interface TRIItem {
  id: string;
  difficulty: number; // Parâmetro b (-3 a 3)
  discrimination: number; // Parâmetro a (0 a 2)
  guessing: number; // Parâmetro c (0 a 0.25)
}

export interface TRIResponse {
  itemId: string;
  isCorrect: boolean;
}

export class TRIService {
  /**
   * Calcula a probabilidade de acerto usando o modelo 3PL.
   * P(theta) = c + (1 - c) / (1 + exp(-a * (theta - b)))
   */
  public static calculateProbability(theta: number, item: TRIItem): number {
    const { difficulty, discrimination, guessing } = item;
    const exponent = -discrimination * (theta - difficulty);
    return guessing + (1 - guessing) / (1 + Math.exp(exponent));
  }

  /**
   * Estima a proficiência (theta) do aluno com base em suas respostas.
   * Usa um método simplificado de Máxima Verossimilhança ou EAP.
   */
  public static estimateProficiency(responses: TRIResponse[], itemsMap: Map<string, TRIItem>): number {
    let theta = 0; // Início neutro
    const iterations = 5;
    
    // Método Simplificado Iterativo
    for (let i = 0; i < iterations; i++) {
        let likelihoodGradient = 0;
        let secondDerivative = 0;

        responses.forEach(res => {
            const item = itemsMap.get(res.itemId);
            if (!item) return;

            const p = this.calculateProbability(theta, item);
            const q = 1 - p;
            
            // Simplificação para o gradiente de verossimilhança
            const weight = item.discrimination * (res.isCorrect ? (q/p) : -1);
            likelihoodGradient += weight;
            secondDerivative -= Math.abs(weight * 0.5); // Aproximação da curvatura
        });

        if (secondDerivative === 0) break;
        
        const delta = likelihoodGradient / secondDerivative;
        theta = Math.max(-4, Math.min(4, theta - delta));
    }

    return theta;
  }

  /**
   * Verifica a coerência pedagógica (curva de resposta).
   * Alunos que acertam questões difíceis mas erram fáceis têm baixa coerência.
   */
  public static calculateCoherence(responses: TRIResponse[], itemsMap: Map<string, TRIItem>): number {
    const sortedResponses = [...responses].sort((a, b) => {
        const itemA = itemsMap.get(a.itemId)?.difficulty || 0;
        const itemB = itemsMap.get(b.itemId)?.difficulty || 0;
        return itemA - itemB;
    });

    let incoherence = 0;
    let lastCorrectDifficulty = -Infinity;

    sortedResponses.forEach(res => {
        const difficulty = itemsMap.get(res.itemId)?.difficulty || 0;
        if (res.isCorrect) {
            lastCorrectDifficulty = difficulty;
        } else if (difficulty < lastCorrectDifficulty) {
            // Errou uma mais fácil que a última que acertou
            incoherence += (lastCorrectDifficulty - difficulty);
        }
    });

    // Score de 0 a 1 (1 = totalmente coerente)
    return Math.max(0, 1 - (incoherence / 10));
  }
}
