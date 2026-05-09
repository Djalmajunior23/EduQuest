import { Router } from 'express';
import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { AuthRequest } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const cursos = await prisma.curso.findMany({
      where: { tenantId: req.user?.tenantId },
      include: { disciplinas: true }
    });
    res.json({ success: true, data: cursos });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { nome, descricao } = req.body;
    const curso = await prisma.curso.create({
      data: {
        nome,
        descricao,
        tenantId: req.user?.tenantId!
      }
    });
    res.status(201).json({ success: true, data: curso });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
