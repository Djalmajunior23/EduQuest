import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { AuthRequest } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const simulados = await prisma.simulado.findMany({
      where: { tenantId: req.user?.tenantId },
      include: { questoes: { include: { alternativas: true } } }
    });
    res.json({ success: true, data: simulados });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const simulado = await prisma.simulado.findUnique({
        where: { id },
        include: { questoes: { include: { alternativas: true } } }
      });
      res.json({ success: true, data: simulado });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
