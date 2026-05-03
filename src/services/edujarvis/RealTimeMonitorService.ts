// src/services/edujarvis/RealTimeMonitorService.ts

export interface ClassroomEvent {
  alunoId: string;
  eventType: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface StudentStatusReport {
  alunoId: string;
  status: 'progredindo' | 'precisa_apoio' | 'observacao' | 'concluiu_rapido';
  recommendation: string;
  metrics: {
    errors: number;
    completed: number;
    totalEvents: number;
  };
}

export class RealTimeMonitorService {
  /**
   * Analisa eventos de sala de aula em tempo real para gerar um dashboard de intervenção para o professor.
   */
  public static analyzeClassroom(events: ClassroomEvent[]): StudentStatusReport[] {
    const byStudent: Record<string, any> = {};

    for (const event of events) {
      if (!byStudent[event.alunoId]) {
        byStudent[event.alunoId] = {
          totalEvents: 0,
          errors: 0,
          completed: 0,
          lastActive: event.timestamp
        };
      }

      byStudent[event.alunoId].totalEvents++;

      if (event.eventType === "erro_questao" || event.eventType === "question_error") {
        byStudent[event.alunoId].errors++;
      }

      if (event.eventType === "atividade_concluida" || event.eventType === "activity_completed") {
        byStudent[event.alunoId].completed++;
      }
      
      if (new Date(event.timestamp) > new Date(byStudent[event.alunoId].lastActive)) {
        byStudent[event.alunoId].lastActive = event.timestamp;
      }
    }

    return Object.entries(byStudent).map(([alunoId, data]: [string, any]) => {
      let status: StudentStatusReport['status'] = 'observacao';
      let recommendation = "Manter acompanhamento regular.";

      if (data.errors >= 3) {
        status = 'precisa_apoio';
        recommendation = "O aluno travou em uma sequência de erros. Recomenda-se intervenção direta ou material de reforço.";
      } else if (data.completed >= 3 && data.totalEvents < 10) {
        status = 'concluiu_rapido';
        recommendation = "O aluno está finalizando as tarefas com extrema facilidade. Sugerir atividades de nível avançado.";
      } else if (data.completed > 0) {
        status = 'progredindo';
        recommendation = "Fluxo de aprendizado saudável.";
      }

      return {
        alunoId,
        status,
        recommendation,
        metrics: {
          errors: data.errors,
          completed: data.completed,
          totalEvents: data.totalEvents
        }
      };
    });
  }
}
