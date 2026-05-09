import { Router, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { AuthRequest, authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

// List all questions for the tenant
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ error: 'Tenant context missing' });

    // Since Questao belongs to Simulado, and Simulado belongs to Tenant
    const questoes = await prisma.questao.findMany({
      where: {
        simulado: {
          tenantId: tenantId
        }
      },
      include: {
        alternativas: true,
        simulado: true
      }
    });

    // Map to frontend expected names if necessary (or let frontend handle it)
    res.json({ success: true, data: questoes });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create question
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { enunciado, tipo, simuladoId, alternativas } = req.body;
    
    const questao = await prisma.questao.create({
      data: {
        enunciado,
        tipo,
        simuladoId,
        alternativas: {
          create: alternativas.map((a: any) => ({
            texto: a.texto,
            correta: a.correta
          }))
        }
      },
      include: { alternativas: true }
    });

    res.status(201).json({ success: true, data: questao });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete question
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.alternativa.deleteMany({ where: { questaoId: id } });
    await prisma.questao.delete({ where: { id } });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
