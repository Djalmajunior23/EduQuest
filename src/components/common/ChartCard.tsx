import React from 'react';

export function ChartCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 min-h-[320px]">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="w-full h-[260px] min-h-[260px]">
        {children}
      </div>
    </div>
  );
}
