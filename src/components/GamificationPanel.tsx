import React from 'react';
import { Award, Zap, TrendingUp } from 'lucide-react';

interface GamificationPanelProps {
  xp: number;
  level: number;
  streak: number;
}

export function GamificationPanel({ xp, level, streak }: GamificationPanelProps) {
  const nextLevelXp = level * 1000;
  const progress = (xp / nextLevelXp) * 100;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
        <Award className="w-5 h-5 text-indigo-500" /> Progresso Acadêmico
      </h3>

      <div className="flex gap-4">
        <div className="flex-1 bg-slate-50 p-4 rounded-2xl">
          <p className="text-[10px] text-slate-500 uppercase font-bold">Nível</p>
          <p className="text-2xl font-black text-indigo-600">{level}</p>
        </div>
        <div className="flex-1 bg-slate-50 p-4 rounded-2xl">
          <p className="text-[10px] text-slate-500 uppercase font-bold">Streak</p>
          <p className="text-2xl font-black text-orange-500">{streak} dias</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-bold text-slate-500">
          <span>XP Atual</span>
          <span>{xp} / {nextLevelXp}</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
    </div>
  );
}
