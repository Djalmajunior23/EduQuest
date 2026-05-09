import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { AuthRequest } from '../../middlewares/auth.middleware';
import bcrypt from 'bcrypt';

const router = Router();
const SALT_ROUNDS = 10;

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      where: { tenantId: req.user?.tenantId },
      include: { turma: true }
    });
    res.json({ success: true, data: usuarios });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { nome, email, senha, perfil, turmaId } = req.body;
    const tenantId = req.user?.tenantId;

    if (!nome || !email || !senha || !perfil) {
        return res.status(400).json({ success: false, error: 'Campos obrigatórios faltando' });
    }

    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ success: false, error: 'E-mail já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senhaHash,
        perfil,
        tenantId,
        turmaId: turmaId || null
      }
    });

    res.json({ success: true, data: usuario });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch('/:id/status', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { ativo } = req.body;
        
        const usuario = await prisma.usuario.update({
            where: { id },
            data: { ativo }
        });
        
        res.json({ success: true, data: usuario });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.patch('/:id/reset-password', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { novaSenha } = req.body;
        
        const senhaHash = await bcrypt.hash(novaSenha, SALT_ROUNDS);
        
        const usuario = await prisma.usuario.update({
            where: { id },
            data: { senhaHash, deveTrocarSenha: true }
        });
        
        res.json({ success: true, data: usuario });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { nome, perfil, turmaId, permissoes_granulares } = req.body;
        
        const usuario = await prisma.usuario.update({
            where: { id },
            data: { 
                nome, 
                perfil, 
                turmaId: turmaId || null,
                permissoes_granulares: permissoes_granulares || [] // Use empty array or null
            }
        });
        
        res.json({ success: true, data: usuario });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (id === req.user?.id) {
            return res.status(403).json({ success: false, error: 'Não é possível excluir o próprio usuário' });
        }
        
        await prisma.usuario.delete({ where: { id } });
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const usuario = await prisma.usuario.findUnique({
        where: { id },
        include: { turma: true, conquistas: { include: { badge: true } } }
      });
      res.json({ success: true, data: usuario });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
