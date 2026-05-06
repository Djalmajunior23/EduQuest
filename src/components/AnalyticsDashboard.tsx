import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie 
} from 'recharts';
import { 
  Trophy, Users, Target, Zap, TrendingUp, AlertTriangle, 
  CheckCircle2, Clock, Brain, LayoutDashboard, FileText
} from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { cn } from '../lib/utils';

export default function AnalyticsDashboard() {
  const { profile } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     async function fetchBIData() {
       try {
         // In a real scenario, these would be fetched from 'indicadores_bi'
         // Loading empty dataset to reflect real logic
         setData({
           performance: [],
           mastery: [],
           engagement: [],
           stats: {
             avgGrade: 0,
             completion: 0,
             tokens: 0,
             rank: 0
           }
         });
       } catch (error) {
         console.error(error);
       } finally {
         setLoading(false);
       }
     }
     fetchBIData();
  }, [profile]);

  if (loading) return (
     <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
     </div>
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header Summary */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
               <Target className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Média Geral</p>
               <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">{data.stats.avgGrade}</h3>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
               <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Conclusão</p>
               <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">{data.stats.completion}%</h3>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
               <Zap className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Uso de IA</p>
               <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">{data.stats.tokens} <span className="text-xs font-medium lowercase">tkns</span></h3>
            </div>
         </div>
         <div className="bg-slate-900 p-6 rounded-[2.5rem] shadow-xl shadow-slate-200 flex items-center gap-4 text-white">
            <div className="p-4 bg-blue-600 rounded-2xl">
               <Trophy className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Posição Ranking</p>
               <h3 className="text-2xl font-black italic uppercase tracking-tighter">{data.stats.rank}º</h3>
            </div>
         </div>
      </section>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Performance Evolution */}
         <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
               <div>
                  <h3 className="text-lg font-black italic uppercase tracking-tighter text-slate-900 flex items-center gap-2">
                     <TrendingUp className="w-5 h-5 text-blue-600" /> Evolução de Desempenho
                  </h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sua nota vs Média da Turma</p>
               </div>
               <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                     <div className="w-3 h-3 bg-blue-600 rounded-full" />
                     <span className="text-[10px] font-black uppercase text-slate-500">Você</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-3 h-3 bg-slate-200 rounded-full" />
                     <span className="text-[10px] font-black uppercase text-slate-500">Média</span>
                  </div>
               </div>
            </div>
            <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.performance}>
                     <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}}
                        dy={10}
                     />
                     <YAxis hide />
                     <Tooltip 
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                     />
                     <Area type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                     <Area type="monotone" dataKey="avg" stroke="#e2e8f0" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Technical Mastery */}
         <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
            <h3 className="text-lg font-black italic uppercase tracking-tighter text-slate-900 mb-8 flex items-center gap-2">
               <Brain className="w-5 h-5 text-indigo-600" /> Domínio Técnico
            </h3>
            <div className="space-y-6">
               {data.mastery.map((item: any) => (
                  <div key={item.subject}>
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">{item.subject}</span>
                        <span className="text-xs font-black text-slate-900 italic uppercase">{item.value}%</span>
                     </div>
                     <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${item.value}%` }}
                           className={cn(
                              "h-full rounded-full transition-all duration-1000",
                              item.value > 80 ? "bg-emerald-500" : item.value > 50 ? "bg-blue-600" : "bg-amber-500"
                           )}
                        />
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {/* Engagement Card */}
         <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
            <h3 className="text-lg font-black italic uppercase tracking-tighter text-slate-900 mb-8 flex items-center gap-2">
               <Clock className="w-5 h-5 text-emerald-600" /> Engajamento Semanal
            </h3>
            <div className="h-[200px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.engagement}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}}
                        dy={10}
                     />
                     <YAxis hide />
                     <Tooltip cursor={{fill: '#f8fafc'}} />
                     <Bar dataKey="hours" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Alertas & Riscos */}
         <div className="bg-amber-50 rounded-[2.5rem] border border-amber-100 p-8 shadow-sm">
            <h3 className="text-lg font-black italic uppercase tracking-tighter text-slate-900 mb-6 flex items-center gap-2">
               <AlertTriangle className="w-5 h-5 text-amber-600" /> Alertas IA
            </h3>
            <div className="space-y-4">
               <div className="p-4 bg-white/60 rounded-2xl border border-amber-200">
                  <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-1">Baixo Desempenho</p>
                  <p className="text-xs font-medium text-amber-900">Seus resultados em Back-end estão 20% abaixo da média.</p>
               </div>
               <div className="p-4 bg-white/60 rounded-2xl border border-amber-200">
                  <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-1">Sugestão de Estudo</p>
                  <p className="text-xs font-medium text-emerald-900">Clique aqui para ver a trilha de reforço para JavaScript Puro.</p>
               </div>
            </div>
         </div>

         {/* Relatórios Rápidos */}
         <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-200">
            <h3 className="text-lg font-black italic uppercase tracking-tighter mb-8">Exportar BI</h3>
            <div className="space-y-3">
               <button className="w-full flex items-center justify-between p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all group">
                  <span className="text-[10px] font-black uppercase tracking-widest">Relatório Mensal</span>
                  <FileText className="w-4 h-4 group-hover:scale-110" />
               </button>
               <button className="w-full flex items-center justify-between p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all group">
                  <span className="text-[10px] font-black uppercase tracking-widest">Mapa de Competências</span>
                  <FileText className="w-4 h-4 group-hover:scale-110" />
               </button>
               <button className="w-full flex items-center justify-between p-4 bg-blue-600 rounded-2xl hover:bg-blue-700 transition-all group">
                  <span className="text-[10px] font-black uppercase tracking-widest">Enviar p/ Professor</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1" />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
  );
}
