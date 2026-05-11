import { prisma } from './prisma';

export async function logAuditoria(
  acao: string,
  entidade: string,
  entidadeId: string,
  usuarioId?: string,
  dadosAntigos: any = null,
  dadosNovos: any = null,
  ip?: string
) {
  try {
    await prisma.auditoriaLog.create({
      data: {
        acao,
        entidade,
        entidadeId,
        dadosAntigos: dadosAntigos ? JSON.parse(JSON.stringify(dadosAntigos)) : null,
        dadosNovos: dadosNovos ? JSON.parse(JSON.stringify(dadosNovos)) : null,
        usuarioId,
        ip
      }
    });
  } catch (error) {
    console.error('Erro ao registrar log de auditoria:', error);
  }
}
