import React, { useEffect, useState } from 'react';
import { ChartContainer } from '../../components/charts/ChartContainer';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, BookOpen, Brain, ShieldAlert, Target, Loader2, Info, 
  TrendingUp, TrendingDown, Zap, Activity, Globe, Cpu, Search,
  Calendar, ChevronRight, Sparkles, AlertCircle, Layout, ArrowUpRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { normalizeArray } from '../../utils/normalizeArray';

const COLORS = ['#6366f1', '#3b82f6', '#f59e0b', '#ef4444'];

const GROWTH_DATA = [
  { name: 'Jan', total: 400, active: 240 },
  { name: 'Fev', total: 800, active: 680 },
  { name: 'Mar', total: 1200, active: 900 },
  { name: 'Abr', total: 1700, active: 1450 },
  { name: 'Mai', total: 2200, active: 1900 },
  { name: 'Jun', total: 2800, active: 2300 },
];

export function AdminDashboardPanel() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mocking for a complete view
        setData({
          totalUsersActivos: 1248,
          distribuicaoPerfis: [
            { name: 'Alunos', value: 850 },
            { name: 'Professores', value: 120 },
            { name: 'Admins', value: 15 },
            { name: 'Coordenadores', value: 45 }
          ],
          tokensIA_Consumidos_Mes: 850400,
          riscoPedagogicoAlunos: 12,
          onboardingPendentes: 8,
          systemStatus: '98.9%'
        });
      } catch (err) {
        console.error('Error fetching BI data:', err);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
     <div className="flex flex-col items-center justify-center min-h-[600px] gap-6 text-indigo-500 p-12">
        <div className="relative">
           <Cpu className="w-12 h-12 text-indigo-600 animate-pulse" />
           <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-ping" />
        </div>
        <div className="text-center space-y-2">
           <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Nexus Executive Interface</h2>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sincronizando Heurísticas Neuronais...</p>
        </div>
     </div>
  );

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto font-sans">
      {/* Cinematic Executive Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Quantum Systems Online // Global Sync</h2>
           </div>
           <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
              Painel <span className="text-indigo-600">Estratégico</span>
           </h1>
           <p className="text-slate-500 font-medium max-w-xl">Visão unificada de ativos, engajamento e métricas de inteligência da rede EduJarvis.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-[1.5rem] border border-slate-200 shadow-inner self-start">
           {[
             { id: 'overview', label: 'Overview', icon: Layout },
             { id: 'users', label: 'Usuários', icon: Users },
             { id: 'ia', label: 'Métricas IA', icon: Brain }
           ].map((tab) => (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative flex items-center gap-2",
                  activeTab === tab.id 
                    ? "bg-white text-slate-900 shadow-xl" 
                    : "text-slate-400 hover:text-slate-600"
                )}
             >
               <tab.icon className="w-4 h-4" />
               {tab.label}
             </button>
           ))}
        </div>
      </header>

      {/* KPI Micro-Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <KPIWidget 
            icon={Users} title="Base de Ativos" value={data?.totalUsersActivos} 
            subtitle="Identidades Ativas" color="indigo"
            trend="up" trendValue="+8.2%"
         />
         <KPIWidget 
            icon={Brain} title="IA Pulse" value={`${(data?.tokensIA_Consumidos_Mes / 1000).toFixed(0)}k`} 
            subtitle="Tokens / 24h" color="slate"
            trend="up" trendValue="High Stress"
         />
         <KPIWidget 
            icon={Target} title="Engajamento" value="94.2%" 
            subtitle="Coerência Pedagógica" color="blue"
            trend="up" trendValue="+2.1%"
         />
         <KPIWidget 
            icon={ShieldAlert} title="Gap de Risco" value={data?.riscoPedagogicoAlunos} 
            subtitle="Evasão Detectada" color="rose"
            trend="down" trendValue="-3" alert
         />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -20 }}
           className="grid grid-cols-1 lg:grid-cols-12 gap-10"
        >
          {activeTab === 'overview' && (
             <>
               {/* Main Analytics Hub */}
               <div className="lg:col-span-8 space-y-10">
                  <section className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl shadow-slate-100/50 overflow-hidden relative group">
                     <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Activity className="w-60 h-60 text-slate-900" />
                     </div>
                     
                     <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                          <div>
                             <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">Curva de Crescimento</h3>
                             <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Escalabilidade em Tempo Real</p>
                          </div>
                          <div className="flex items-center gap-6">
                             <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-indigo-200" />
                                <span className="text-[10px] font-black uppercase text-slate-400">Target</span>
                             </div>
                             <div className="flex items-center gap-2 text-indigo-600">
                                <div className="w-3 h-3 rounded-full bg-indigo-600 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                <span className="text-[10px] font-black uppercase">Real</span>
                             </div>
                          </div>
                        </div>

                        <ChartContainer height={400}>
                           <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={GROWTH_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.05}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                  </linearGradient>
                                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} />
                                <Tooltip 
                                   contentStyle={{ borderRadius: '2rem', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)' }}
                                   itemStyle={{ fontSize: '13px', fontWeight: 900 }}
                                />
                                <Area type="monotone" dataKey="total" stroke="#cbd5e1" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorTotal)" />
                                <Area type="monotone" dataKey="active" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#colorActive)" />
                              </AreaChart>
                           </ResponsiveContainer>
                        </ChartContainer>
                     </div>
                  </section>

                  {/* Operational Sync Insights */}
                  <section className="bg-slate-900 rounded-[3rem] p-12 text-white overflow-hidden relative group">
                     <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform">
                        <Sparkles className="w-48 h-48 text-indigo-400" />
                     </div>
                     <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-10">
                           <div className="bg-indigo-600 p-3 rounded-2xl">
                              <Brain className="w-6 h-6" />
                           </div>
                           <h3 className="text-xl font-black italic uppercase tracking-tighter">Insights do Nexus Intelligence</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <InsightCard 
                             title="Análise de Retenção" 
                             desc="O novo algoritmo de tutoria adaptativa reduziu a evasão em 18.5% no último ciclo."
                             type="positive"
                           />
                           <InsightCard 
                             title="Consumo de Cloud" 
                             desc="Pico de processamento detectado em horários noturnos. Rebalanceamento automático ativado."
                             type="status"
                           />
                        </div>
                     </div>
                  </section>
               </div>

               {/* Right Intelligence Sidebar */}
               <div className="lg:col-span-4 space-y-10">
                  <section className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl shadow-slate-100/50">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Composição de Identidades</h3>
                     <div className="h-[280px] w-full mb-10">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={normalizeArray(data?.distribuicaoPerfis)}
                              cx="50%"
                              cy="50%"
                              innerRadius={80}
                              outerRadius={110}
                              paddingAngle={10}
                              dataKey="value"
                              stroke="none"
                            >
                              {normalizeArray(data?.distribuicaoPerfis).map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity cursor-pointer outline-none" />
                              ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 15px 30px -5px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ fontSize: '12px', fontWeight: 900 }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                     </div>
                     <div className="space-y-4">
                        {(data?.distribuicaoPerfis || []).map((entry: any, i: number) => (
                           <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all group">
                              <div className="flex items-center gap-3">
                                 <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                 <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest">{entry.name}</span>
                              </div>
                              <span className="text-xl font-black italic text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{entry.value}</span>
                           </div>
                        ))}
                     </div>
                  </section>

                  <section className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                     <div className="absolute -bottom-10 -right-10 opacity-20 group-hover:scale-110 transition-transform">
                        <Globe className="w-56 h-56" />
                     </div>
                     <div className="relative z-10 space-y-8">
                        <div className="bg-white/20 p-4 rounded-3xl w-fit backdrop-blur-md">
                           <Layout className="w-8 h-8" />
                        </div>
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Orquestração Central</h3>
                        <p className="text-xs text-indigo-100 font-medium leading-relaxed max-w-[200px]">
                           Gerencie fluxos de trabalho institucionais e permissões globais.
                        </p>
                        <Link to="/admin/users" className="flex items-center justify-between w-full p-6 bg-white text-indigo-600 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-slate-900 hover:text-white transition-all group/btn">
                           Acessar IAM
                           <ArrowUpRight className="w-5 h-5 group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                     </div>
                  </section>
               </div>
             </>
          )}

          {activeTab === 'users' && (
             <div className="lg:col-span-12 py-20 text-center space-y-8 bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
                <Users className="w-24 h-24 text-slate-100 mx-auto" />
                <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">Modulo de Governança</h2>
                <p className="text-slate-400 font-medium max-w-sm mx-auto">Sessão dedicada para administração profunda de contas, permissões e fluxos de onboarding pendentes.</p>
             </div>
          )}

          {activeTab === 'ia' && (
             <div className="lg:col-span-12 py-20 text-center space-y-8 bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
                <Brain className="w-24 h-24 text-slate-100 mx-auto" />
                <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">Neural Engine Matrix</h2>
                <p className="text-slate-400 font-medium max-w-sm mx-auto">Análise volumétrica de tokens, taxas de acerto preditivo e monitoramento de latência de IA.</p>
             </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function KPIWidget({ icon: Icon, title, value, subtitle, color, trend, trendValue, alert }: any) {
  const colors: any = {
    indigo: "bg-indigo-50 border-indigo-100 text-indigo-600",
    blue: "bg-blue-50 border-blue-100 text-blue-600",
    rose: "bg-rose-50 border-rose-100 text-rose-600",
    slate: "bg-slate-900 border-slate-800 text-white"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className={cn("p-10 rounded-[3rem] border transition-all cursor-default shadow-2xl relative group", colors[color].split(' ')[0], colors[color].split(' ')[1])}
    >
      <div className="flex justify-between items-start mb-8">
        <div className={cn("p-4 rounded-2xl shadow-inner", color === 'slate' ? 'bg-white/10' : 'bg-white')}>
           <Icon className={cn("w-6 h-6", color === 'slate' ? 'text-indigo-400' : colors[color].split(' ')[2])} />
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm",
          trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
        )}>
           <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", trend === 'up' ? 'bg-emerald-500' : 'bg-rose-500')} />
           {trendValue}
        </div>
      </div>
      
      <p className={cn("text-5xl font-black italic tracking-tighter leading-none mb-3", color === 'slate' ? 'text-white' : 'text-slate-900')}>{value}</p>
      <h3 className={cn("text-[10px] font-black uppercase tracking-[0.2em] opacity-60", color === 'slate' ? 'text-slate-400' : 'text-slate-500')}>{title}</h3>
      <p className="text-[9px] font-bold mt-8 text-slate-400 uppercase tracking-widest opacity-40">{subtitle}</p>

      {alert && (
        <div className="absolute top-0 right-0 p-8">
           <AlertCircle className="w-5 h-5 text-rose-500 animate-pulse" />
        </div>
      )}
    </motion.div>
  );
}

function InsightCard({ title, desc, type }: any) {
  return (
    <div className={cn(
      "p-8 rounded-[2rem] border-2 transition-all relative overflow-hidden group",
      type === 'positive' 
        ? "bg-white/5 border-emerald-500/20 hover:border-emerald-500/40" 
        : "bg-white/5 border-indigo-500/20 hover:border-indigo-500/40"
    )}>
      <div className={cn(
         "w-1 h-12 rounded-full absolute left-0 top-1/2 -translate-y-1/2",
         type === 'positive' ? 'bg-emerald-500' : 'bg-indigo-500'
      )} />
      <h4 className={cn("text-base font-black italic uppercase tracking-tight mb-2 group-hover:translate-x-1 transition-transform", type === 'positive' ? 'text-emerald-400' : 'text-indigo-400')}>
        {title}
      </h4>
      <p className="text-xs font-medium leading-relaxed text-slate-400">
        {desc}
      </p>
    </div>
  );
}

