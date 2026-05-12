import { api } from '../../../lib/api';
import { normalizeArray } from '../../../utils/normalizeArray';


import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import {   BrainCircuit, ShieldAlert, Sparkles, AlertTriangle, TrendingUp, TrendingDown,
  User, CheckCircle2, ChevronRight, XOctagon, Loader2
} from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer } from '../../../components/charts/ChartContainer';
import { cn } from '../../../lib/utils';export default function ProfessorInsights() {
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

    const fetchAlerts = async () => {
      const { data, error } = await api
        .from('alertas_pedagogicos')
        .select('*')
        .eq('target_professor_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching alerts:', error);
      } else {
        setAlertas(normalizeArray(data).map(d => ({
          ...d,
          targetProfessorId: d.target_professor_id,
          alunoNome: d.aluno_nome,
          createdAt: d.created_at
        })));
      }
      setLoading(false);
    };

    fetchAlerts();

    // Subscribe to alerts
    const channel = api
      .channel('alertas_pedagogicos_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'alertas_pedagogicos',
        filter: `target_professor_id=eq.${user.id}`
      }, () => {
        fetchAlerts();
      })
      .subscribe();

    return () => {
      api.removeChannel(channel);
    };
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

             <ChartContainer height={220}>
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
             </ChartContainer>
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

      {/* SUGESTÕES CONTEXTUAIS DO EDUJARVIS */}
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 pt-8 flex items-center gap-2">
         <Sparkles className="w-4 h-4 text-indigo-500" /> Inteligência de Intervenção
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sugestão Dinâmica com base na Turma */}
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-100 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-6">
             <div className="bg-white/20 p-3 rounded-2xl">
               <BrainCircuit className="w-6 h-6 text-white" />
             </div>
             <span className="text-[9px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Turma S5</span>
          </div>
          <div>
            <h4 className="text-xl font-black italic uppercase tracking-tighter mb-2">Acelerador de Tópicos</h4>
            <p className="text-xs text-indigo-100 font-medium leading-relaxed">
               Engajamento está em alta (85% para 90%). A IA sugere subir o nível de complexidade em 15% para a próxima aula.
            </p>
          </div>
          <button className="mt-6 w-full py-4 bg-white text-indigo-600 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-slate-950 hover:text-white transition-all">
             Aplicar Sincronização <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Feed de Alertas Pedagógicos como era */}
        <div className="space-y-4">
           {alertas.length === 0 ? (
             <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-[2rem] text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                Motor tático estável.
             </div>
           ) : alertas.slice(0, 2).map((alerta) => (
             <div key={alerta.id} className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-center gap-4 hover:shadow-lg transition-all">
               <AlertTriangle className={cn(
                  "w-8 h-8 shrink-0",
                  alerta.severidade === 'VERMELHA' ? "text-red-500" : "text-amber-500"
               )} />
               <div>
                  <p className="text-xs font-black text-slate-900">{alerta.alunoNome}</p>
                  <p className="text-[10px] font-medium text-slate-500 line-clamp-1">{alerta.motivo}</p>
               </div>
               <ChevronRight className="w-4 h-4 text-slate-300 ml-auto" />
             </div>
           ))}
        </div>
      </div>

    </div>
  );
}
