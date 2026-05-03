// src/components/edujarvis/EducationOSDashboard.tsx
import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Building2, 
  Map, 
  Target, 
  Settings2, 
  Sparkles, 
  Award,
  Briefcase,
  Layers,
  FlaskConical,
  ShieldAlert,
  GraduationCap
} from "lucide-react";
import { Button } from "../ui/Button";

import { CareerDashboardPro } from './CareerDashboardPro';

interface Props {
  tenantId: string;
}

export const EducationOSDashboard: React.FC<Props> = ({ tenantId }) => {
  const [activeTab, setActiveTab] = useState<'os' | 'agents' | 'curriculum' | 'career' | 'credentials' | 'simLab'>('os');
  const [loading, setLoading] = useState(false);
  const [osData, setOsData] = useState<any>(null);

  const testAutonomousOS = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/phase12/os/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          stats: { dropOutRisk: 12, engagementRate: 85, activeStudents: 1450 }
        })
      });
      const data = await response.json();
      setOsData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-slate-950 min-h-screen text-slate-100">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Layers className="w-10 h-10 text-indigo-400" />
          <h1 className="text-4xl font-extrabold tracking-tight">
            Autonomous <span className="text-indigo-400">OS</span>
          </h1>
          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold rounded-full border border-indigo-500/30 uppercase tracking-widest">
            PHASE 12 MASTER
          </span>
        </div>
        <p className="text-slate-400">Integração Escola ↔ Mercado com autonomia guiada por Inteligência Artificial.</p>
      </header>

      {/* Control Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { id: 'os', label: 'OS Control Center', icon: Settings2 },
          { id: 'agents', label: 'Agent Marketplace', icon: Sparkles },
          { id: 'curriculum', label: 'Curriculum Autopilot', icon: Map },
          { id: 'career', label: 'Career Paths', icon: Target },
          { id: 'credentials', label: 'Digital Credentials', icon: Award },
          { id: 'simLab', label: 'Simulation Labs', icon: FlaskConical },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]' 
                : 'text-slate-400 bg-slate-900 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-3">
          
          {activeTab === 'os' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
                   <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full"></div>
                   <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                     <Building2 className="text-indigo-400" />
                     Central de Comando Institucional
                   </h3>
                   <p className="text-slate-400 mb-8 max-w-2xl text-sm">
                     O Autonomous OS supervisiona continuamente a saúde acadêmica. O sistema toma decisões pró-ativas para otimizar aulas, reduzir evasão e preparar intervenções focadas.
                   </p>
                   
                   <Button onClick={testAutonomousOS} disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 mb-8">
                     <Sparkles className="w-4 h-4 mr-2" />
                     Executar Varredura Autônoma
                   </Button>

                   {osData && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-rose-950/20 border border-rose-900/50 p-6 rounded-2xl">
                           <h4 className="flex items-center gap-2 text-rose-400 font-bold mb-4">
                             <ShieldAlert className="w-5 h-5" />
                             Alertas de Risco
                           </h4>
                           <ul className="space-y-3">
                             {osData.alerts?.map((a: any, i: number) => (
                               <li key={i} className="text-sm bg-rose-950/50 p-3 rounded-lg border border-rose-900/30 text-rose-200">
                                 {a.message}
                               </li>
                             ))}
                           </ul>
                        </div>
                        <div className="bg-emerald-950/20 border border-emerald-900/50 p-6 rounded-2xl">
                           <h4 className="flex items-center gap-2 text-emerald-400 font-bold mb-4">
                             <GraduationCap className="w-5 h-5" />
                             Tarefas Aprovadas para Corpo Docente
                           </h4>
                           <ul className="space-y-3">
                             {osData.teacherReadyTasks?.map((t: any, i: number) => (
                               <li key={i} className="text-sm bg-emerald-950/50 p-3 rounded-lg border border-emerald-900/30 text-emerald-200">
                                 {t.task}
                               </li>
                             ))}
                           </ul>
                        </div>
                     </div>
                   )}
                </div>
             </motion.div>
          )}

          {activeTab === 'agents' && (
             <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Sparkles className="text-indigo-400" /> Marketplace de Agentes
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                   {[
                     { name: 'Agente Java', status: 'Ativado', color: 'text-emerald-400' },
                     { name: 'Agente Cibersegurança', status: 'Ativado', color: 'text-emerald-400' },
                     { name: 'Agente Carreira', status: 'Upgrade', color: 'text-amber-400' },
                     { name: 'Agente ENEM', status: 'Adicionar', color: 'text-blue-400' }
                   ].map((ag, i) => (
                     <div key={i} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl hover:border-slate-700 transition-colors">
                        <h4 className="font-bold text-lg mb-4">{ag.name}</h4>
                        <span className={`text-xs font-bold uppercase tracking-wider ${ag.color}`}>{ag.status}</span>
                     </div>
                   ))}
                </div>
             </div>
          )}

          {activeTab === 'career' && (
             <CareerDashboardPro tenantId={tenantId} alunoId="demo-aluno-id" />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
           <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-3xl border border-indigo-500/30 shadow-lg">
              <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-4">Métricas de Sistema Operacional</h3>
              <div className="space-y-5">
                 <div>
                    <span className="text-[10px] text-slate-400 block mb-1">AUTOPILOT CONFIDENCE</span>
                    <span className="text-2xl font-bold text-white">94%</span>
                 </div>
                 <div>
                    <span className="text-[10px] text-slate-400 block mb-1">CREDENCIAIS EMITIDAS HUB DO MERCADO</span>
                    <span className="text-2xl font-bold text-white">12,403</span>
                 </div>
                 <div>
                    <span className="text-[10px] text-slate-400 block mb-1">HORAS EM SIMULATION LAB</span>
                    <span className="text-2xl font-bold text-white">450h</span>
                 </div>
              </div>
           </div>

           <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Cross-Institution Global Rank</h3>
               <div className="space-y-3">
                 <div className="flex justify-between text-sm py-2 border-b border-white/5">
                   <span className="text-slate-300">Empregabilidade</span>
                   <span className="font-mono text-emerald-400">#4</span>
                 </div>
                 <div className="flex justify-between text-sm py-2 border-b border-white/5">
                   <span className="text-slate-300">Projetos Tech</span>
                   <span className="font-mono text-emerald-400">#1</span>
                 </div>
               </div>
           </div>
        </div>

      </div>
    </div>
  );
};
