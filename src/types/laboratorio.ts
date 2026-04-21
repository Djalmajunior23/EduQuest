// src/types/laboratorio.ts

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface LaboratorioPratico {
  id: string;
  tenantId: string;
  titulo: string;
  descricao: string;
  dificuldade: Difficulty;
  conhecimentosTecnicos: string[];
  capacidadesTecnicas: string[];
  templateCodigo?: string;
  checkpointsEsperados: string[];
  criadoPor: string;
}
