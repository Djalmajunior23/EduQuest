import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class AtividadeController {
  
  async list(req: AuthRequest, res: Response) {
    try {
      const tenantId = req.user?.tenantId;
      const { cursoId, unidadeId } = req.query;

      const where: any = {};
      if (unidadeId) {
        where.unidadeCurricularId = unidadeId;
      } else if (cursoId) {
        where.unidadeCurricular = { cursoId };
      }

      // Filter by tenant via hierarchy
      where.unidadeCurricular = {
        ...where.unidadeCurricular,
        curso: { tenantId }
      };

      const atividades = await prisma.atividade.findMany({
        where,
        include: { unidadeCurricular: { include: { curso: true } } }
      });

      return res.json(atividades);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao buscar atividades' });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const { titulo, descricao, tipo, unidadeCurricularId, rubricas, casosTeste } = req.body;

      const atividade = await prisma.atividade.create({
        data: {
          titulo,
          descricao,
          tipo,
          unidadeCurricularId,
          rubricas: rubricas || {},
          casosTeste: casosTeste || {},
          status: 'PUBLICADA'
        }
      });

      return res.status(201).json(atividade);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao criar atividade' });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const atividade = await prisma.atividade.findUnique({
        where: { id },
        include: { 
          unidadeCurricular: { include: { curso: true } },
          submissoes: {
             where: { usuarioId: req.user?.id },
             orderBy: { createdAt: 'desc' },
             take: 1
          }
        }
      });

      if (!atividade) return res.status(404).json({ error: 'Atividade não encontrada' });

      return res.json(atividade);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao buscar atividade' });
    }
  }

  async submit(req: AuthRequest, res: Response) {
    try {
      const { id: atividadeId } = req.params;
      const usuarioId = req.user?.id;
      const { codigoFont, respostaDiscursiva, tempoGasto } = req.body;

      if (!usuarioId) return res.status(401).json({ error: 'Usuário não identificado' });

      const submissao = await prisma.submissao.create({
        data: {
          atividadeId,
          usuarioId,
          codigoFont,
          respostaDiscursiva,
          tempoGasto: tempoGasto ? Number(tempoGasto) : null,
          status: 'PENDENTE'
        }
      });

      return res.status(201).json(submissao);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao realizar submissão' });
    }
  }
}

export const atividadeController = new AtividadeController();
