import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class AtividadeController {
  
  async list(req: AuthRequest, res: Response) {
    try {
      const tenantId = req.user?.tenantId;
      if (!tenantId) {
        return res.status(401).json({ error: 'Sessão inválida: Identificador da instituição (tenant) não encontrado.' });
      }

      const { cursoId, unidadeId } = req.query;

      const where: any = {};
      if (unidadeId) {
        where.unidadeCurricularId = String(unidadeId);
      } else if (cursoId) {
        where.unidadeCurricular = { 
          disciplina: { 
            cursoId: String(cursoId) 
          } 
        };
      }

      // Filter by tenant via hierarchy to ensure security
      where.unidadeCurricular = {
        ...where.unidadeCurricular,
        disciplina: {
          curso: { tenantId }
        }
      };

      const atividades = await prisma.atividade.findMany({
        where,
        include: { 
          unidadeCurricular: { 
            include: { 
              disciplina: {
                include: {
                  curso: true
                }
              }
            } 
          } 
        },
        orderBy: { createdAt: 'desc' }
      });

      return res.json(atividades);
    } catch (err) {
      console.error('[AtividadeController.list]', err);
      return res.status(500).json({ 
        error: 'Ocorreu um erro interno ao processar a lista de atividades.',
        message: process.env.NODE_ENV === 'development' ? String(err) : 'Entre em contato com o suporte técnico.'
      });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const { titulo, descricao, tipo, unidadeCurricularId, rubricas, casosTeste } = req.body;

      if (!titulo || !tipo || !unidadeCurricularId) {
        return res.status(400).json({ error: 'Dados insuficientes: Os campos titulo, tipo e unidadeCurricularId são obrigatórios.' });
      }

      // Validate if unit belongs to a course owned by the same tenant (security check)
      const unit = await prisma.unidadeCurricular.findUnique({
        where: { id: unidadeCurricularId },
        include: { 
          disciplina: {
            include: {
              curso: true
            }
          }
        }
      });

      if (!unit) {
        return res.status(404).json({ error: `Unidade Curricular com ID ${unidadeCurricularId} não foi encontrada.` });
      }

      if (unit.disciplina.curso.tenantId !== req.user?.tenantId) {
        return res.status(403).json({ error: 'Permissão negada: Você não pode criar atividades para uma unidade de outra instituição.' });
      }

      // Optional: Check if user has permission to create (Admin/Professor/Gestor)
      const allowedProfiles = ['ADMIN', 'PROFESSOR', 'GESTOR', 'COORDENADOR'];
      if (!req.user?.perfil || !allowedProfiles.includes(req.user.perfil)) {
        return res.status(403).json({ error: 'Permissão negada: Seu perfil não possui autorização para criar atividades.' });
      }

      const atividade = await prisma.atividade.create({
        data: {
          titulo,
          descricao: descricao || '',
          tipo,
          unidadeCurricularId,
          rubricas: rubricas || {},
          casosTeste: casosTeste || {},
          status: 'PUBLICADA'
        }
      });

      return res.status(201).json(atividade);
    } catch (err) {
      console.error('[AtividadeController.create]', err);
      return res.status(500).json({ 
        error: 'Falha ao registrar a nova atividade.',
        message: 'Certifique-se de que todos os dados estão no formato correto.'
      });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: 'Parâmetro inválido: ID da atividade é necessário.' });

      const atividade = await prisma.atividade.findUnique({
        where: { id },
        include: { 
          unidadeCurricular: { 
            include: { 
              disciplina: {
                include: {
                  curso: true
                }
              }
            } 
          },
          submissoes: {
             where: { usuarioId: req.user?.id },
             orderBy: { createdAt: 'desc' },
             take: 1
          }
        }
      });

      if (!atividade) {
        return res.status(404).json({ error: 'Recurso não encontrado: A atividade solicitada não existe no sistema.' });
      }

      // Security check: check if activity belongs to user's tenant
      if (atividade.unidadeCurricular.disciplina.curso.tenantId !== req.user?.tenantId) {
        return res.status(403).json({ error: 'Acesso restrito: Esta atividade pertence a outra instituição e não pode ser visualizada.' });
      }

      return res.json(atividade);
    } catch (err) {
      console.error('[AtividadeController.getById]', err);
      return res.status(500).json({ error: 'Erro ao recuperar os detalhes da atividade.' });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { titulo, descricao, tipo, status, rubricas, casosTeste } = req.body;

      const atividade = await prisma.atividade.findUnique({
        where: { id },
        include: { 
          unidadeCurricular: { 
            include: { 
              disciplina: { include: { curso: true } }
            } 
          }
        }
      });

      if (!atividade) {
        return res.status(404).json({ error: 'Atividade não encontrada para atualização.' });
      }

      if (atividade.unidadeCurricular.disciplina.curso.tenantId !== req.user?.tenantId) {
        return res.status(403).json({ error: 'Acesso negado: Você não tem permissão para alterar esta atividade.' });
      }

      const allowedProfiles = ['ADMIN', 'PROFESSOR', 'GESTOR', 'COORDENADOR'];
      if (!req.user?.perfil || !allowedProfiles.includes(req.user.perfil)) {
        return res.status(403).json({ error: 'Permissão negada: Seu perfil não possui autorização para editar atividades.' });
      }

      const updatedAtividade = await prisma.atividade.update({
        where: { id },
        data: {
          titulo,
          descricao,
          tipo,
          status,
          rubricas,
          casosTeste
        }
      });

      return res.json(updatedAtividade);
    } catch (err) {
      console.error('[AtividadeController.update]', err);
      return res.status(500).json({ error: 'Falha interna ao tentar atualizar a atividade.' });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const atividade = await prisma.atividade.findUnique({
        where: { id },
        include: { 
          unidadeCurricular: { 
            include: { 
              disciplina: { include: { curso: true } }
            } 
          }
        }
      });

      if (!atividade) {
        return res.status(404).json({ error: 'Atividade não encontrada ou já foi removida.' });
      }

      if (atividade.unidadeCurricular.disciplina.curso.tenantId !== req.user?.tenantId) {
        return res.status(403).json({ error: 'Acesso negado: Tentativa de remoção de recurso não pertencente à sua instituição.' });
      }

      const allowedProfiles = ['ADMIN', 'GESTOR', 'COORDENADOR'];
      if (!req.user?.perfil || !allowedProfiles.includes(req.user.perfil)) {
        return res.status(403).json({ error: 'Permissão insuficiente: Apenas gestores podem remover atividades.' });
      }

      await prisma.atividade.delete({ where: { id } });

      return res.status(204).send();
    } catch (err) {
      console.error('[AtividadeController.delete]', err);
      return res.status(500).json({ error: 'Erro catastrófico ao tentar excluir a atividade. Verifique dependências.' });
    }
  }

  async submit(req: AuthRequest, res: Response) {
    try {
      const { id: atividadeId } = req.params;
      const usuarioId = req.user?.id;
      const { codigoFont, respostaDiscursiva, tempoGasto } = req.body;

      if (!usuarioId) return res.status(401).json({ error: 'Identificação necessária: Sua sessão expirou.' });

      const atividade = await prisma.atividade.findUnique({
        where: { id: atividadeId },
        include: { 
          unidadeCurricular: { 
            include: { 
              disciplina: {
                include: {
                  curso: true
                }
              }
            } 
          } 
        }
      });

      if (!atividade) {
        return res.status(404).json({ error: 'Atividade inexistente: A atividade para submissão não foi localizada.' });
      }

      // Verify tenant
      if (atividade.unidadeCurricular.disciplina.curso.tenantId !== req.user?.tenantId) {
        return res.status(403).json({ error: 'Operação ilegal: Tentativa de submissão em atividade de outra instituição.' });
      }

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
      console.error('[AtividadeController.submit]', err);
      return res.status(500).json({ error: 'Erro ao processar a entrega da atividade. Tente novamente mais tarde.' });
    }
  }
}

export const atividadeController = new AtividadeController();
