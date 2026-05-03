import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Users, BookOpen, Brain, ShieldAlert, Target, Loader2, Info } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

const COLORS = ['#4f46e5', '#3b82f6', '#f59e0b', '#ef4444'];

export function AdminDashboardPanel() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, n8n consolidates this data. We mock a structure here but listen theoretically
    // to a BI metrics document that is updated by the server logic (n8n/Cloud Functions)
    const unsubscribe = onSnapshot(doc(db, 'indicadores_bi', 'instituicao_atual'), (snap) => {
       if (snap.exists()) {
          setData(snap.data());
       } else {
          // Valores iniciais/vazios enquanto o motor de BI não popula a coleção
          setData({
             totalUsersActivos: 0,
             distribuicaoPerfis: [
                { name: 'Alunos', value: 0 },
                { name: 'Professores', value: 0 },
                { name: 'Admins', value: 0 }
             ],
             tokensIA_Consumidos_Mes: 0,
             riscoPedagogicoAlunos: 0,
             onboardingPendentes: 0
          });
       }
       setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return (
     <div className="flex items-center gap-4 text-[10px] font-black uppercase text-indigo-500 uppercase tracking-widest p-12">
        <Loader2 className="w-5 h-5 animate-spin" /> Carregando Cubo de BI...
     </div>
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Title Area */}
      <div>
         <h2 className="text-[10px] font-black uppercase tracking-[0.3em] overflow-hidden text-indigo-500 mb-2">CCOOP • Centro de Controle Operacional</h2>
         <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900">
            Painel Executivo
         </h1>
      </div>

      {/* Primary KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <KPIWidget 
            icon={Users} title="Usuários Ativos" value={data?.totalUsersActivos} 
            subtitle="+12% que mês passado" bg="bg-blue-600" text="text-white"
         />
         <KPIWidget 
            icon={Target} title="Pendências Onboarding" value={data?.onboardingPendentes} 
            subtitle="Necessita atenção" bg="bg-amber-100" text="text-amber-700" 
         />
         <KPIWidget 
            icon={Brain} title="Tokens IA Consumidos" value={(data?.tokensIA_Consumidos_Mes / 1000).toFixed(1) + 'k'} 
            subtitle="76% da Quota Mensal" bg="bg-indigo-900" text="text-indigo-100"
         />
         <KPIWidget 
            icon={ShieldAlert} title="Avisos de Risco (Evasão)" value={data?.riscoPedagogicoAlunos} 
            subtitle="Baseado em Baixo Engajamento" bg="bg-red-50" text="text-red-600" alert
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Growth Chart */}
         <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex justify-between">
               <span>Crescimento da Base (6 Meses)</span>
               <span className="text-blue-500">Fluxo n8n ativo</span>
            </h3>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[]} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} />
                    <Tooltip 
                       contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                       itemStyle={{ fontSize: '12px', fontWeight: 900 }}
                    />
                    <Area type="monotone" dataKey="total" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                    <Area type="monotone" dataKey="active" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Right Sidebar Charts */}
         <div className="space-y-8">
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                  Distribuição de Perfis
               </h3>
               <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data?.distribuicaoPerfis || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {(data?.distribuicaoPerfis || []).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                          contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          itemStyle={{ fontSize: '12px', fontWeight: 900 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="flex justify-center gap-4 mt-2">
                  {(data?.distribuicaoPerfis || []).map((entry: any, i: number) => (
                     <div key={i} className="flex items-center gap-1.5 cursor-help" title={entry.name}>
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                        <span className="text-[10px] uppercase font-bold text-slate-500">{entry.name}</span>
                     </div>
                  ))}
               </div>
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl shadow-slate-200 overflow-hidden relative">
               <div className="relative z-10">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-6 flex items-center gap-2">
                     <Info className="w-3 h-3" /> Gestão de Usuários
                  </h3>
                  <p className="text-sm font-medium leading-relaxed text-slate-300 mb-6">
                     Gerencie convites em lote, revise permissões de coordenadores ou realize bloqueios pontuais.
                  </p>
                  <Link to="/admin/users" className="block w-full text-center py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors shadow-lg shadow-indigo-500/20">
                     Acessar Painel IAM
                  </Link>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function KPIWidget({ icon: Icon, title, value, subtitle, bg, text, alert }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn("p-6 rounded-[2rem] shadow-sm relative overflow-hidden", bg)}
    >
      {alert && (
        <span className="absolute top-4 right-4 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      )}
      <Icon className={cn("w-6 h-6 mb-4", text)} />
      <p className={cn("text-3xl font-black italic tracking-tighter mb-1", text)}>{value}</p>
      <h3 className={cn("text-[10px] font-black uppercase tracking-widest opacity-80", text)}>{title}</h3>
      <p className={cn("text-[10px] font-bold mt-4 opacity-70", text)}>{subtitle}</p>
    </motion.div>
  );
}
