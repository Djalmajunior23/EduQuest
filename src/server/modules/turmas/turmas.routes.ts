import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { AuthRequest } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const turmas = await prisma.turma.findMany({
      where: { tenantId: req.user?.tenantId },
      include: { curso: true, usuarios: { where: { perfil: 'ALUNO' } } }
    });
    res.json({ success: true, data: turmas });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const turma = await prisma.turma.findUnique({
        where: { id },
        include: { 
            curso: { include: { disciplinas: { include: { unidades: { include: { atividades: true } } } } } },
            usuarios: true 
        }
      });
      res.json({ success: true, data: turma });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
