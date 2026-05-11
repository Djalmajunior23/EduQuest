import { Router } from 'express';
import { emailService } from '../../services/email/email.service';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

// Apenas administradores deveriam acessar isso
router.post('/test', authMiddleware, async (req: any, res) => {
    if (req.user.perfil !== 'ADMIN') {
        return res.status(403).json({ error: 'Acesso negado' });
    }

    const { to, provider } = req.body;
    
    try {
        const result = await emailService.sendEmail({
            to,
            subject: 'Teste de Integração EduQuest Nexus',
            template: 'welcome',
            context: { name: 'Administrador (Teste)' }
        });

        res.json({ success: result.success, error: result.error });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
