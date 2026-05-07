import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class CursoController {
  
  async list(req: AuthRequest, res: Response) {
    try {
      const tenantId = req.user?.tenantId;
      const cursos = await prisma.curso.findMany({
        where: { tenantId },
        include: { unidades: true }
      });
      return res.json(cursos);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao buscar cursos' });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const { nome, descricao } = req.body;
      const tenantId = req.user?.tenantId;

      if (!tenantId) return res.status(403).json({ error: 'Tenant context missing' });

      const curso = await prisma.curso.create({
        data: { nome, descricao, tenantId }
      });

      return res.status(201).json(curso);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao criar curso' });
    }
  }
}

export const cursoController = new CursoController();
