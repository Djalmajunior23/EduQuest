import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface MetricProps {
  label: string;
  value: number | string;
  trend?: 'up' | 'down' | 'neutral';
  isRisk?: boolean;
}

export const MetricScorecard: React.FC<MetricProps> = ({ label, value, trend, isRisk }) => {
  return (
    <div className={`p-4 rounded-lg border ${isRisk ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'} shadow-sm`}>
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-slate-500">{label}</h3>
        {isRisk && <AlertTriangle className="text-red-500" size={16} />}
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        {trend === 'up' && <TrendingUp className="text-green-500" size={16} />}
        {trend === 'down' && <TrendingDown className="text-red-500" size={16} />}
      </div>
    </div>
  );
};
