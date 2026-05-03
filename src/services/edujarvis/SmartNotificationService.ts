// src/services/edujarvis/SmartNotificationService.ts

export interface NotificationPayload {
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  context?: Record<string, any>;
  roleTarget: 'student' | 'teacher' | 'coordinator' | 'admin';
}

export class SmartNotificationService {
  /**
   * Gera mensagens de notificação inteligentes baseadas em eventos do sistema.
   */
  public static generateNotification(params: {
    role: 'student' | 'teacher' | 'coordinator' | 'admin';
    eventType: string;
    severity: 'low' | 'medium' | 'high';
    context: Record<string, any>;
  }): NotificationPayload {
    
    const roleTitles: Record<string, string> = {
      student: "Atenção Aluno",
      teacher: "Destaque Pedagógico",
      coordinator: "Alerta de Coordenação",
      admin: "Monitoramento de Sistema IA"
    };

    let message = "Há uma nova atualização relevante no EduJarvis.";

    if (params.eventType === "low_performance") {
      message = params.role === 'student' 
        ? "Notamos um desafio em seu último exercício. Vamos revisar?" 
        : `O aluno ${params.context.studentName} apresentou queda de desempenho crítica.`;
    } else if (params.eventType === "curriculum_gap") {
      message = "Detectamos um gargalo de conteúdo na turma 302. Sugerimos intervenção.";
    } else if (params.eventType === "journey_completion") {
      message = "Parabéns! Você concluiu 80% do seu plano de estudos mensal.";
    }

    return {
      title: roleTitles[params.role] || "Notificação EduJarvis",
      message,
      severity: params.severity,
      context: params.context,
      roleTarget: params.role
    };
  }
}
