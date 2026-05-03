// src/components/edujarvis/IntelligenceDashboard.tsx
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Globe, 
  Search, 
  TrendingUp, 
  Cpu, 
  Lightbulb, 
  Network,
  Database,
  BarChart4,
  BrainCircuit,
  Zap
} from 'lucide-react';
import { Button } from '../ui/Button';

export const IntelligenceDashboard: React.FC = () => {
  const [view, setView] = useState<'global' | 'research' | 'strategic'>('global');

  const researchInsights = [
    { id: 1, title: 'Método Socrático vs Direto', control: 62, test: 81, winner: 'Socrático', confidence: '94%' },
    { id: 2, title: 'Micro-learning em Mobile', control: 45, test: 72, winner: 'Micro-learning', confidence: '88%' }
  ];

  return (
    <div className="p-6 bg-slate-950 min-h-screen text-slate-100">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <BrainCircuit className="w-10 h-10 text-indigo-400" />
          <h1 className="text-4xl font-extrabold tracking-tight">
            Intelligence <span className="text-indigo-400">OS</span>
          </h1>
          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold rounded-full border border-indigo-500/30 uppercase tracking-widest">
            PHASE 11 GLOBAL
          </span>
        </div>
        <p className="text-slate-400">Plataforma de inteligência coletiva e aprimoramento contínuo pedagógico.</p>
      </header>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { id: 'global', label: 'Global Intelligence', icon: Globe, desc: 'Insights agregados de toda a rede.' },
          { id: 'research', label: 'AI Research Lab', icon: Search, desc: 'Testes A/B e evolução de métodos.' },
          { id: 'strategic', label: 'Decision Control', icon: TrendingUp, desc: 'IA Estratégica para alta gestão.' }
        ].map((tab) => (
          <motion.div
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => setView(tab.id as any)}
            className={`cursor-pointer p-6 rounded-2xl border transition-all ${
              view === tab.id 
                ? 'bg-indigo-600/10 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.1)]' 
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <tab.icon className={`w-8 h-8 mb-4 ${view === tab.id ? 'text-indigo-400' : 'text-slate-500'}`} />
            <h3 className="text-lg font-bold mb-1">{tab.label}</h3>
            <p className="text-xs text-slate-500">{tab.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Panel */}
        <div className="lg:col-span-3 space-y-8">
          {view === 'global' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 overflow-hidden relative">
               <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full"></div>
               <div className="flex justify-between items-center mb-8">
                 <h2 className="text-2xl font-bold flex items-center gap-3">
                   <Network className="text-indigo-400" />
                   Network Learning Index
                 </h2>
                 <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                   Export Data Lake
                 </Button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <h4 className="text-sm font-semibold text-slate-500 flex items-center gap-2">
                       <Zap className="w-4 h-4 text-amber-400" /> TOP TRENDING TOPICS (REDE)
                    </h4>
                    {[
                      { topic: 'IA Generativa em Python', engagement: 94, trend: '+12%' },
                      { topic: 'Cálculo para Engenharia', engagement: 82, trend: '-3%' },
                      { topic: 'Segurança de APIs', engagement: 78, trend: '+25%' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-white/5">
                        <span className="font-medium">{item.topic}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-indigo-400 font-mono">{item.engagement}%</span>
                          <span className={item.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}>{item.trend}</span>
                        </div>
                      </div>
                    ))}
                 </div>

                 <div className="bg-slate-950/80 p-6 rounded-2xl border border-indigo-500/20">
                    <h4 className="text-sm font-semibold text-slate-400 mb-6 flex items-center gap-2">
                      <BarChart4 className="w-4 h-4" /> GLOBAL PERFORMANCE BENCHMARK
                    </h4>
                    <div className="space-y-8">
                      {[
                        { label: 'Sua Instituição', value: 85, color: 'bg-indigo-500' },
                        { label: 'Média Global SaaS', value: 72, color: 'bg-slate-700' },
                        { label: 'TOP 5% Instituições', value: 91, color: 'bg-emerald-500' }
                      ].map((bar, i) => (
                        <div key={i}>
                          <div className="flex justify-between mb-2 text-xs font-medium">
                            <span className="text-slate-300">{bar.label}</span>
                            <span className="text-slate-100">{bar.value}%</span>
                          </div>
                          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${bar.value}%` }}
                              transition={{ duration: 1.5, delay: i * 0.2 }}
                              className={`h-full ${bar.color}`}
                            ></motion.div>
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>
               </div>
            </div>
          )}

          {view === 'research' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                 <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                   <Database className="text-rose-400" />
                   AI Pedagogical Experiments (Live)
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {researchInsights.map(exp => (
                      <div key={exp.id} className="p-6 rounded-2xl bg-slate-950 border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-4 right-4 text-[10px] font-mono text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          CONFIDENCE: {exp.confidence}
                        </div>
                        <h4 className="font-bold text-slate-100 mb-4">{exp.title}</h4>
                        <div className="flex items-end gap-3 h-20 mb-4">
                           <div className="flex-1 flex flex-col items-center">
                              <div className="w-full bg-slate-800 rounded-lg relative" style={{ height: `${exp.control}%` }}>
                                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-500">CONTROL</span>
                              </div>
                              <span className="text-xs mt-2 font-mono text-slate-400">{exp.control}%</span>
                           </div>
                           <div className="flex-1 flex flex-col items-center">
                              <div className="w-full bg-rose-500 rounded-lg relative" style={{ height: `${exp.test}%` }}>
                                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-rose-400 font-bold">TEST</span>
                              </div>
                              <span className="text-xs mt-2 font-mono text-rose-400 font-bold">{exp.test}%</span>
                           </div>
                        </div>
                        <p className="text-xs text-slate-500">Vencedor: <span className="text-indigo-400 font-bold">{exp.winner}</span>. Sugestão: Aplicar globalmente.</p>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-6">
           <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-3xl shadow-xl shadow-indigo-500/20">
              <h3 className="text-sm font-bold opacity-70 uppercase tracking-widest mb-6">Strategic Advisor</h3>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 mb-6">
                 <p className="text-xs italic text-indigo-100">
                   "Detectamos que a taxa de evasão nos cursos de Tecnologia da sua rede cai 42% quando aplicamos o Agente de Recomendação Proativo na primeira semana."
                 </p>
              </div>
              <Button className="w-full bg-white text-indigo-700 hover:bg-slate-100 border-none">
                Ver Plano de Ação
              </Button>
           </div>

           <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">Data Lake Activity</h3>
              <div className="space-y-4">
                 {[
                   { label: 'Events Indexed', value: '4.2M' },
                   { label: 'Neural Patches', value: '124' },
                   { label: 'Active Mentors', value: '5' }
                 ].map((stat, i) => (
                   <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                     <span className="text-xs text-slate-400">{stat.label}</span>
                     <span className="text-xs font-mono font-bold text-indigo-400">{stat.value}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};
