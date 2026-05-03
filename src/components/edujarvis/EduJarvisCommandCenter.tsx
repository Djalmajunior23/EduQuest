// src/components/edujarvis/EduJarvisCommandCenter.tsx
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  Activity, 
  ShieldAlert, 
  TrendingUp, 
  FileText, 
  Zap, 
  Globe,
  Bell,
  Cpu,
  BarChart3,
  Search,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function EduJarvisCommandCenter() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'agents' | 'observability' | 'saas'>('dashboard');

  const stats = [
    { label: "Interações Totais", value: "142.8k", change: "+12%", icon: Activity, color: "text-blue-600" },
    { label: "Custo Estimado", value: "$42.10", change: "-5%", icon: TrendingUp, color: "text-green-600" },
    { label: "Taxa de Bloqueio", value: "0.2%", change: "0%", icon: ShieldAlert, color: "text-red-600" },
    { label: "Latência Média", value: "1.8s", change: "-0.4s", icon: Zap, color: "text-purple-600" },
  ];

  const agents = [
    { name: "TutorIA", status: "online", load: "High", success: "99.8%", cost: "$12.4" },
    { name: "ProfessorIA", status: "online", load: "Medium", success: "99.5%", cost: "$8.2" },
    { name: "CoordinatorIA", status: "online", load: "Low", success: "100%", cost: "$0.4" },
    { name: "AssessmentIA", status: "online", load: "Medium", success: "98.2%", cost: "$15.1" },
    { name: "MarketplaceIA", status: "online", load: "Low", success: "99.9%", cost: "$0.1" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center">
              <Cpu className="mr-3 text-blue-600" />
              EduJarvis <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Phase 08</span>
            </h1>
            <p className="text-gray-500 mt-1">Centro de Comando e Observabilidade IA</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                <Globe className="w-4 h-4 mr-2 text-gray-400" />
                SaaS Config
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 rounded-xl text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                <Bell className="w-4 h-4 mr-2" />
                Alertas IA
            </button>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-2xl border border-gray-200 mb-8 w-fit shadow-sm">
          {[
            { id: 'dashboard', label: 'Dashboard General', icon: LayoutDashboard },
            { id: 'agents', label: 'Agentes & Qualidade', icon: CheckCircle2 },
            { id: 'observability', label: 'Monitoramento & Custo', icon: BarChart3 },
            { id: 'saas', label: 'Tenant Management', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gray-50 ${stat.color}`}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          stat.change.startsWith('+') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                      <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Agents Monitor */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-gray-900">Status dos Agentes</h3>
                      <button className="text-sm font-semibold text-blue-600 hover:underline">Ver tudo</button>
                    </div>
                    <div className="space-y-4">
                      {agents.map((agent, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-4"></div>
                            <div>
                                <span className="font-semibold text-gray-900">{agent.name}</span>
                                <p className="text-xs text-gray-500">{agent.load} usage</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-bold text-gray-900">{agent.success}</span>
                            <p className="text-xs text-gray-400">Success Rate</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Critical Issues (Phase 08 - Coordinator AI) */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-gray-900">Alertas da Coordenação IA</h3>
                      <div className="flex bg-orange-50 px-3 py-1 rounded-lg text-orange-700 text-xs font-bold items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        4 Pendentes
                      </div>
                    </div>
                    <div className="space-y-4">
                      {[
                        { title: "Gargalo em Lógica (Turma A)", detail: "80% dos alunos travaram na fase 3." },
                        { title: "Risco de Evasão Detectado", detail: "5 alunos inativos por 3 dias." },
                        { title: "Relatório Mensal Disponível", detail: "Geração automática concluída." },
                        { title: "Intervenção Sugerida", detail: "Nova trilha de reforço para Python." }
                      ].map((item, i) => (
                        <div key={i} className="group p-4 border border-gray-100 rounded-xl hover:border-blue-100 hover:bg-blue-50 transition-all cursor-pointer">
                          <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{item.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">{item.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'agents' && (
              <div className="bg-white min-h-[400px] rounded-2xl border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
                <Activity className="w-16 h-16 text-blue-100 mb-4" />
                <h3 className="text-xl font-bold text-gray-900">Interface de Qualidade dos Agentes</h3>
                <p className="text-gray-500 mt-2 max-w-md">Painel detalhado para análise de veracidade, tom de voz e satisfação dos usuários com as respostas geradas.</p>
              </div>
            )}
            
            {activeTab === 'observability' && (
              <div className="bg-white min-h-[400px] rounded-2xl border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
                <Zap className="w-16 h-16 text-purple-100 mb-4" />
                <h3 className="text-xl font-bold text-gray-900">Custo & Tokens em Tempo Real</h3>
                <p className="text-gray-500 mt-2 max-w-md">Monitoramento de infraestrutura. Visualize o consumo de tokens por agente e tenant para otimização de margem SaaS.</p>
              </div>
            )}

            {activeTab === 'saas' && (
              <div className="bg-white min-h-[400px] rounded-2xl border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
                <Settings className="w-16 h-16 text-gray-100 mb-4" />
                <h3 className="text-xl font-bold text-gray-900">Configuração de Tenants</h3>
                <p className="text-gray-500 mt-2 max-w-md">Personalize o EduJarvis para cada cliente. Ative/Desative módulos, mude o nome do assistente e ajuste o nível de segurança.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
