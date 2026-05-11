import React from 'react';

export function MetricCard({ title, value }: { title: string, value: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-sm font-medium text-slate-500 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
