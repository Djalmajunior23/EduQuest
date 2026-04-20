import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, Zap, Flame, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';

interface GamificationStatsProps {
  stats: {
    level: number;
    currentXp: number;
    maxXp: number;
    points: number;
    streak: number;
    rank: number;
  };
}

export function StudentGamificationHeader({ stats }: GamificationStatsProps) {
  const xpProgress = (stats.currentXp / stats.maxXp) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Nível e XP */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-1 md:col-span-2 bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl"
      >
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Status do Operador</span>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter mt-2">Nível {stats.level}</h2>
            </div>
            <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md">
              <Shield className="w-8 h-8 text-indigo-400" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">XP: {stats.currentXp} / {stats.maxXp}</span>
              <span className="text-sm font-black italic text-indigo-400">Próxima Evolução: {Math.round(100 - xpProgress)}%</span>
            </div>
            <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                className="h-full bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-400 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.5)]"
              />
            </div>
          </div>
        </div>
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid grid-rows-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-amber-50 border border-amber-200 rounded-[2rem] p-6 flex items-center gap-6 shadow-sm"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-200">
            <Star className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Saldo de Tokens</p>
            <p className="text-3xl font-black italic text-slate-900">{stats.points}</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-emerald-50 border border-emerald-200 rounded-[2rem] p-6 flex items-center gap-6 shadow-sm"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200 relative">
            <Flame className="w-8 h-8" />
            <span className="absolute -top-2 -right-2 bg-emerald-900 text-[10px] font-black text-white px-2 py-0.5 rounded-full ring-2 ring-emerald-50">
              {stats.streak}d
            </span>
          </div>
          <div>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Ofício Diário</p>
            <p className="text-3xl font-black italic text-slate-900">Streak Ativo</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function MissionList({ missions }: { missions: any[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Ordens de Serviço Ativas</h3>
      {missions.map((mission, idx) => (
        <motion.div 
          key={mission.id} 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white border border-slate-200 p-6 rounded-[1.5rem] hover:border-indigo-400 transition-all cursor-pointer group shadow-sm hover:shadow-xl"
        >
          <div className="flex items-center gap-6">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
              mission.completed ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 shadow-sm"
            )}>
              {mission.type === 'DIARIA' ? <Zap className="w-6 h-6" /> : <Trophy className="w-6 h-6" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-slate-100 text-[8px] font-black px-2 py-1 rounded text-slate-500 uppercase tracking-widest">{mission.type}</span>
                <span className="text-[10px] font-bold text-amber-600">+{mission.xp} XP</span>
              </div>
              <h4 className="font-black italic uppercase tracking-tight text-slate-900">{mission.title}</h4>
            </div>
            <div className="text-right">
              {mission.completed ? (
                <span className="text-[10px] font-black text-emerald-500 uppercase">Concluída</span>
              ) : (
                <button className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-indigo-600 transition-colors shadow-lg active:scale-95">Iniciar</button>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function RankingBoard({ rankings }: { rankings: any[] }) {
  return (
    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 px-2 text-center">Top 10: Arena de Elite</h3>
      <div className="space-y-2">
        {rankings.map((rank, idx) => (
          <div 
            key={rank.alunoId} 
            className={cn(
              "flex items-center gap-4 p-4 rounded-2xl transition-all",
              idx === 0 ? "bg-amber-50/50 border border-amber-100" : "hover:bg-slate-50"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center font-black italic text-xl",
              idx === 0 ? "text-amber-500 bg-white shadow-md" : 
              idx === 1 ? "text-slate-400" : 
              idx === 2 ? "text-amber-700" : "text-slate-300"
            )}>
              {idx + 1}
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white">
              <img src={rank.avatarUrl || `https://picsum.photos/seed/${rank.alunoId}/100/100`} alt="" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1">
              <p className="font-black italic uppercase tracking-tight text-slate-900 text-sm leading-none">{rank.nome}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Level {rank.level}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-black italic text-blue-600 leading-none">{rank.xpTotal.toLocaleString()} XP</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
