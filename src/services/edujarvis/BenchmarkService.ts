// src/services/edujarvis/BenchmarkService.ts

export interface BenchmarkItem {
  groupName: string;
  taxaAcerto: number;
  engajamento: number;
  riscoMedio: number;
}

export class BenchmarkService {
  /**
   * Compara o desempenho entre turmas ou unidades institucionais.
   */
  public static generateBenchmark(data: BenchmarkItem[]) {
    const sorted = [...data].sort((a, b) => b.taxaAcerto - a.taxaAcerto);

    return {
      melhoresResultados: sorted.slice(0, 3),
      gruposEmAtencao: sorted.filter((item) => item.taxaAcerto < 0.6),
      mediaGeral: data.reduce((sum, item) => sum + item.taxaAcerto, 0) / (data.length || 1),
      totalGrupos: data.length
    };
  }
}
