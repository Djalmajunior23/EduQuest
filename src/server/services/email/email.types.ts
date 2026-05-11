export interface EmailOptions {
  to: string | string[];
  subject: string;
  template?: string;
  context?: Record<string, any>;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export interface EmailProvider {
  send(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

export type EmailTemplate = 
  | 'welcome'
  | 'password-reset'
  | 'new-activity'
  | 'simulado-available'
  | 'correction-feedback'
  | 'pedagogical-alert'
  | 'recovery-plan'
  | 'edujarvis-notification'
  | 'certificate'
  | 'badge-earned';
