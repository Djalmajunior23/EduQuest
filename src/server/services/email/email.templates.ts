import { EmailTemplate } from './email.types';

export function getEmailTemplate(template: EmailTemplate, context: Record<string, any>): string {
  const primaryColor = '#6366f1'; // Indigo 600
  const footerText = '© 2026 EduQuest Enterprise AI. Todos os direitos reservados.';

  const baseLayout = (content: string) => `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .header { background: #4f46e5; padding: 40px; text-align: center; color: #ffffff; }
        .logo { font-size: 24px; font-weight: 800; font-style: italic; text-transform: uppercase; letter-spacing: -0.05em; margin: 0; }
        .content { padding: 40px; }
        .footer { padding: 20px 40px; background: #f1f5f9; text-align: center; font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; }
        .button { display: inline-block; padding: 14px 28px; background-color: ${primaryColor}; color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 24px; }
        h1 { font-size: 24px; font-weight: 900; font-style: italic; text-transform: uppercase; letter-spacing: -0.025em; color: #0f172a; margin-top: 0; }
        p { margin-bottom: 16px; color: #475569; }
        .highlight { color: ${primaryColor}; font-weight: 700; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">EduQuest Nexus</div>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          ${footerText}
        </div>
      </div>
    </body>
    </html>
  `;

  switch (template) {
    case 'welcome':
      return baseLayout(`
        <h1>Bem-vindo ao Nexus, ${context.name}!</h1>
        <p>Sua jornada educacional de próxima geração começa agora.</p>
        <p>Explore seus cursos, interaja com o <span class="highlight">EduJarvis</span> e conquiste badges exclusivos.</p>
        <a href="${context.loginUrl}" class="button">Acessar Plataforma</a>
      `);
    
    case 'password-reset':
      return baseLayout(`
        <h1>Recuperação de Senha</h1>
        <p>Recebemos uma solicitação para redefinir sua senha.</p>
        <p>Clique no botão abaixo para criar uma nova credencial. Este link expira em 1 hora.</p>
        <a href="${context.resetUrl}" class="button">Redefinir Senha</a>
        <p style="margin-top: 24px; font-size: 12px; color: #94a3b8;">Se você não solicitou isso, ignore este e-mail.</p>
      `);

    case 'pedagogical-alert':
      return baseLayout(`
        <h1>Alerta de Desempenho Nexus</h1>
        <p>Olá, Professor. O <span class="highlight">Agente Analytics</span> detectou um padrão crítico na turma <span class="highlight">${context.turmaName}</span>.</p>
        <p><strong>Insight:</strong> ${context.insight}</p>
        <p>Recomendamos uma intervenção pedagógica imediata.</p>
        <a href="${context.dashboardUrl}" class="button">Ver Dashboard BI</a>
      `);

    case 'badge-earned':
      return baseLayout(`
        <h1>Conquista Desbloqueada!</h1>
        <p>Parabéns, <span class="highlight">${context.name}</span>! Você acaba de conquistar a badge <span class="highlight">${context.badgeName}</span>.</p>
        <div style="text-align: center; margin: 30px 0;">
          <img src="${context.badgeIcon}" alt="${context.badgeName}" style="width: 100px; height: 100px;">
        </div>
        <p>Sua dedicação é o motor da sua evolução.</p>
        <a href="${context.profileUrl}" class="button">Ver meu Perfil</a>
      `);

    // Adicionar outros templates conforme necessário...
    default:
      return baseLayout(`
        <h1>Notificação EduQuest</h1>
        <p>${context.message || 'Você tem uma nova atualização na plataforma.'}</p>
        ${context.actionUrl ? `<a href="${context.actionUrl}" class="button">${context.actionLabel || 'Ver Detalhes'}</a>` : ''}
      `);
  }
}
