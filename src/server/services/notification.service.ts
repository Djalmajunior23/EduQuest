import { prisma } from '../lib/prisma';
import { emailService } from './email/email.service';

export type NotificationType = 'INFO' | 'ALERTA' | 'SUCESSO' | 'ERRO' | 'IA_PEDAGOGICAL';

export interface CreateNotificationOptions {
  usuarioId?: string;
  tenantId: string;
  titulo: string;
  mensagem: string;
  tipo?: NotificationType;
  sendEmail?: boolean;
  emailTemplate?: any;
  emailContext?: Record<string, any>;
}

class NotificationService {
  async notify(options: CreateNotificationOptions) {
    // 1. Salvar no banco para o in-app
    const notification = await prisma.notificacao.create({
      data: {
        titulo: options.titulo,
        mensagem: options.mensagem,
        tipo: options.tipo || 'INFO',
        tenantId: options.tenantId,
        usuarioId: options.usuarioId,
      }
    });

    // 2. Enviar e-mail se solicitado
    if (options.sendEmail && (options.usuarioId || options.emailContext?.to)) {
      try {
        let recipientEmail = options.emailContext?.to;
        
        if (!recipientEmail && options.usuarioId) {
          const user = await prisma.usuario.findUnique({
            where: { id: options.usuarioId },
            select: { email: true }
          });
          recipientEmail = user?.email;
        }

        if (recipientEmail) {
          await emailService.sendEmail({
            to: recipientEmail,
            subject: options.titulo,
            template: options.emailTemplate || 'default',
            context: {
              ...options.emailContext,
              message: options.mensagem
            }
          });
        }
      } catch (error) {
        console.error('[NotificationService] Erro ao enviar e-mail complementar:', error);
      }
    }

    return notification;
  }

  async markAsRead(id: string) {
    return prisma.notificacao.update({
      where: { id },
      data: { lida: true }
    });
  }

  async markAllAsRead(usuarioId: string) {
    return prisma.notificacao.updateMany({
      where: { usuarioId, lida: false },
      data: { lida: true }
    });
  }

  async getNotifications(usuarioId: string, limit = 10) {
    return prisma.notificacao.findMany({
      where: { usuarioId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  // Notificações Automatizadas Inteligentes
  async notifyPedagogicalAlert(professorId: string, tenantId: string, turmaName: string, insight: string) {
    return this.notify({
      usuarioId: professorId,
      tenantId,
      titulo: '⚠️ Alerta Pedagógico AI',
      mensagem: `A turma ${turmaName} apresenta indicadores críticos: ${insight}`,
      tipo: 'ALERTA',
      sendEmail: true,
      emailTemplate: 'pedagogical-alert',
      emailContext: { turmaName, insight, dashboardUrl: `${process.env.VITE_APP_URL}/bi` }
    });
  }

  async notifyLowPerformance(studentId: string, tenantId: string, activityName: string) {
    return this.notify({
      usuarioId: studentId,
      tenantId,
      titulo: '🚀 Vamos reforçar seu aprendizado?',
      mensagem: `O EduJarvis notou que você teve dificuldade na atividade "${activityName}". Que tal revisar o conteúdo agora?`,
      tipo: 'INFO',
      sendEmail: true,
      emailContext: { message: `Vimos que você concluiu a atividade ${activityName} com uma nota abaixo do esperado. O EduJarvis preparou um material de reforço para você na plataforma.` }
    });
  }
}

export const notificationService = new NotificationService();
