// src/components/edujarvis/EduJarvisIntelligencePlatform.tsx
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Database, 
  TrendingUp, 
  BrainCircuit, 
  Users, 
  Search, 
  BarChart3, 
  Zap, 
  CheckCircle2, 
  Activity,
  Globe
} from "lucide-react";
import { Button } from "../ui/Button";

interface Props {
  tenantId: string;
}

export const EduJarvisIntelligencePlatform: React.FC<Props> = ({ tenantId }) => {
  const [summary, setSummary] = useState<any>(null);
  const [strategicReport, setStrategicReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'lake' | 'bench' | 'personal' | 'improvement'>('lake');

  async function loadDataLakeSummary() {
    setLoading(true);
    try {
      const response = await fetch(`/api/phase11/data-lake/${tenantId}/summary`);
      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function generateStrategicReport() {
    setLoading(true);
    try {
      const response = await fetch(`/api/phase11/strategic-decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantName: "Instituição Enterprise",
          period: "Março 2026",
          indicators: summary || { events: 1240, successRate: 0.85, engagement: 0.92 }
        })
      });
      const data = await response.json();
      setStrategicReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-600 rounded-xl">
             <BrainCircuit className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Intelligence <span className="text-indigo-600">Platform</span></h1>
            <p className="text-slate-500 text-sm">Central estratégica de inteligência educacional global e aprimoramento contínuo.</p>
          </div>
        </div>
      </header>

      {/* Control Tabs */}
      <div className="flex gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200 mb-8 max-w-2xl">
        {[
          { id: 'lake', label: 'Data Lake', icon: Database },
          { id: 'bench', label: 'Benchmarks', icon: Globe },
          { id: 'personal', label: 'Personalization', icon: Zap },
          { id: 'improvement', label: 'Auto-Improve', icon: TrendingUp }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Intelligence Zone */}
        <div className="lg:col-span-2 space-y-8">
          
          {activeTab === 'lake' && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Database className="w-32 h-32" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  Education Data Lake Indexer
                </h3>
                <p className="text-slate-500 text-sm mb-6 max-w-lg">
                  Captura de eventos em tempo real para alimentação de modelos de ML e padrões pedagógicos.
                </p>
                <div className="flex gap-3">
                  <Button onClick={loadDataLakeSummary} disabled={loading} className="bg-indigo-600">
                    <Search className="w-4 h-4 mr-2" /> Indexar Data Lake
                  </Button>
                  <Button variant="outline" onClick={generateStrategicReport} disabled={loading}>
                    <BarChart3 className="w-4 h-4 mr-2" /> Analisar Estrategicamente
                  </Button>
                </div>
              </div>

              {summary && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <h4 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" /> Eventos Agregados
                      </h4>
                      <div className="space-y-3">
                        {summary.map((evt: any, i: number) => (
                          <div key={i} className="flex justify-between items-center text-xs py-2 border-b border-slate-50">
                            <span className="text-slate-600 font-medium font-mono">{evt.eventType}</span>
                            <span className="text-slate-400">{new Date(evt.createdAt?.seconds * 1000).toLocaleTimeString()}</span>
                          </div>
                        ))}
                      </div>
                   </div>
                   <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
                      <h4 className="font-bold mb-4 text-sm text-indigo-300">Resumo de Atividade</h4>
                      <div className="space-y-6">
                         <div className="flex justify-between items-end">
                            <div>
                               <div className="text-3xl font-bold">12,4k</div>
                               <div className="text-[10px] text-slate-400 uppercase tracking-widest">Eventos este mês</div>
                            </div>
                            <div className="text-emerald-400 text-sm font-bold flex items-center">
                               +22% <TrendingUp className="w-3 h-3 ml-1" />
                            </div>
                         </div>
                         <div className="w-full h-1.5 bg-slate-800 rounded-full">
                            <div className="w-3/4 h-full bg-indigo-500"></div>
                         </div>
                      </div>
                   </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'improvement' && (
            <div className="space-y-6">
               <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    Auto-Improvement Loop (ML Lifecycle)
                  </h3>
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl mb-6">
                    <p className="text-xs text-emerald-800 font-medium">
                      Atualmente rodando 3 experimentos de otimização de prompt tutor para o curso de Tecnologia.
                    </p>
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: 'Otimização Socrática', metric: 'Engagement', variantA: 0.72, variantB: 0.89, winner: 'B' },
                      { name: 'Redução de Alucinação', metric: 'Accuracy', variantA: 0.95, variantB: 0.94, winner: 'A' },
                    ].map((exp, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{exp.name}</h4>
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Target: {exp.metric}</span>
                        </div>
                        <div className="flex items-center gap-6">
                           <div className="text-center">
                              <div className="text-xs text-slate-400">Variant A</div>
                              <div className="text-sm font-bold">{exp.variantA * 100}%</div>
                           </div>
                           <div className="text-center">
                              <div className="text-xs text-slate-400">Variant B</div>
                              <div className="text-sm font-bold text-indigo-600">{exp.variantB * 100}%</div>
                           </div>
                           <Button size="sm" variant="primary" className="h-8 text-xs bg-emerald-600">
                             <CheckCircle2 className="w-4 h-4 mr-1" /> Promover {exp.winner}
                           </Button>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <h4 className="text-slate-900 font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Relatório Estratégico (IA)
            </h4>
            {strategicReport ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                   <h5 className="text-[10px] font-bold text-indigo-800 uppercase mb-2">Urgência Máxima</h5>
                   <p className="text-sm text-indigo-900">{strategicReport.topUrgency}</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                   <h5 className="text-[10px] font-bold text-emerald-800 uppercase mb-2">Sugestão de Investimento</h5>
                   <p className="text-sm text-emerald-900">{strategicReport.investmentSuggestion}</p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                   <span className="text-xs text-slate-400 font-bold uppercase">Curriculum Health</span>
                   <span className="text-lg font-bold text-indigo-600">{strategicReport.curriculumHealth}%</span>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <BarChart3 className="w-12 h-12 mb-2 opacity-20" />
                <p className="text-xs">Aguardando dados para análise estratégica...</p>
              </div>
            )}
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
             <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-4">Mastery Network</h4>
             <div className="space-y-4">
                {[
                  { mentor: 'Mentor de Lógica', status: 'Online', users: 124 },
                  { mentor: 'Mentor de Java', status: 'Online', users: 89 },
                  { mentor: 'Mentor de DB', status: 'Offline', users: 0 }
                ].map((m, i) => (
                  <div key={i} className="flex justify-between items-center text-xs py-1">
                    <span className="text-slate-300">{m.mentor}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${m.status === 'Online' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-500'}`}>
                      {m.status}
                    </span>
                  </div>
                ))}
             </div>
             <Button variant="outline" className="w-full mt-6 bg-white/5 border-white/10 text-white hover:bg-white/10 text-xs">
               Gerenciar Mentores
             </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
