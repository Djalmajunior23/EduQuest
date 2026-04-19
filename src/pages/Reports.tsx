import React from 'react';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

export default function Reports() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">BI & Analytics</h1>
        <p className="text-slate-500 font-medium">Dashboard inteligente de indicadores e desempenho acadêmico.</p>
      </div>
      
      <AnalyticsDashboard />
    </div>
  );
}
