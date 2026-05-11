import { notificationService } from './notification.service';
import { prisma } from '../lib/prisma';

// Observação: Este serviço é pensado para rodar no BACKEND ou como processo agendado.
// Como estamos em um ambiente híbrido, vou exportar a lógica que pode ser chamada por rotas ou workers.

export class SmartAlertEngine {
    /**
     * Analisa o desempenho de uma turma e envia alertas se necessário.
     */
    static async analyzeTurmaPerformance(turmaId: string, tenantId: string) {
        // 1. Buscar dados da turma e submissões recentes
        const turma = await prisma.turma.findUnique({
            where: { id: turmaId },
            include: { 
                usuarios: {
                    where: { perfil: 'ALUNO' },
                    include: { submissoes: { include: { correcao: true } } }
                }
            }
        });

        if (!turma) return;

        // 2. Lógica de detecção de baixo desempenho coletivo
        const allGrades = turma.usuarios.flatMap(u => u.submissoes.map(s => s.correcao?.nota).filter(n => n !== undefined)) as number[];
        const avgGrade = allGrades.length > 0 ? allGrades.reduce((a, b) => a + b, 0) / allGrades.length : 100;

        if (avgGrade < 60) {
            // Notificar professores da turma
            const professors = await prisma.usuario.findMany({
                where: { perfil: 'PROFESSOR', tenantId: tenantId } // Ajustar lógica se houver relação direta professor-turma
            });

            for (const professor of professors) {
                // A chamada real deve ser via API ou importação direta se estiver no mesmo processo
                // Usando importação direta aqui assumindo que este arquivo mora no /src/server/...
            }
        }
    }

    /**
     * Alerta de Evasão (Baseado em inatividade)
     */
    static async checkAbandonmentRisk(tenantId: string) {
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() - 15); // 15 dias sem login

        const atRiskUsers = await prisma.usuario.findMany({
            where: {
                tenantId,
                perfil: 'ALUNO',
                ativo: true,
                ultimoLoginEm: { lt: thresholdDate }
            }
        });

        // Para cada usuário em risco, enviar alerta para o coordenador/professor
        // e um e-mail de motivação para o aluno
    }
}
