import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Trophy, 
  Target, 
  Zap, 
  BarChart3, 
  MessageSquare, 
  Settings,
  ChevronRight,
  Sparkles,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function ProfessorGamification() {
  const [activeSegment, setActiveSegment] = useState('turma');

  return (
    <div className="space-y-12 pb-20">
      {/* Dynamic Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
           <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">
              <Settings className="w-3 h-3" /> Gestão de Engajamento
           </div>
           <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">
              Painel Gamificado <span className="text-indigo-600">Pro</span>
           </h1>
           <p className="text-slate-500 font-medium">Monitore o desempenho e incentive sua turma com IA.</p>
        </div>
        <div className="flex bg-slate-100 p-2 rounded-2xl">
           <button 
             onClick={() => setActiveSegment('turma')}
             className={cn("px-6 py-2 rounded-xl text-xs font-black uppercase transition-all", activeSegment === 'turma' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500")}
           >
              Visão da Turma
           </button>
           <button 
             onClick={() => setActiveSegment('individual')}
             className={cn("px-6 py-2 rounded-xl text-xs font-black uppercase transition-all", activeSegment === 'individual' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500")}
           >
              Individual
           </button>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Engajamento Global', value: '88%', sub: '+12% esta semana', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
           { label: 'Missões Concluídas', value: '452', sub: 'Média 5.2/aluno', icon: Zap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
           { label: 'Boss Challenges', value: '18', sub: 'Aguardando validação', icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
           { label: 'Alertas de Evasão', value: '03', sub: 'Streak < 2 dias', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
         ].map((stat, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm flex flex-col items-center text-center"
           >
              <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-sm", stat.bg, stat.color)}>
                 <stat.icon className="w-8 h-8" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black italic text-slate-900">{stat.value}</p>
              <p className={cn("text-[10px] font-bold mt-2 uppercase", stat.color)}>{stat.sub}</p>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* Main Content */}
         <div className="lg:col-span-2 space-y-12">
            <section className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
               <div className="relative z-10 space-y-8">
                  <header className="flex justify-between items-center">
                     <h2 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-indigo-400" /> Insight da IA Pedagógica
                     </h2>
                     <button className="text-[10px] font-black uppercase text-indigo-400 tracking-widest border border-indigo-400/30 px-4 py-2 rounded-xl">Recalcular</button>
                  </header>
                  <p className="text-slate-400 leading-relaxed max-w-2xl">
                     Detectamos um padrão de queda no engajamento do módulo <span className="text-white italic">"Fundamentos de Cloud"</span>. 
                     Sugerimos lançar uma <span className="text-indigo-400 font-bold">Missão Relâmpago (XP x1.5)</span> hoje às 19h para reativar 85% da turma.
                  </p>
                  <div className="flex gap-4">
                     <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-500 transition-all">Aceitar Sugestão</button>
                     <button className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all">Modificar Parâmetros</button>
                  </div>
               </div>
               <Sparkles className="absolute top-0 right-0 w-64 h-64 text-indigo-600/10 -rotate-12 translate-x-12 -translate-y-12" />
            </section>

            <section className="space-y-6">
               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 px-4">
                  <Users className="w-4 h-4" /> Desempenho em Tempo Real
               </h3>
               {[
                 { nome: 'Ana Carolina', xp: 4500, progresso: 85, status: 'Líder', trend: 'up' },
                 { nome: 'Djalma Júnior', xp: 4200, progresso: 78, status: 'Em Ascensão', trend: 'up' },
                 { nome: 'Bruno Silva', xp: 3800, progresso: 70, status: 'Sólido', trend: 'stable' },
                 { nome: 'Carla Dias', xp: 3500, progresso: 65, status: 'Precisa Atenção', trend: 'down' },
               ].map((aluno, i) => (
                 <div key={i} className="bg-white border border-slate-200 p-6 rounded-[2rem] hover:border-indigo-300 transition-all group flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
                       <img src={`https://picsum.photos/seed/${i}/100/100`} alt="" />
                    </div>
                    <div className="flex-1">
                       <h4 className="font-black italic uppercase tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">{aluno.nome}</h4>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{aluno.status}</p>
                    </div>
                    <div className="w-48 hidden md:block">
                       <div className="flex justify-between text-[10px] font-black mb-1">
                          <span className="text-slate-400">Progresso</span>
                          <span className="text-indigo-600">{aluno.progresso}%</span>
                       </div>
                       <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className={cn("h-full transition-all", aluno.trend === 'up' ? 'bg-indigo-500' : aluno.trend === 'down' ? 'bg-red-500' : 'bg-slate-400')} style={{ width: `${aluno.progresso}%` }} />
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-lg font-black italic text-slate-900">{aluno.xp} XP</p>
                       <button className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1 flex items-center gap-1">Ver Dossier <ChevronRight className="w-3 h-3" /></button>
                    </div>
                 </div>
               ))}
               <button className="w-full py-4 border-2 border-dashed border-slate-200 text-slate-400 rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all">Carregar Mais Alunos</button>
            </section>
         </div>

         {/* Sidebar Actions */}
         <aside className="space-y-8">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 space-y-8">
               <h3 className="text-xs font-black uppercase tracking-tighter italic text-slate-900">Ações Rápidas</h3>
               <div className="space-y-4">
                  <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-indigo-50 text-indigo-600 group hover:bg-indigo-600 hover:text-white transition-all">
                     <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600">
                        <Zap className="w-5 h-5" />
                     </div>
                     <span className="font-black italic uppercase text-xs tracking-widest">Lançar Missão</span>
                  </button>
                  <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-amber-50 text-amber-600 group hover:bg-amber-600 hover:text-white transition-all">
                     <div className="p-3 bg-white rounded-xl shadow-sm text-amber-600">
                        <Trophy className="w-5 h-5" />
                     </div>
                     <span className="font-black italic uppercase text-xs tracking-widest">Premiar Turma</span>
                  </button>
                  <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-emerald-50 text-emerald-600 group hover:bg-emerald-600 hover:text-white transition-all">
                     <div className="p-3 bg-white rounded-xl shadow-sm text-emerald-600">
                        <MessageSquare className="w-5 h-5" />
                     </div>
                     <span className="font-black italic uppercase text-xs tracking-widest">Feedback Coletivo</span>
                  </button>
               </div>
            </div>

            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
               <div className="relative z-10">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 mb-2">Relatório Consolidado</h3>
                  <h4 className="text-2xl font-black italic uppercase tracking-tight mb-6">Média de Desempenho</h4>
                  <div className="flex items-end gap-2 mb-8">
                     <span className="text-5xl font-black italic">8.4</span>
                     <span className="text-indigo-200 font-bold mb-2">/ 10</span>
                  </div>
                  <div className="space-y-3">
                     {[
                       { label: 'Assiduidade', val: 95 },
                       { label: 'Participação', val: 78 },
                       { label: 'Acertos Técnicos', val: 82 },
                     ].map((item, i) => (
                       <div key={i} className="space-y-1">
                          <div className="flex justify-between text-[8px] font-black uppercase text-indigo-200">
                             <span>{item.label}</span>
                             <span>{item.val}%</span>
                          </div>
                          <div className="h-1 w-full bg-white/20 rounded-full">
                             <div className="h-full bg-white" style={{ width: `${item.val}%` }} />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
               <BarChart3 className="absolute bottom-0 right-0 w-32 h-32 opacity-10 translate-x-8 translate-y-8" />
            </div>
         </aside>
      </div>
    </div>
  );
}
