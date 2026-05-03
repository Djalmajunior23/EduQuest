// src/components/edujarvis/EnterpriseCommandCenter.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Cpu, 
  Activity, 
  Settings, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Layers, 
  BarChart3,
  Key
} from 'lucide-react';
import { Button } from '../ui/Button';

export const EnterpriseCommandCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'plugins' | 'security'>('overview');
  const [approvals, setApprovals] = useState<any[]>([]);

  // Dados Mockados para demonstração da interface Enterprise
  const metrics = {
    creditUsage: 78,
    avgLatency: '420ms',
    avgQualityScore: 92,
    securityIncidents: 0
  };

  const pendingApprovals = [
    { id: '1', type: 'critical_report', requestedBy: 'Prof. Marcos', content: 'Relatório Disciplinar do Aluno João Silva', priority: 'High' },
    { id: '2', type: 'student_risk_alert', requestedBy: 'Jarvis Core', content: 'Intervenção de Risco de Evasão (Grupo A)', priority: 'Critical' }
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-blue-600" />
          EduJarvis Command Center
          <span className="ml-3 px-2 py-1 text-xs font-mono bg-blue-100 text-blue-700 rounded uppercase">Enterprise v10</span>
        </h1>
        <p className="text-slate-500 mt-2">Governança, observabilidade e controle centralizado de inteligência artificial.</p>
      </header>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Uso de Créditos', value: `${metrics.creditUsage}%`, icon: Cpu, color: 'text-amber-600' },
          { label: 'Latência Média', value: metrics.avgLatency, icon: Activity, color: 'text-green-600' },
          { label: 'Score Pedagógico', value: `${metrics.avgQualityScore}/100`, icon: BarChart3, color: 'text-blue-600' },
          { label: 'Segurança', value: '100% Safe', icon: ShieldCheck, color: 'text-emerald-600' }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-4 rounded-xl shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">{item.label}</span>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div className="text-2xl font-bold mt-2 text-slate-900">{item.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        {(['overview', 'approvals', 'plugins', 'security'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'approvals' && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-semibold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  Aprovações Pendentes (Human-in-the-Loop)
                </h3>
              </div>
              <div className="divide-y divide-slate-100">
                {pendingApprovals.map(req => (
                  <div key={req.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                          req.priority === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {req.priority}
                        </span>
                        <span className="text-sm font-medium text-slate-900">{req.content}</span>
                      </div>
                      <p className="text-xs text-slate-500">Solicitado por: {req.requestedBy}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <XCircle className="w-4 h-4 mr-1" /> Rejeitar
                      </Button>
                      <Button size="sm" variant="primary" className="bg-emerald-600 hover:bg-emerald-700">
                        <CheckCircle className="w-4 h-4 mr-1" /> Aprovar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'overview' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Saúde dos Agentes (MLOps Monitoring)
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'TutorAgent', status: 'Optimal', performance: 98, load: 'Low' },
                  { name: 'SafetyGuard', status: 'Optimal', performance: 100, load: 'High' },
                  { name: 'AssessmentAgent', status: 'Good', performance: 85, load: 'Medium' }
                ].map((agent, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/30">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                      <span className="font-medium text-slate-700">{agent.name}</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <span className="text-slate-500">Health: <span className="text-emerald-600 font-bold">{agent.performance}%</span></span>
                      <span className="text-slate-400">Load: {agent.load}</span>
                      <Button size="sm" variant="outline" className="h-7 text-[10px]">Config</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'plugins' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Simulados ENEM', desc: 'Base de 4.000 questões calibradas.', active: true },
                { name: 'API de Notas Externa', desc: 'Sincronização com ERP acadêmico.', active: false },
                { name: 'Relatórios GESTÃO', desc: 'Dashboard avançado para diretores.', active: true },
                { name: 'IA Psicotécnica', desc: 'Análise de comportamento emocional.', active: false }
              ].map((plugin, i) => (
                <div key={i} className={`p-4 rounded-xl border border-dashed transition-all ${
                  plugin.active ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200 bg-white opacity-60'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <Layers className={`w-6 h-6 ${plugin.active ? 'text-blue-600' : 'text-slate-400'}`} />
                    <div className={`w-8 h-4 rounded-full relative ${plugin.active ? 'bg-blue-600 text-blue-600' : 'bg-slate-300'}`}>
                      <div className={`absolute w-3 h-3 bg-white rounded-full top-0.5 transition-all ${plugin.active ? 'right-0.5' : 'left-0.5'}`}></div>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900">{plugin.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{plugin.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Cpu className="w-16 h-16" />
             </div>
             <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">SaaS Management</h4>
             <div className="mb-6">
               <div className="text-3xl font-bold mb-1">R$ 12.450</div>
               <p className="text-xs text-slate-400">Total de créditos consumidos este mês</p>
             </div>
             <div className="space-y-3">
               <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-blue-500"></div>
               </div>
               <div className="flex justify-between text-xs font-mono">
                 <span>PLAN: ENTERPRISE</span>
                 <span>75% LIMIT</span>
               </div>
             </div>
             <Button variant="primary" className="w-full mt-6 bg-blue-600 hover:bg-blue-700 border-none">
               Gerenciar Faturamento
             </Button>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
             <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm">
               <Key className="w-4 h-4 text-slate-500" />
               Public API Keys
             </h4>
             <div className="space-y-2">
               <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                 <code className="text-[10px] text-slate-600">sk_live_...4r2d</code>
                 <Button size="sm" variant="outline" className="h-6 text-[10px] px-2 uppercase">Revocar</Button>
               </div>
               <Button size="sm" variant="outline" className="w-full h-8 text-xs border-dashed text-slate-500">
                 + Gerar Nova Chave
               </Button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};
