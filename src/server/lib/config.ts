import crypto from "crypto";

// Fallback JWT Secret for development/emergency
export const JWT_SECRET = process.env.JWT_SECRET || "edstudenthub-dev-secret-stable-123";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Database sanitization for Prisma
let rawDbUrl = process.env.DATABASE_URL;
if (rawDbUrl && rawDbUrl.startsWith('https://')) {
  console.warn("[PRISMA] Alerta: DATABASE_URL iniciando com https://. Convertendo para postgresql://");
  rawDbUrl = rawDbUrl.replace('https://', 'postgresql://');
}
export const DATABASE_URL = rawDbUrl;

// Email Configuration (Optional Envs)
export const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || "disabled";

export const emailConfig = {
  provider: EMAIL_PROVIDER,

  resend: {
    apiKey: process.env.RESEND_API_KEY || "",
    from: process.env.EMAIL_FROM || "EduQuest <noreply@edstudenthub.com>",
    replyTo: process.env.EMAIL_REPLY_TO || "suporte@edstudenthub.com",
  },

  brevo: {
    apiKey: process.env.BREVO_API_KEY || "",
  },

  smtp: {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
};

export function validateEmailConfig() {
  if (EMAIL_PROVIDER === "resend") {
    if (!emailConfig.resend.apiKey) {
      console.warn("[Email] RESEND_API_KEY ausente. E-mails desativados.");
      return false;
    }
    return true;
  }

  // Se o provedor não estiver configurado corretamente, desativamos silenciosamente
  console.info(`[Email] Provedor de e-mail '${EMAIL_PROVIDER}' configurado como desativado ou inválido.`);
  return false;
}

export const EMAIL_ENABLED = validateEmailConfig();

// IA Configuration
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

// Safe Mode Detection
export const SAFE_MODE = !DATABASE_URL || !GEMINI_API_KEY;

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const PORT = process.env.PORT || 3000;
