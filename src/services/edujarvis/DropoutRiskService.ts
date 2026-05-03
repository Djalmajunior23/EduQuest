// src/services/edujarvis/DropoutRiskService.ts

export interface StudentRiskInput {
  taxaAcerto: number;
  frequencia: number;
  atividadesPendentes: number;
  diasSemAcesso: number;
  tempoMedioEstudo: number;
}

export interface RiskResult {
  score: number;
  nivel: "baixo" | "medio" | "alto";
  recomendacoes: string[];
}

export class DropoutRiskService {
  public static calculateDropoutRisk(input: StudentRiskInput): RiskResult {
    let score = 0;

    if (input.taxaAcerto < 0.5) score += 25;
    if (input.frequencia < 0.75) score += 25;
    if (input.atividadesPendentes >= 3) score += 20;
    if (input.diasSemAcesso >= 7) score += 20;
    if (input.tempoMedioEstudo < 15) score += 10;

    let nivel: "baixo" | "medio" | "alto" = "baixo";

    if (score >= 70) nivel = "alto";
    else if (score >= 40) nivel = "medio";

    const recomendacoes = 
      nivel === "alto"
        ? [
            "Contato individual com o aluno imediato",
            "Plano de recuperação pedagógica personalizado",
            "Atividade prática de retomada de vínculo",
            "Acompanhamento semanal com coordenação"
          ]
        : nivel === "medio"
        ? [
            "Enviar alerta pedagógico automático",
            "Recomendar trilha de revisão de base",
            "Monitorar participação em fóruns e chats"
          ]
        : [
            "Manter acompanhamento regular e feedbacks positivos"
          ];

    return {
      score,
      nivel,
      recomendacoes
    };
  }
}
