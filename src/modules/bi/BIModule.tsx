import React from 'react';
import { 
  Target, Users, TrendingDown, Clock, AlertTriangle, 
  CheckCircle2, Brain, Sparkles, ArrowRight, BarChart 
} from 'lucide-react';
import { 
  BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { ChartContainer } from '../../components/charts/ChartContainer';
import { cn } from '../../lib/utils';

const COMPETENCY_DATA = [
  { name: 'Lógica de Programação', score: 85, critical: false },
  { name: 'Estruturas de Dados', score: 42, critical: true },
  { name: 'Algoritmos Seleção', score: 78, critical: false },
  { name: 'Recursividade', score: 35, critical: true },
  { name: 'Complexidade O(n)', score: 55, critical: true },
  { name: 'POO Avançado', score: 92, critical: false },
];

const ENGAGEMENT_TREND = [
  { day: 'Seg', rate: 82 },
  { day: 'Ter', rate: 78 },
  { day: 'Qua', rate: 94 },
  { day: 'Qui', rate: 88 },
  { day: 'Sex', rate: 75 },
  { day: 'Sáb', rate: 45 },
  { day: 'Dom', rate: 30 },
];

export const BIModule = () => {
    return (
        <div className="space-y-10">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">Nexus BI Pedagógico</h2>
                    <p className="text-sm font-medium text-slate-500">Métricas neurais de desempenho e competências.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors">Exportar Relatório</button>
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        AI Insights
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Competências Críticas */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-black italic uppercase tracking-tighter text-slate-900 flex items-center gap-2">
                                <Target className="text-indigo-600" />
                                Mapeamento de Competências
                            </h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Domínio Técnico por UC</p>
                        </div>
                    </div>

                    <ChartContainer height={300}>
                        <ResponsiveContainer width="100%" height="100%">
                            <ReBarChart data={COMPETENCY_DATA} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fontStyle: 'italic', fontWeight: 900, fill: '#64748b' }}
                                />
                                <Tooltip 
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="score" radius={[0, 10, 10, 0]} barSize={24}>
                                    {COMPETENCY_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.critical ? '#ef4444' : '#6366f1'} />
                                    ))}
                                </Bar>
                            </ReBarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>

                {/* Alunos em Risco */}
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col">
                    <div className="mb-8">
                        <h3 className="font-black italic uppercase tracking-tighter flex items-center gap-2 text-rose-400">
                            <AlertTriangle className="w-5 h-5" />
                            Risco de Evasão
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Predição Baseada em Engajamento</p>
                    </div>

                    <div className="flex-1 space-y-4">
                        {[
                            { name: 'João Silva', risk: '92%', reason: 'Inatividade > 15 dias' },
                            { name: 'Maria Souza', risk: '78%', reason: 'Reprovação em SQL' },
                            { name: 'Pedro Lima', risk: '65%', reason: 'Faltas acumuladas' },
                        ].map((student, i) => (
                            <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors group cursor-pointer">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-sm">{student.name}</span>
                                    <span className="text-[10px] font-black text-rose-400">{student.risk} Risco</span>
                                </div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{student.reason}</p>
                                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[9px] font-black uppercase text-indigo-400">
                                    Intervir Agora <ArrowRight className="w-3 h-3" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full py-4 mt-6 bg-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all">
                        Ver Todos (12)
                    </button>
                </div>
            </div>

            {/* Digital Twin Section (Gêmeo Digital) */}
            <div className="bg-slate-900 p-10 rounded-[3rem] border border-indigo-500/30 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Users className="w-48 h-48 text-indigo-400" />
                 </div>
                 <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                       <div>
                          <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Digital Twin Nexus</h3>
                          <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Modelagem Preditiva de Comportamento</p>
                       </div>
                       <Sparkles className="w-6 h-6 text-indigo-400" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                       <div className="space-y-6">
                          {[
                             { label: 'Engajamento Latente', value: 92, color: 'bg-emerald-500' },
                             { label: 'Velocidade de Assimilação', value: 78, color: 'bg-indigo-500' },
                             { label: 'Resiliência Cognitiva', value: 85, color: 'bg-amber-500' },
                             { label: 'Probabilidade de Evasão', value: 12, color: 'bg-rose-500' }
                          ].map(stat => (
                             <div key={stat.label} className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                   <span>{stat.label}</span>
                                   <span className="text-white">{stat.value}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                   <div 
                                      className={cn("h-full transition-all duration-1000", stat.color)} 
                                      style={{ width: `${stat.value}%` }}
                                   />
                                </div>
                             </div>
                          ))}
                       </div>

                       <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 text-center space-y-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Previsão da IA (Próx. 15 dias)</p>
                          <div className="text-3xl font-black text-white italic">"Estável + Avanço"</div>
                          <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                             O modelo detectou um pico de atividade no Lab de Java, sugerindo transição para conceitos de Spring Boot.
                          </p>
                          <button className="w-full py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors">
                             Ver Insights Completos
                          </button>
                       </div>
                    </div>
                 </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Tendência de Engajamento */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50">
                    <div>
                        <h3 className="font-black italic uppercase tracking-tighter text-slate-900 flex items-center gap-2">
                            <Clock className="text-emerald-500" />
                            Ritmo de Aprendizagem
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Uso da Plataforma / Semana</p>
                    </div>
                    <ChartContainer height={200}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={ENGAGEMENT_TREND}>
                                <defs>
                                    <linearGradient id="colorEngage" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }} />
                                <YAxis hide />
                                <Area type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorEngage)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>

                {/* Resumo de Microcertificações */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[2.5rem] text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <CheckCircle2 className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="font-black italic uppercase tracking-tighter text-indigo-100 mb-6">Microcertificações (Badges)</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                                <p className="text-4xl font-black italic tracking-tighter mb-1">1,420</p>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-300">Total Emitido</p>
                            </div>
                            <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                                <p className="text-4xl font-black italic tracking-tighter mb-1">85%</p>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-300">Aproveitamento</p>
                            </div>
                        </div>
                        <div className="mt-8 flex items-center gap-3">
                            <div className="flex -space-x-3">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-700 bg-indigo-500 overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="user" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-[10px] font-bold text-indigo-200">+12 novos certificados hoje</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
