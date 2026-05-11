import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { notificationService } from '../../services/notification.service';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

// Middleware de autenticação simplificado (deve ser refinado de acordo com o sistema existente)
router.use(authMiddleware);

// Listar notificações do usuário logado
router.get('/', async (req: any, res) => {
  try {
    const notifications = await notificationService.getNotifications(req.user.id);
    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Marcar como lida
router.patch('/:id/read', async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id);
    res.json(notification);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Marcar todas como lidas
router.patch('/read-all', async (req: any, res) => {
  try {
    await notificationService.markAllAsRead(req.user.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
