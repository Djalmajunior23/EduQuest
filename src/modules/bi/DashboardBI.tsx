import React from 'react';
import { MetricScorecard } from '../../components/analytics/MetricScorecard';

export const DashboardBI = () => {
  // Exemplo de como usar o componente após buscar dados do Firebase
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricScorecard 
        label="Desempenho Médio" 
        value="8.5" 
        trend="up" 
      />
      <MetricScorecard 
        label="Risco Pedagógico" 
        value="Baixo" 
        isRisk={false} 
      />
      <MetricScorecard 
        label="Engajamento Semanal" 
        value="78%" 
        trend="neutral" 
      />
    </div>
  );
};
