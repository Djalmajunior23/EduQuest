import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { logAuditoria } from '../../lib/auditoria';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { generatePlatformEmail } from '../../lib/emailUtils';
import bcrypt from 'bcrypt';

const router = Router();
const SALT_ROUNDS = 10;

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const search = String(req.query.search ?? "");
    const perfil = req.query.perfil ? String(req.query.perfil) : undefined;
    const status = req.query.status ? String(req.query.status) : undefined;

    const skip = (page - 1) * limit;

    const where: any = { 
      tenantId: req.user?.tenantId
    };

    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (perfil) {
      where.perfil = perfil;
    }

    if (status) {
      where.ativo = status === 'ATIVO';
    }

    const [usuarios, total] = await Promise.all([
      prisma.usuario.findMany({
        where,
        include: { turma: true },
        skip,
        take: limit,
        orderBy: { nome: 'asc' }
      }),
      prisma.usuario.count({ where })
    ]);

    res.json({ 
      success: true, 
      data: usuarios,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      } 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { nome, email, senha, perfil, turmaId, cursoId, deveTrocarSenha, ativo } = req.body;
    const tenantId = req.user?.tenantId;

    if (!nome || !email || !senha || !perfil) {
        return res.status(400).json({ success: false, error: 'Campos obrigatórios faltando' });
    }

    if (perfil.toUpperCase() === 'ADMIN' && req.user?.perfil !== 'ADMIN') {
        return res.status(403).json({ success: false, error: 'Apenas administradores podem cadastrar administradores' });
    }

    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ success: false, error: 'E-mail já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);
    const platform_email = await generatePlatformEmail(nome, perfil);

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senhaHash,
        perfil,
        tenantId,
        turmaId: turmaId || null,
        deveTrocarSenha: deveTrocarSenha ?? true,
        ativo: ativo ?? true,
        platform_email
      }
    });

    await logAuditoria('CRIACAO', 'Usuario', usuario.id, req.user?.id, null, { nome, email, perfil, tenantId, turmaId, ativo });

    const { senhaHash: _, ...userWithoutPassword } = usuario as any;
    res.json({ success: true, data: userWithoutPassword });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/import', async (req: AuthRequest, res: Response) => {
    try {
        const { csvContent } = req.body;
        const tenantId = req.user?.tenantId;
        
        const lines = csvContent.split('\n');
        const headers = lines[0].split(',').map((h: string) => h.trim().toLowerCase());
        
        let success = 0;
        let failed = 0;
        let errors: string[] = [];
        
        const rowsToProcess = lines.slice(1).filter((line: string) => line.trim() !== '');
        
        for (const [index, line] of rowsToProcess.entries()) {
            try {
                const values = line.split(',');
                const data: any = {};
                
                headers.forEach((header: string, i: number) => {
                    data[header] = values[i]?.trim();
                });
                
                if (!data.email || !data.nome || !data.senha) {
                    throw new Error('Campos nome, email e senha são obrigatórios');
                }
                
                const existingUser = await prisma.usuario.findUnique({ where: { email: data.email } });
                if (existingUser) {
                    throw new Error('E-mail já está em uso.');
                }
                
                const perfilValido = ['ADMIN', 'PROFESSOR', 'ALUNO', 'COORDENADOR', 'GESTOR', 'SUPORTE'].includes(data.perfil?.toUpperCase());
                
                const senhaHash = await bcrypt.hash(data.senha, SALT_ROUNDS);
                const platform_email = await generatePlatformEmail(data.nome, data.perfil || 'ALUNO');
                
                const user = await prisma.usuario.create({
                    data: {
                        nome: data.nome,
                        email: data.email,
                        senhaHash,
                        perfil: perfilValido ? data.perfil?.toUpperCase() : 'ALUNO',
                        tenantId,
                        platform_email
                    }
                });
                
                success++;
            } catch (error: any) {
                failed++;
                errors.push(`Linha ${index + 2}: ${error.message}`);
            }
        }
        
        res.json({ success: true, data: { total: rowsToProcess.length, success, failed, errors } });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.patch('/:id/status', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { ativo } = req.body;
        
        const oldUser = await prisma.usuario.findUnique({ where: { id } });
        const usuario = await prisma.usuario.update({
            where: { id },
            data: { ativo }
        });
        
        await logAuditoria('ALTERACAO_STATUS', 'Usuario', id, req.user?.id, { ativo: oldUser?.ativo }, { ativo });

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
        
        await logAuditoria('REDEFINICAO_SENHA', 'Usuario', id, req.user?.id, null, { deveTrocarSenha: true });

        res.json({ success: true, data: usuario });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { nome, perfil, turmaId, permissoes_granulares } = req.body;
        
        if (perfil?.toUpperCase() === 'ADMIN' && req.user?.perfil !== 'ADMIN') {
            return res.status(403).json({ success: false, error: 'Apenas administradores podem conceder perfil de administrador' });
        }
        
        const oldUser = await prisma.usuario.findUnique({ where: { id } });
        const usuario = await prisma.usuario.update({
            where: { id },
            data: { 
                nome, 
                perfil, 
                turmaId: turmaId || null,
                permissoes_granulares: permissoes_granulares || [] // Use empty array or null
            }
        });
        
        await logAuditoria('EDICAO', 'Usuario', id, req.user?.id, oldUser, { nome, perfil, turmaId, permissoes_granulares });

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
        
        const oldUser = await prisma.usuario.findUnique({ where: { id } });
        await prisma.usuario.delete({ where: { id } });
        
        await logAuditoria('EXCLUSAO', 'Usuario', id, req.user?.id, oldUser, null);

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

router.post('/migrate-emails', async (req: AuthRequest, res: Response) => {
    try {
        const users = await prisma.usuario.findMany({
            where: {
                OR: [
                    { platform_email: null },
                    { platform_email: '' }
                ]
            }
        });

        let updated = 0;
        for (const user of users) {
            const platform_email = await generatePlatformEmail(user.nome, user.perfil);
            await prisma.usuario.update({
                where: { id: user.id },
                data: { platform_email }
            });
            updated++;
        }

        res.json({ success: true, message: `${updated} usuários atualizados.` });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
