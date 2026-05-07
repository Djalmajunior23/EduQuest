import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class TurmaController {
  
  async list(req: AuthRequest, res: Response) {
    try {
      const tenantId = req.user?.tenantId;
      if (!tenantId) return res.status(403).json({ error: 'Tenant context missing' });

      const turmas = await prisma.turma.findMany({
        where: { tenantId },
        include: { curso: true, _count: { select: { usuarios: true } } }
      });

      return res.json(turmas);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao buscar turmas' });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const tenantId = req.user?.tenantId;
      if (!tenantId) return res.status(403).json({ error: 'Tenant context missing' });

      const { nome, anoLetivo, cursoId, semestre } = req.body;

      if (!nome || !anoLetivo || !cursoId) {
        return res.status(400).json({ error: 'Campos obrigatórios: nome, anoLetivo, cursoId' });
      }

      const turma = await prisma.turma.create({
        data: {
          nome,
          anoLetivo: Number(anoLetivo),
          semestre: semestre ? Number(semestre) : null,
          cursoId,
          tenantId
        }
      });

      return res.status(201).json(turma);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao criar turma' });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const tenantId = req.user?.tenantId;

      const turma = await prisma.turma.findFirst({
        where: { id, tenantId },
        include: { curso: true, usuarios: { select: { id: true, nome: true, email: true, perfil: true } } }
      });

      if (!turma) return res.status(404).json({ error: 'Turma não encontrada' });

      return res.json(turma);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao buscar detalhes da turma' });
    }
  }
}

export const turmaController = new TurmaController();
