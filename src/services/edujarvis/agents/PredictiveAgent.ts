// src/services/edujarvis/agents/PredictiveAgent.ts
import { PredictiveEducationEngine } from '../PredictiveEducationEngine';
import { StudentDigitalTwinService } from '../StudentDigitalTwinService';

export class PredictiveAgent {
  public static async execute(alunoId: string) {
    const twin = await StudentDigitalTwinService.getTwin(alunoId);
    if (!twin) return "Gêmeo digital não encontrado para análise preditiva.";

    const prediction = PredictiveEducationEngine.analyze(twin);

    return `
### 📊 ANÁLISE PREDITIVA (EduJarvis):
- **Classificação**: ${prediction.classificacao.toUpperCase()}
- **Oportunidade de Evolução**: ${(prediction.chanceEvolucao * 100).toFixed(1)}%
- **Risco de Reprovação**: ${(prediction.riscoReprovacao * 100).toFixed(1)}%
- **Risco de Evasão**: ${(prediction.riscoEvasao * 100).toFixed(1)}%

**Insight**: ${this.getInsight(prediction)}
`;
  }

  private static getInsight(p: any) {
    if (p.classificacao === 'crítico') return "Ação imediata recomendada. Alto risco detectado.";
    if (p.classificacao === 'excelente') return "Aluno em alta performance. Sugerir desafios extras.";
    return "Desempenho estável dentro da curva esperada.";
  }
}
