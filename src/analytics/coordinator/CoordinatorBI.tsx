// src/modules/coordinator/bi/CoordinatorBI.tsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';
import { 
  Building2, Users, GraduationCap, AlertCircle, 
  Map, Target, ShieldCheck, Download, Calendar, Filter,
  TrendingUp, Activity, Globe, Sparkles, ChevronRight, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChartContainer } from '../../components/charts/ChartContainer';
import { useAuth } from '../../lib/AuthContext';
import { useTenant } from '../../lib/TenantContext';
import { cn } from '../../lib/utils';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const PLANO_DATA = [
  { month: 'Jan', count: 120, trend: 100 },
  { month: 'Fev', count: 145, trend: 130 },
  { month: 'Mar', count: 180, trend: 160 },
  { month: 'Abr', count: 175, trend: 190 },
  { month: 'Mai', count: 210, trend: 220 },
  { month: 'Jun', count: 245, trend: 250 },
];

export default function CoordinatorBI() {
  const { profile } = useAuth();
  const { tenant } = useTenant();
  const [loading, setLoading] = useState(true);
  const [activeRange, setActiveRange] = useState('30d');

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) {
     return (
        <div className="flex flex-col h-screen items-center justify-center bg-white space-y-4">
           <Activity className="w-10 h-10 text-indigo-600 animate-pulse" />
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 animate-pulse">
              Compilando Cubo de Inteligência...
           </p>
        </div>
     );
  }

  const distributionData = [
    { name: 'Mecatrônica', value: 45 },
    { name: 'Eletrotécnica', value: 30 },
    { name: 'TI', value: 25 },
  ];

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 font-sans space-y-10">
      {/* Dynamic Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-600/20">
                 <Building2 className="w-5 h-5" />
              </div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">BI Institucional • {tenant?.name || 'SENAI Central'}</h2>
           </div>
           <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
              Gestão <span className="text-indigo-600">Estratégica</span>
           </h1>
           <p className="text-slate-500 font-medium max-w-xl">Visão macro de desempenho, retenção e calibração pedagógica da instituição.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-[2rem] border border-slate-200 shadow-sm self-start">
           {['7d', '30d', '90d', 'anual'].map((range) => (
             <button
                key={range}
                onClick={() => setActiveRange(range)}
                className={cn(
                  "px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeRange === range 
                    ? "bg-white text-indigo-600 shadow-md ring-1 ring-slate-100" 
                    : "text-slate-400 hover:text-slate-600"
                )}
             >
               {range === '7d' ? '7 Dias' : range === '30d' ? '30 Dias' : range === '90d' ? '90 Dias' : 'Anual'}
             </button>
           ))}
        </div>
      </header>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <BIMetricCard 
           label="Total de Alunos" value="842" 
           sub="+14 este mês" icon={Users} color="indigo"
           trend={12}
        />
        <BIMetricCard 
           label="Taxa de Aprovação" value="92.4%" 
           sub="Acima da meta SENAI" icon={ShieldCheck} color="emerald"
           trend={2.4}
        />
        <BIMetricCard 
           label="Risco de Evasão" value="4.2%" 
           sub="-1.5 pts vs anterior" icon={AlertCircle} color="rose"
           trend={-15} inverse
        />
        <BIMetricCard 
           label="Uso da IA" value="12.5k" 
           sub="Requisições neurais" icon={Target} color="amber"
           trend={45}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Growth Chart */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-100 flex flex-col group overflow-hidden relative">
           <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 transition-transform group-hover:rotate-0">
              <Globe className="w-48 h-48 text-slate-900" />
           </div>
           
           <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-10">
                 <div>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900">Pulso Institucional</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fluxo de Engajamento & Crescimento</p>
                 </div>
                 <button className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                    <Download className="w-5 h-5 text-slate-400" />
                 </button>
              </div>

              <ChartContainer height={350} className="flex-1">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={PLANO_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                       <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                             <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} />
                       <Tooltip 
                          contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                          itemStyle={{ fontSize: '12px', fontWeight: 900 }}
                       />
                       <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#colorCount)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </ChartContainer>
           </div>
        </div>

        {/* Distribution & Course Insights */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-8 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Insight da Coordenação
                 </h3>
                 <p className="text-xl font-bold leading-tight mb-8">
                    O curso de <span className="text-indigo-400 italic">Mecatrônica</span> aumentou o engajamento em 42% via Simulados Gamificados.
                 </p>
                 <div className="space-y-4 mb-10">
                    <div className="p-5 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-sm">
                       <p className="text-[10px] font-black uppercase text-amber-400 mb-2 tracking-widest leading-none">Ação Crítica</p>
                       <p className="text-sm font-medium text-slate-300">Revisar ementa de Eletrônica Analógica na Turma B due to low proficiency peaks.</p>
                    </div>
                 </div>
                 <button className="flex items-center justify-between w-full p-5 bg-indigo-600 hover:bg-indigo-500 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-indigo-600/20 group/btn">
                    Explorar Dados
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                 </button>
              </div>
           </div>

           <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
                 Alocação por Curso
              </h3>
              <ChartContainer height={200}>
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                          data={distributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={90}
                          paddingAngle={10}
                          dataKey="value"
                          stroke="none"
                       >
                          {distributionData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity outline-none" />
                          ))}
                       </Pie>
                       <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
              </ChartContainer>
              <div className="grid grid-cols-2 gap-4 mt-8">
                 {distributionData.map((entry, i) => (
                    <div key={i} className="flex flex-col">
                       <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                          <span className="text-[9px] uppercase font-black text-slate-400 tracking-tighter">{entry.name}</span>
                       </div>
                       <p className="text-lg font-black text-slate-900">{entry.value}%</p>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function BIMetricCard({ label, value, sub, icon: Icon, color, trend, inverse }: any) {
  const isPositive = inverse ? trend < 0 : trend > 0;
  
  return (
    <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity -rotate-12 group-hover:rotate-0">
         <Icon className="w-20 h-20 text-slate-900" />
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
         <div className="flex justify-between items-start mb-6">
            <div className={cn(
              "p-4 rounded-2xl shadow-sm",
              color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
              color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
              color === 'rose' ? 'bg-rose-50 text-rose-600' :
              'bg-amber-50 text-amber-600'
            )}>
               <Icon className="w-6 h-6" />
            </div>
            
            <div className={cn(
              "flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-widest",
              isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            )}>
               <TrendingUp className={cn("w-3 h-3", !isPositive && 'rotate-180')} />
               {Math.abs(trend)}%
            </div>
         </div>
         
         <div className="mt-auto">
            <p className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 mb-1">{value}</p>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">{label}</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">{sub}</p>
         </div>
      </div>
    </div>
  );
}

