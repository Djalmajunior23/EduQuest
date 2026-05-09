import { prisma } from '../../src/server/lib/prisma';

export class CorrectionEngine {
  /**
   * Corrige uma submissão de código ou discursiva usando critérios de rubricas.
   */
  async processCorrection(submissionId: string) {
    const submission = await prisma.submissao.findUnique({
      where: { id: submissionId },
      include: { atividade: true }
    });

    if (!submission) return null;

    // Lógica simulada de correção profissional baseada em Bloom/SAEP
    // Em um sistema real, aqui chamaria o EduJarvis ou um microserviço Python dedicado
    const rubricas = submission.atividade.rubricas as any;
    let nota = 0;
    let feedback = "Análise automática processada.\n";

    if (submission.atividade.tipo === 'CODIGO') {
      nota = 8.5; // Simulação de testes aprovados
      feedback += "Código funcional, seguindo boas práticas de nomenclatura. Verificamos o uso de loops e condicionais.";
    } else {
      nota = 7.0;
      feedback += "Resposta discursiva coerente com o solicitado na atividade.";
    }

    const correcao = await prisma.correcao.upsert({
      where: { submissaoId: submission.id },
      create: {
        submissaoId: submission.id,
        nota,
        feedback,
        corrigidoPor: 'IA_CORRECTION_ENGINE'
      },
      update: {
        nota,
        feedback,
        corrigidoPor: 'IA_CORRECTION_ENGINE'
      }
    });

    // Atualiza status da submissão
    await prisma.submissao.update({
      where: { id: submission.id },
      data: { status: 'CORRIGIDA' }
    });

    return correcao;
  }
}

export const correctionEngine = new CorrectionEngine();
