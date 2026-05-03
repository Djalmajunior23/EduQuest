// src/services/edujarvis/BIService.ts
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export class BIService {
  private static EVENTS_COLLECTION = 'learning_events';

  /**
   * Obtém o desempenho consolidado de uma turma
   */
  public static async getClassPerformance(turmaId: string) {
    const q = query(
      collection(db, this.EVENTS_COLLECTION),
      where("turmaId", "==", turmaId),
      orderBy("timestamp", "desc"),
      limit(500)
    );

    const snapshot = await getDocs(q);
    const rows = snapshot.docs.map(doc => doc.data());

    if (rows.length === 0) return null;

    const total = rows.length;
    const acertos = rows.filter((r: any) => r.acertou).length;
    const taxaAcertoGeral = acertos / total;

    // Agrupamento por conteúdo
    const porConteudo: Record<string, { total: number; acertos: number }> = {};
    rows.forEach((row: any) => {
      if (!porConteudo[row.conteudo]) {
        porConteudo[row.conteudo] = { total: 0, acertos: 0 };
      }
      porConteudo[row.conteudo].total++;
      if (row.acertou) porConteudo[row.conteudo].acertos++;
    });

    const conteudosCriticos = Object.entries(porConteudo)
      .map(([conteudo, stats]) => ({
        conteudo,
        taxaAcerto: stats.acertos / stats.total,
        totalRespostas: stats.total
      }))
      .filter(item => item.taxaAcerto < 0.6)
      .sort((a, b) => a.taxaAcerto - b.taxaAcerto);

    return {
      totalInteracoes: total,
      taxaAcertoGeral: Number(taxaAcertoGeral.toFixed(2)),
      conteudosCriticos: conteudosCriticos.slice(0, 5)
    };
  }
}
