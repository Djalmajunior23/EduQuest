import { Router, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { AuthRequest, authMiddleware } from '../../middlewares/auth.middleware';
import { z } from 'zod';

const router = Router();

router.use(authMiddleware);

const questaoSchema = z.object({
  enunciado: z.string().min(5, 'Enunciado muito curto'),
  tipo: z.string().default('MULTIPLA_ESCOLHA'),
  simuladoId: z.string().uuid('ID de simulado inválido'),
  alternativas: z.array(z.object({
    texto: z.string().min(1, 'Alternativa não pode ser vazia'),
    correta: z.boolean().default(false)
  })).min(2, 'Pelo menos duas alternativas são necessárias')
});

// List all questions for the tenant
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ error: 'Tenant context missing' });

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

    res.json({ success: true, data: questoes });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Erro ao listar questões' });
  }
});

// Create question with ownership check
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const validated = questaoSchema.parse(req.body);
    const tenantId = req.user?.tenantId;

    // Security check: Validate if simulado belongs to user's tenant
    const simulado = await prisma.simulado.findFirst({
      where: {
        id: validated.simuladoId,
        tenantId: tenantId
      }
    });

    if (!simulado) {
      return res.status(403).json({ success: false, error: 'Acesso negado: Simulado não pertence à sua instituição.' });
    }
    
    const questao = await prisma.questao.create({
      data: {
        enunciado: validated.enunciado,
        tipo: validated.tipo,
        simuladoId: validated.simuladoId,
        alternativas: {
          create: validated.alternativas.map((a: any) => ({
            texto: a.texto,
            correta: a.correta
          }))
        }
      },
      include: { alternativas: true }
    });

    res.status(201).json({ success: true, data: questao });
  } catch (error: any) {
    const msg = error instanceof z.ZodError ? error.issues[0].message : 'Erro ao criar questão';
    res.status(400).json({ success: false, error: msg });
  }
});

// Delete question with ownership check
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const tenantId = req.user?.tenantId;

    // Find question and check ownership via simulado
    const questao = await prisma.questao.findFirst({
      where: {
        id: id,
        simulado: {
          tenantId: tenantId
        }
      }
    });

    if (!questao) {
      return res.status(403).json({ success: false, error: 'Acesso negado ou questão inexistente.' });
    }

    await prisma.alternativa.deleteMany({ where: { questaoId: id } });
    await prisma.questao.delete({ where: { id } });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Erro ao excluir questão' });
  }
});

export default router;
