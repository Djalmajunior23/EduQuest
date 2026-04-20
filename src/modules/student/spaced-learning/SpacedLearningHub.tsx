import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, Brain, Zap, Target, BookOpen, 
  ChevronRight, ArrowRight, Star, AlertCircle,
  TrendingUp, Activity, Sparkles, Clock
} from 'lucide-react';
import { collection, query, where, onSnapshot, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../lib/AuthContext';
import { cn } from '../../../lib/utils';

interface SpacedItem {
  id: string;
  title: string;
  category: string;
  nextReview: any;
  strength: number; // 0 to 100
}

export default function SpacedLearningHub() {
  const { profile } = useAuth();
  const [items, setItems] = useState<SpacedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation of Spaced Repetition (SRS) Engine
    setItems([]);
    setLoading(false);
  }, []);

  const todayReviews = items.filter(i => i.nextReview <= new Date());
  
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="bg-amber-500 p-4 rounded-3xl shadow-2xl shadow-amber-100">
            <History className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Revisão Espaçada</h1>
            <p className="text-slate-500 font-medium mt-2">Drible a curva do esquecimento com inteligência.</p>
          </div>
        </div>

        <div className="flex bg-white p-2 border border-slate-200 rounded-3xl items-center gap-6 px-6 shadow-sm">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-xs">
                {todayReviews.length}
             </div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revisões<br/>Hoje</span>
           </div>
           <div className="w-px h-8 bg-slate-100" />
           <div className="flex items-center gap-3">
             <Brain className="w-6 h-6 text-indigo-600" />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saúde da<br/>Memória: 84%</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Fixação Pendente</h2>
              <button className="text-xs font-black text-amber-600 uppercase tracking-widest hover:bg-amber-50 px-4 py-2 rounded-xl transition-all">
                Ver Todo o Banco
              </button>
           </div>

           <div className="grid gap-4">
              <AnimatePresence>
                {todayReviews.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white border border-slate-200 rounded-3xl p-6 flex items-center justify-between group hover:border-amber-200 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-6">
                       <div className="relative w-16 h-16">
                          <svg className="w-full h-full -rotate-90">
                            <circle cx="32" cy="32" r="28" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                            <circle cx="32" cy="32" r="28" fill="none" stroke="#f59e0b" strokeWidth="6" strokeDasharray={175} strokeDashoffset={175 - (175 * item.strength / 100)} strokeLinecap="round" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center font-black text-xs text-slate-400">
                             {item.strength}%
                          </div>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">{item.category}</p>
                          <h3 className="text-lg font-black text-slate-900 group-hover:text-amber-600 transition-colors uppercase tracking-tight leading-none">{item.title}</h3>
                          <div className="flex items-center gap-4 mt-2">
                             <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                               <Clock className="w-3 h-3" /> Revisar agora
                             </span>
                          </div>
                       </div>
                    </div>
                    <button className="p-4 bg-slate-50 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-all transform group-hover:scale-105">
                       <Zap className="w-5 h-5 fill-current" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-300">
              <div className="relative z-10">
                <Sparkles className="w-10 h-10 text-amber-400 mb-6" />
                <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-none mb-4">Meta Estudo</h3>
                <p className="text-slate-400 font-medium text-sm leading-relaxed mb-8">
                  Sua retenção em <strong className="text-white">Automação</strong> caiu 12% nos últimos 3 dias. A IA recomenda 15 minutos extras de revisão hoje.
                </p>
                <button className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform flex items-center justify-center gap-2">
                   Iniciar Sessão <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 blur-[80px]" />
           </div>

           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Eficiência Cognitiva</h3>
              <div className="space-y-6">
                 {[
                   { label: 'Retenção', val: 88, color: 'bg-emerald-500' },
                   { label: 'Consistência', val: 94, color: 'bg-indigo-500' },
                   { label: 'Engajamento', val: 62, color: 'bg-amber-500' }
                 ].map(stat => (
                   <div key={stat.label}>
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-xs font-bold text-slate-600">{stat.label}</span>
                         <span className="text-xs font-black text-slate-900">{stat.val}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.val}%` }}
                          className={cn("h-full", stat.color)}
                        />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
