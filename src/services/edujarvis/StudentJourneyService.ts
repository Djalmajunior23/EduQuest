// src/services/edujarvis/StudentJourneyService.ts

export type JourneyStage = 'diagnostico' | 'aprendizagem' | 'simulados' | 'recuperacao' | 'evolucao' | 'certificacao';

export interface JourneyStatus {
  stage: JourneyStage;
  nextAction: string;
  progress: number; // 0 to 100
}

export class StudentJourneyService {
  /**
   * Analisa os marcos do aluno para determinar em qual estágio da jornada ele se encontra.
   */
  public static analyzeJourney(data: {
    diagnosticoInicial: boolean;
    atividadesConcluidas: number;
    totalAtividades: number;
    simuladosRealizados: number;
    recuperacoesRealizadas: number;
    taxaAcerto: number;
  }): JourneyStatus {
    
    if (!data.diagnosticoInicial) {
      return {
        stage: "diagnostico",
        nextAction: "Aplicar diagnóstico inicial para calibrar IA",
        progress: 0
      };
    }

    if (data.taxaAcerto < 0.6) {
      return {
        stage: "recuperacao",
        nextAction: "Gerar plano de recuperação personalizado no EduJarvis",
        progress: (data.atividadesConcluidas / data.totalAtividades) * 100
      };
    }

    if (data.simuladosRealizados < 1) {
      return {
        stage: "simulados",
        nextAction: "Realizar o primeiro simulado adaptativo do módulo",
        progress: 40
      };
    }

    if (data.atividadesConcluidas >= data.totalAtividades) {
      return {
        stage: "certificacao",
        nextAction: "Solicitar avaliação final e gerar certificado",
        progress: 100
      };
    }

    return {
      stage: "aprendizagem",
      nextAction: "Continuar atividades da trilha personalizada",
      progress: (data.atividadesConcluidas / data.totalAtividades) * 100
    };
  }
}
