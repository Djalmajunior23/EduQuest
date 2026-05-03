// src/modules/coordinator/bi/CoordinatorBI.tsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';
import { 
  Building2, Users, GraduationCap, AlertCircle, 
  Map, Target, ShieldCheck, Download, Calendar, Filter
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../../lib/AuthContext';
import { useTenant } from '../../../lib/TenantContext';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function CoordinatorBI() {
  const { user } = useAuth();
  const { tenant } = useTenant();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) {
     return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
           <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
              <h2 className="font-bold text-slate-800">Compilando Dados Institucionais...</h2>
           </div>
        </div>
     );
  }

  const enrollmentData = [
    { month: 'Jan', count: 120 },
    { month: 'Fev', count: 145 },
    { month: 'Mar', count: 180 },
    { month: 'Abr', count: 175 },
    { month: 'Mai', count: 210 },
  ];

  const distributionData = [
    { name: 'Mecatrônica', value: 45 },
    { name: 'Eletrotécnica', value: 30 },
    { name: 'TI', value: 25 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">BI Coordenação</h1>
          <p className="text-slate-500 font-medium">Visão macro de desempenho e retenção institucional</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Calendar className="w-5 h-5" />
            Últimos 30 dias
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
            <Download className="w-5 h-5" />
            Relatório Anual
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <MetricCard label="Total de Alunos" value="842" sub="+14 este mês" icon={Users} color="indigo" />
        <MetricCard label="Taxa de Aprovação" value="92.4%" sub="Acima da meta" icon={ShieldCheck} color="emerald" />
        <MetricCard label="Risco de Evasão" value="4.2%" sub="-1.5 pts vs anterior" icon={AlertCircle} color="rose" />
        <MetricCard label="Uso da IA" value="12.5k" sub="Requisições/mês" icon={Target} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Matriculas */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
           <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-2">
             <Map className="w-6 h-6 text-indigo-500" />
             Crescimento de Matrículas
           </h3>
           <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={enrollmentData}>
                 <defs>
                   <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                 <Tooltip />
                 <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Distribuição por Cursos */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
           <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-2">
             <GraduationCap className="w-6 h-6 text-emerald-500" />
             Alocação por Curso
           </h3>
           <div className="h-[300px] flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={distributionData}
                   cx="50%"
                   cy="50%"
                   innerRadius={80}
                   outerRadius={100}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {distributionData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip />
                 <Legend />
               </PieChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="mt-10 bg-slate-900 p-8 rounded-[2.5rem] text-white">
        <h3 className="text-xl font-black mb-6 flex items-center gap-3">
          <Building2 className="w-6 h-6 text-indigo-400" />
          Insight da Coordenação (EduJarvis)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-4">
              <p className="text-slate-400 leading-relaxed font-medium">
                O curso de **Mecatrônica** apresenta o maior engajamento com a solução NexusInt AI, porém a taxa de proficiência em **Eletrônica Analógica** está 15% abaixo do esperado para o semestre corrente.
              </p>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-amber-400 font-bold text-xs uppercase mb-1">Ação Recomendada</div>
                <p className="text-sm">Workshop de nivelamento para professores da Turma B sobre o uso do Corretor IA.</p>
              </div>
           </div>
           <div className="flex flex-col justify-end">
             <button className="bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all">
                Explorar Dados Detalhados
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, icon: Icon, color }: any) {
  const themes: any = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${themes[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div>
        <div className="text-3xl font-black text-slate-900 tracking-tighter">{value}</div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</div>
        <div className="mt-2 text-[10px] font-bold text-slate-400">{sub}</div>
      </div>
    </div>
  );
}
