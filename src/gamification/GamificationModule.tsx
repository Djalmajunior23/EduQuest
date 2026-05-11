import React from 'react';
import { 
  Trophy, Star, Zap, Flame, Shield, 
  ChevronRight, Award, Target, Gamepad2, Sparkles,
  Lock, CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MISSIONS = [
  { id: 1, title: 'Lógica Imbatível', desc: 'Resolva 5 desafios de loops sem erros.', xp: 250, progress: 60, icon: Zap, color: 'text-amber-500' },
  { id: 2, title: 'Mestre do SQL', desc: 'Realize um JOIN triplo em menos de 10 min.', xp: 500, progress: 0, icon: Shield, color: 'text-indigo-500' },
  { id: 3, title: 'Code Reviewer', desc: 'Comente em 3 projetos de colegas.', xp: 150, progress: 100, icon: Target, color: 'text-emerald-500' },
];

const REWARDS = [
  { name: 'Alpha Coder', id: 'badge-1', icon: Award, locked: false },
  { name: 'Bug Hunter', id: 'badge-2', icon: Shield, locked: false },
  { name: 'Nexus Expert', id: 'badge-3', icon: Star, locked: true },
];

export const GamificationModule = () => {
    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Gamepad2 className="text-indigo-600 w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Gamification Engine 4.0</span>
                    </div>
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Arena de <span className="text-indigo-600">Conquistas</span></h2>
                </div>

                <div className="flex items-center gap-8 bg-white px-8 py-4 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50">
                    <div className="text-center">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Seu Nível</p>
                        <p className="text-2xl font-black italic tracking-tighter text-slate-900">LVL 24</p>
                    </div>
                    <div className="w-px h-10 bg-slate-100" />
                    <div className="text-center">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Total XP</p>
                        <p className="text-2xl font-black italic tracking-tighter text-indigo-600">12,450</p>
                    </div>
                    <div className="w-px h-10 bg-slate-100" />
                    <div className="text-center">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Streak</p>
                        <div className="flex items-center gap-1">
                            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                            <p className="text-2xl font-black italic tracking-tighter text-slate-900">12 dias</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Season Pass / Progress */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform">
                            <Trophy className="w-64 h-64" />
                        </div>
                        
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8">Season 01: <span className="text-indigo-400">Cyber Genesis</span></h3>
                            
                            <div className="space-y-6">
                                <div className="flex justify-between items-end">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progresso da Temporada</p>
                                    <p className="text-xl font-black italic tracking-tighter">74%</p>
                                </div>
                                <div className="h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/10">
                                    <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full w-[74%] shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    <span>Início: 12 Mai</span>
                                    <span>Fim: 28 Jun</span>
                                </div>
                            </div>

                            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {[10, 15, 20, 25].map(lvl => (
                                    <div key={lvl} className={cn(
                                        "p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all",
                                        lvl <= 24 ? "bg-white/10 border-indigo-500/50" : "bg-white/5 border-white/5 opacity-50"
                                    )}>
                                        <p className="text-[10px] font-black uppercase text-slate-400">LVL {lvl}</p>
                                        <Award className={cn("w-8 h-8", lvl <= 24 ? "text-indigo-400" : "text-slate-600")} />
                                        {lvl <= 24 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-slate-700" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {MISSIONS.map(m => (
                            <div key={m.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-100/50 hover:border-indigo-100 transition-all group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={cn("p-3 rounded-2xl bg-opacity-10", m.color.replace('text-', 'bg-'))}>
                                        <m.icon className={cn("w-6 h-6", m.color)} />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Recompensa</p>
                                        <p className="text-sm font-black italic text-emerald-600">+{m.xp} XP</p>
                                    </div>
                                </div>
                                <h4 className="font-black italic uppercase tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">{m.title}</h4>
                                <p className="text-xs text-slate-500 mt-1 mb-6 font-medium">{m.desc}</p>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                                        <span>Progresso</span>
                                        <span>{m.progress}%</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${m.progress}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Badges & Rankings */}
                <div className="lg:col-span-4 space-y-8">
                    <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50">
                        <h3 className="text-sm font-black italic uppercase tracking-tighter text-slate-900 mb-8 flex items-center gap-2">
                            <Star className="text-amber-500 fill-amber-500 w-4 h-4" />
                            Suas Badges
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            {REWARDS.map(r => (
                                <div key={r.id} className="flex flex-col items-center gap-2 group cursor-pointer">
                                    <div className={cn(
                                        "w-16 h-16 rounded-full flex items-center justify-center transition-all group-hover:scale-110 shadow-lg",
                                        r.locked ? "bg-slate-100 grayscale border-2 border-dashed border-slate-200" : "bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-indigo-100"
                                    )}>
                                        {r.locked ? <Lock className="w-6 h-6 text-slate-300" /> : <r.icon className="w-8 h-8" />}
                                    </div>
                                    <span className={cn("text-[9px] font-black uppercase tracking-widest text-center", r.locked ? "text-slate-300" : "text-slate-600")}>{r.name}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50">
                        <h3 className="text-sm font-black italic uppercase tracking-tighter text-slate-900 mb-8 flex items-center gap-2">
                            <Trophy className="text-amber-500 w-4 h-4" />
                            Top Learner Ligas
                        </h3>
                        <div className="space-y-4">
                            {[
                                { name: 'Djalma B.', xp: '24.5k', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Djalma', pos: 1 },
                                { name: 'Ana Costa', xp: '22.1k', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana', pos: 2 },
                                { name: 'Carlos Edu', xp: '19.8k', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos', pos: 3 },
                            ].map(u => (
                                <div key={u.name} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <img src={u.img} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="avatar" />
                                            <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">
                                                {u.pos}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase text-slate-900">{u.name}</p>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500">{u.xp} XP</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-4 mt-6 border-2 border-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-indigo-100 hover:text-indigo-600 transition-all">
                            Ver Leaderboard Completo
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
};
