import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../lib/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BrainCircuit, ShieldAlert, Sparkles, AlertTriangle, TrendingUp, TrendingDown,
  User, CheckCircle2, ChevronRight, XOctagon, Loader2
} from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../../../lib/utils';

export default function ProfessorInsights() {
  const { user } = useAuth();
  const [alertas, setAlertas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // MOCK dados globais da turma para visualização tática que seriam trazidos por uma Cloud Function/n8n
  const classTrend = [
    { name: 'S1', performance: 65, engajamento: 80 },
    { name: 'S2', performance: 70, engajamento: 82 },
    { name: 'S3', performance: 68, engajamento: 75 },
    { name: 'S4', performance: 72, engajamento: 79 },
    { name: 'S5', performance: 78, engajamento: 85 },
    { name: 'S6', performance: 85, engajamento: 90 },
  ];

  useEffect(() => {
    if (!user) return;

    // Escuta os alertas injetados pelo Motor Inteligente
    const q = query(
      collection(db, 'alertas_pedagogicos'),
      where('targetProfessorId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      if(!snap.empty) {
         setAlertas(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } else {
         // Sem alertas reais do motor no momento
         setAlertas([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
     return (
        <div className="flex items-center justify-center h-full text-indigo-400 gap-3">
           <Loader2 className="w-6 h-6 animate-spin" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sincronizando Motor Neural...</span>
        </div>
     );
  }

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 border border-indigo-100">
             <BrainCircuit className="w-3 h-3" />
             Ativo • Processamento Tático
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
            Insights do Motor
          </h1>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl">
            A IA analisou os logs de estudo, simulados e interações com o bot para classificar o momento de cada aluno da sua turma.
          </p>
        </div>
      </header>

      {/* DASHBOARDS SECUNDÁRIOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Gráfico Tendência de Turma */}
         <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
             <div className="flex justify-between items-center mb-8">
                <div>
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Classificação Preditiva da Turma</h3>
                   <p className="text-2xl font-black text-slate-900 mt-1">Evolução de Engajamento</p>
                </div>
                <div className="text-right">
                   <p className="text-emerald-500 font-black text-xl flex items-center gap-1 justify-end"><TrendingUp className="w-5 h-5"/> 85%</p>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Média Global</p>
                </div>
             </div>

             <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={classTrend} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                     <defs>
                       <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <Tooltip 
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 900 }}
                     />
                     <Area type="monotone" dataKey="performance" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorPerf)" />
                     <Area type="monotone" dataKey="engajamento" stroke="#f43f5e" strokeDasharray="5 5" strokeWidth={2} fill="transparent" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
         </div>

         {/* Painel Tático Rápido */}
         <div className="bg-slate-900 rounded-[2rem] p-8 shadow-xl shadow-indigo-900/10 text-white relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute -right-8 -top-8 bg-indigo-500/20 w-40 h-40 rounded-full blur-3xl group-hover:bg-indigo-500/40 transition-colors" />
            
            <div className="relative z-10">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-6 flex items-center gap-2">
                 <Sparkles className="w-4 h-4" /> Resumo Preditivo IA
               </h3>
               
               <div className="space-y-6">
                  <div>
                    <p className="text-3xl font-black italic tracking-tighter">03</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Alunos em Alerta Vermelho</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black italic tracking-tighter text-emerald-400">12</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Classificados "Avançado"</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black italic tracking-tighter text-indigo-400">01</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Sugestão de Trilha Nova</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* FEED DE ALERTAS (ACIONÁVEL) */}
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 pt-4">Central de Intervenção Pedagógica (Em tempo real)</h3>
      
      <div className="grid grid-cols-1 gap-4">
         <AnimatePresence>
            {alertas.length === 0 ? (
               <div className="p-12 text-center border-2 border-dashed border-slate-100 rounded-[2rem] text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                  Nenhum aviso neural detectado pelo motor tático.
               </div>
            ) : alertas.map((alerta, i) => (
                <motion.div
                   key={alerta.id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className={cn(
                      "rounded-[2rem] p-6 border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden hover:-translate-y-1 transition-transform",
                      alerta.severidade === 'VERMELHA' ? "bg-red-50 border-red-100" :
                      alerta.severidade === 'AMARELA' ? "bg-amber-50 border-amber-100" :
                      "bg-emerald-50 border-emerald-100"
                   )}
                >
                   <div className="flex gap-4 items-start md:items-center">
                      <div className={cn(
                         "p-4 rounded-full flex items-center justify-center",
                         alerta.severidade === 'VERMELHA' ? "bg-red-100 text-red-600" :
                         alerta.severidade === 'AMARELA' ? "bg-amber-100 text-amber-600" :
                         "bg-emerald-100 text-emerald-600"
                      )}>
                         {alerta.severidade === 'VERMELHA' ? <XOctagon className="w-6 h-6" /> :
                          alerta.severidade === 'AMARELA' ? <AlertTriangle className="w-6 h-6" /> :
                          <CheckCircle2 className="w-6 h-6" />}
                      </div>
                      
                      <div className="max-w-xl">
                         <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-900">{alerta.alunoNome || 'Desconhecido'}</span>
                            <span className={cn(
                               "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                               alerta.severidade === 'VERMELHA' ? "bg-red-200 text-red-700" :
                               alerta.severidade === 'AMARELA' ? "bg-amber-200 text-amber-700" :
                               "bg-emerald-200 text-emerald-700"
                            )}>Risco Identificado</span>
                         </div>
                         <p className="text-sm font-medium text-slate-700 leading-relaxed mb-1.5">{alerta.motivo}</p>
                         <p className="text-xs font-bold text-indigo-700 bg-white/50 px-3 py-2 rounded-lg border border-indigo-100/50 flex gap-2 w-max">
                            <BrainCircuit className="w-4 h-4 text-indigo-500" />
                            Ação Automática: {alerta.sugestao}
                         </p>
                      </div>
                   </div>

                   <div className="flex gap-3 mt-4 md:mt-0 shrink-0">
                      <button className="flex items-center justify-center bg-white border border-slate-200 hover:border-slate-300 text-slate-600 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                         Ignorar
                      </button>
                      <button className="flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-slate-200">
                         Autorizar Mudança
                      </button>
                   </div>
                </motion.div>
            ))}
         </AnimatePresence>
      </div>
    </div>
  );
}
