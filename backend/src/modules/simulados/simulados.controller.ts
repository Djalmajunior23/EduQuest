import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class SimuladoController {
  
  async list(req: AuthRequest, res: Response) {
    try {
      const tenantId = req.user?.tenantId;
      const simulados = await prisma.simulado.findMany({
        where: { tenantId },
        include: { _count: { select: { questoes: true } } }
      });
      return res.json(simulados);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao buscar simulados' });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const simulado = await prisma.simulado.findUnique({
        where: { id },
        include: { questoes: { include: { alternativas: true } } }
      });
      if (!simulado) return res.status(404).json({ error: 'Simulado não encontrado' });
      return res.json(simulado);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao buscar simulado' });
    }
  }

  async create(req: AuthRequest, res: Response) {
     try {
       const { titulo, descricao, questoes } = req.body;
       const tenantId = req.user?.tenantId;

       if (!tenantId) return res.status(403).json({ error: 'Tenant missing' });

       const simulado = await prisma.simulado.create({
         data: {
           titulo,
           descricao,
           tenantId,
           questoes: {
             create: questoes?.map((q: any) => ({
               enunciado: q.enunciado,
               tipo: q.tipo || 'MULTIPLA_ESCOLHA',
               alternativas: {
                 create: q.alternativas?.map((a: any) => ({
                   texto: a.texto,
                   correta: a.correta
                 }))
               }
             }))
           }
         }
       });

       return res.status(201).json(simulado);
     } catch (err) {
       console.error(err);
       return res.status(500).json({ error: 'Erro ao criar simulado' });
     }
  }
}

export const simuladoController = new SimuladoController();
