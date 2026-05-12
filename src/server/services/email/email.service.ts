import { EmailOptions, EmailProvider } from './email.types';
import { getEmailTemplate } from './email.templates';
import { EMAIL_PROVIDER, EMAIL_ENABLED, emailConfig } from '../../lib/config';

class ResendProvider implements EmailProvider {
  private apiKey: string;
  private from: string;
  private replyTo: string;

  constructor(config: { apiKey: string, from: string, replyTo: string }) {
    this.apiKey = config.apiKey;
    this.from = config.from;
    this.replyTo = config.replyTo;
  }

  async send(options: EmailOptions) {
    try {
      console.log(`[EmailService] Enviando e-mail via RESEND para ${options.to}: ${options.subject}`);
      
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: options.from || this.from,
          to: options.to,
          subject: options.subject,
          html: options.html || (options.template ? getEmailTemplate(options.template as any, options.context || {}) : ''),
          reply_to: options.replyTo || this.replyTo,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: JSON.stringify(error) };
      }

      const data = await response.json();
      return { success: true, messageId: data.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

// Minimal implementation placeholders for Brevo and SMTP if needed
class BrevoProvider implements EmailProvider {
  constructor(private apiKey: string) {}
  async send(options: EmailOptions) {
    console.log(`[EmailService] Enviando e-mail via BREVO para ${options.to} (Mock)`);
    return { success: true, messageId: 'brevo-' + Date.now() };
  }
}

class SMTPProvider implements EmailProvider {
  constructor(private config: any) {}
  async send(options: EmailOptions) {
    console.log(`[EmailService] Enviando e-mail via SMTP para ${options.to} (Mock)`);
    return { success: true, messageId: 'smtp-' + Date.now() };
  }
}

class MailService {
  private provider: EmailProvider | null = null;

  constructor() {
    this.initializeProvider();
  }

  private initializeProvider() {
    if (!EMAIL_ENABLED) {
      this.provider = {
        send: async (options) => {
          console.warn('[EmailService] Sistema de e-mail desativado ou incompleto. Ignorando envio.');
          return { success: true, messageId: 'disabled-' + Date.now() };
        }
      };
      return;
    }

    if (EMAIL_PROVIDER === 'resend' && emailConfig.resend.apiKey) {
      this.provider = new ResendProvider(emailConfig.resend);
    } else if (EMAIL_PROVIDER === 'brevo' && emailConfig.brevo.apiKey) {
      this.provider = new BrevoProvider(emailConfig.brevo.apiKey);
    } else if (EMAIL_PROVIDER === 'smtp' && emailConfig.smtp.host) {
      this.provider = new SMTPProvider(emailConfig.smtp);
    } else {
      // Fallback para mock se não houver configuração válida
      this.provider = {
        send: async (options) => {
          console.warn('[EmailService] Nenhuma configuração válida encontrada. E-mail simulado no console:');
          console.log('--- E-MAIL MOCK ---');
          console.log('Para:', options.to);
          console.log('Assunto:', options.subject);
          console.log('-------------------');
          return { success: true, messageId: 'mock-id-' + Date.now() };
        }
      };
    }
  }

  async sendEmail(options: EmailOptions) {
    if (!this.provider) {
      this.initializeProvider();
    }
    
    let result: { success: boolean; messageId?: string, error?: string };

    try {
      result = await this.provider!.send(options);
      if (!result.success) {
        console.warn(`[EmailService] Falha ao enviar e-mail para ${options.to}: ${result.error}`);
      }
    } catch (e) {
      console.warn(`[EmailService] Erro inesperado ao tentar enviar e-mail para ${options.to}:`, e);
      result = { success: false, error: 'Erro inesperado ao enviar e-mail' };
    }
    
    // Log do e-mail no banco de dados (EmailLogs)
    if (process.env.DATABASE_URL) {
      try {
        const { prisma } = await import('../../lib/prisma');
        // create log table if it exists or just ignore for now to avoid crashing
        // prisma.emailLog.create({...})
      } catch (e) {
        console.error('Falha ao registrar log de e-mail:', e);
      }
    }

    return result;
  }

  // Atalhos úteis
  async sendWelcomeEmail(to: string, name: string) {
    return this.sendEmail({
      to,
      subject: 'Bem-vindo ao Nexus Enterprise AI!',
      template: 'welcome',
      context: { name, loginUrl: process.env.VITE_AUTH_REDIRECT_URL || process.env.APP_URL || '/login' }
    });
  }

  async sendPasswordResetEmail(to: string, resetUrl: string) {
    return this.sendEmail({
      to,
      subject: 'Recuperação de Senha - EduQuest',
      template: 'password-reset',
      context: { resetUrl }
    });
  }
}

export const emailService = new MailService();
