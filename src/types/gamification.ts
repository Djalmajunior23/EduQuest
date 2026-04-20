export interface GamificationState {
  userId: string;
  tenantId: string;
  cursoId: string; // XP é contabilizado por curso
  xp: number;
  level: number;
  streak: number;
  lastActivity: Date;
  badges: string[]; // IDs das Badges
}

export interface Badge {
  id: string;
  tenantId: string;
  nome: string;
  descricao: string;
  iconUrl: string;
  criteria: {
    tipo: 'xp' | 'streak' | 'atividade';
    valor: number;
  };
}
