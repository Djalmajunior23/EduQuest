
import { Router } from 'express';
import { emailService } from '../../services/email/email.service';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { to, subject, html, text, template, context } = req.body;

    if (!to || !subject || (!html && !template)) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: to, subject, (html ou template)',
      });
    }

    const result = await emailService.sendEmail({
      to,
      subject,
      html,
      text,
      template,
      context
    });

    if (!result.success) {
      return res.status(500).json({ success: false, message: result.error });
    }

    return res.json({
      success: true,
      message: 'E-mail processado com sucesso.',
      messageId: result.messageId
    });
  } catch (error: any) {
    console.error('[EMAIL_ROUTE_ERROR]', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Erro ao processar envio de e-mail.',
    });
  }
});

export default router;
