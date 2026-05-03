import React, { useState } from 'react';
import { Network, Zap, Target, BookOpen, BarChart3, Database, ShieldCheck, Gamepad2, Brain, CheckCircle2, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/Button';

interface Props {
  tenantId: string;
}

export const HyperIntelligenceDashboard: React.FC<Props> = ({ tenantId }) => {
  const [activeTab, setActiveTab] = useState('orchestrator');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testFeature = async (endpoint: string, payload: any) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/phase13/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId, ...payload })
      });
      const data = await res.json();
      setResult(data.result);
    } catch (e) {
      console.error(e);
      setResult({ error: "Failed to load data" });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'orchestrator', label: 'HyperAgent', icon: Network },
    { id: 'planner', label: 'Auto Planner', icon: Target },
    { id: 'content', label: 'Content Factory', icon: BookOpen },
    { id: 'growth', label: 'Growth Engine', icon: TrendingUp },
    { id: 'sim', label: 'Immersive Sim', icon: Gamepad2 }
  ];

  return (
    <div className="bg-slate-950 min-h-screen p-8 text-slate-100">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold flex items-center justify-center gap-3">
          <Zap className="text-indigo-400 w-10 h-10" /> 
          Hyper Intelligence Platform
        </h1>
        <p className="text-slate-400 uppercase tracking-widest text-xs font-bold mt-2 border border-slate-800 bg-slate-900 inline-block px-3 py-1 rounded-full">
          EduJarvis Phase 13 Target Systems
        </p>
      </header>

      <div className="flex justify-center gap-3 mb-10 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => { setActiveTab(t.id); setResult(null); }}
            className={`px-6 py-3 rounded-full font-bold text-sm tracking-wide transition-all border flex items-center gap-2 ${activeTab === t.id ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'orchestrator' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="border border-slate-800 bg-slate-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]"></div>
                <h3 className="text-xl font-bold flex items-center gap-2 mb-4"><Network className="text-indigo-400" /> HyperAgent Orchestrator</h3>
                <p className="text-slate-400 text-sm mb-6">Processamento Multi-Agente Inteligente: Lesson Creator, Question Bank, Sim Lab e Assessment interconectados.</p>
                <Button 
                  disabled={loading}
                  onClick={() => testFeature('hyperagent/workflow', { 
                    userId: "admin-1", 
                    workflowType: "complete_lesson_pack", 
                    input: { tema: "Inteligência Artificial na Nuvem" } 
                  })}
                  className="bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                >
                  {loading ? 'Processando (Múltiplos Agentes)...' : 'Gerar Aula Completa (AI Cloud)'}
                </Button>
                {result && (
                  <div className="mt-6 p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                     <p className="text-xs text-indigo-400 mb-2 font-bold uppercase">Agentes Envolvidos:</p>
                     <div className="flex gap-2 flex-wrap mb-4">
                        {result.agentsUsed?.map((ag: string) => (
                           <span key={ag} className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-xs text-indigo-300">{ag}</span>
                        ))}
                     </div>
                     <p className="text-xs text-slate-500 mb-2 font-bold uppercase mt-4">Simulação Gerada (Preview):</p>
                     <pre className="text-xs text-emerald-400 bg-slate-900 p-4 rounded-xl overflow-x-auto">
                        {JSON.stringify(result.result?.simulation, null, 2)}
                     </pre>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'planner' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
               <div className="border border-slate-800 bg-slate-900 rounded-3xl p-8 shadow-2xl">
                 <h3 className="text-xl font-bold flex items-center gap-2 mb-4"><Target className="text-red-400" /> Autonomous Pedagogical Planner</h3>
                 <p className="text-slate-400 text-sm mb-6">Geração autônoma de planos didáticos com base nas necessidades contextuais da turma.</p>
                 <Button 
                   disabled={loading}
                   onClick={() => testFeature('planner/generator', { 
                     classId: "turma-xyz", 
                     topic: "Cibersegurança Defensiva",
                     durationWeeks: 4,
                     studentNeeds: ["Prática com terminal", "Entendimento de redes P2P"]
                   })}
                   className="bg-red-600 hover:bg-red-500 rounded-xl text-white"
                 >
                   Plan 4 Weeks - CyberSec
                 </Button>
                 {result && (
                   <div className="mt-6 p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                      <pre className="text-xs text-indigo-300 overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                   </div>
                 )}
               </div>
             </motion.div>
          )}

          {activeTab === 'content' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
               <div className="border border-slate-800 bg-slate-900 rounded-3xl p-8 shadow-2xl">
                 <h3 className="text-xl font-bold flex items-center gap-2 mb-4"><BookOpen className="text-amber-400" /> Intelligent Content Factory</h3>
                 <p className="text-slate-400 text-sm mb-6">Criando pacotes profundos e robustos no formato Aula, Exercícios, Projetos e Rubricas.</p>
                 <Button 
                   disabled={loading}
                   onClick={() => testFeature('content/factory', { 
                     teacherId: "teacher-123", 
                     theme: "React Hooks Avançados",
                     level: "Avançado"
                   })}
                   className="bg-amber-600 hover:bg-amber-500 rounded-xl text-white"
                 >
                   Generate Content Pack
                 </Button>
                 {result && (
                   <div className="mt-6 p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                      <pre className="text-xs text-indigo-300 overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                   </div>
                 )}
               </div>
             </motion.div>
          )}

          {activeTab === 'growth' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
               <div className="border border-slate-800 bg-slate-900 rounded-3xl p-8 shadow-2xl">
                 <h3 className="text-xl font-bold flex items-center gap-2 mb-4"><TrendingUp className="text-emerald-400" /> EduQuest Growth Engine</h3>
                 <p className="text-slate-400 text-sm mb-6">Saúde do SaaS, risco de churn e relatórios de upsell baseados em uso da IA.</p>
                 <Button 
                   disabled={loading}
                   onClick={() => testFeature('growth/analyze', { 
                     activeTenants: 154,
                     monthlyActiveUsers: 5400,
                     aiInteractions: 120500,
                     churnRiskTenants: 2,
                     averageUsagePerTenant: 85
                   })}
                   className="bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white"
                 >
                   Analyze Global SaaS Metrics
                 </Button>
                 {result && (
                   <div className="mt-6 p-6 bg-slate-950 border border-slate-800 rounded-2xl">
                      <div className="flex gap-10 items-center mb-6">
                        <div>
                           <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Health Score</p>
                           <p className="text-5xl font-black text-emerald-400">{result.healthScore}</p>
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-slate-300 mb-2 border-b border-slate-800 pb-2">Insights</h4>
                      <ul className="list-disc list-inside text-sm text-slate-400 mb-4">
                         {result.insights?.map((i: string, idx: number) => <li key={idx}>{i}</li>)}
                      </ul>
                      <h4 className="text-sm font-bold text-slate-300 mb-2 border-b border-slate-800 pb-2">Strategic Recommendations</h4>
                      <ul className="list-disc list-inside text-sm text-slate-400">
                         {result.recommendations?.map((i: string, idx: number) => <li key={idx}>{i}</li>)}
                      </ul>
                   </div>
                 )}
               </div>
             </motion.div>
          )}

          {activeTab === 'sim' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
               <div className="border border-slate-800 bg-slate-900 rounded-3xl p-8 shadow-2xl">
                 <h3 className="text-xl font-bold flex items-center gap-2 mb-4"><Gamepad2 className="text-blue-400" /> Immersive Sim Engine</h3>
                 <p className="text-slate-400 text-sm mb-6">Laboratórios Virtuais Baseados em RPG e Cenários Reais.</p>
                 <Button 
                   disabled={loading}
                   onClick={() => testFeature('simulation/immersive', { 
                     type: "Cibersegurança Forense",
                     difficulty: "Hard",
                     competencies: ["Análise de Logs", "Mapeamento de Threat Actor"]
                   })}
                   className="bg-blue-600 hover:bg-blue-500 rounded-xl text-white"
                 >
                   Deploy Sandbox Scenario
                 </Button>
                 {result && (
                   <div className="mt-6 p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                      <pre className="text-xs text-indigo-300 overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                   </div>
                 )}
               </div>
             </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
