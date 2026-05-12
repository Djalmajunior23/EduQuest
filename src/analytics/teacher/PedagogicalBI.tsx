// src/modules/teacher/bi/PedagogicalBI.tsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
  AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, Users, Brain, ShieldAlert, 
  Lightbulb, CheckCircle2, AlertTriangle, Bot, 
  Download, Zap, Activity, Info, ChevronRight,
  Target, Microscope, Binary
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChartContainer } from '../../components/charts/ChartContainer';
import { BIService, BIAnalysis } from '../../services/BIService';
import { useAuth } from '../../lib/AuthContext';
import { useTenant } from '../../lib/TenantContext';
import { cn } from '../../lib/utils';
import { normalizeArray } from '../../utils/normalizeArray';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function PedagogicalBI() {
  const { profile } = useAuth();
  const { tenant } = useTenant();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<BIAnalysis | null>(null);
  const [selectedTurma, setSelectedTurma] = useState('TURMA-A-2024');
  const [showTriModal, setShowTriModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const result = await BIService.analyzeTurma(selectedTurma, tenant?.id || 'public');
        setAnalysis(result);
      } catch (error) {
        setAnalysis({
          turmaId: selectedTurma,
          totalAlunos: 32,
          mediaProficiencia: 1.2,
          alunosEmRisco: 4,
          conteudosCriticos: ['Circuitos Elétricos', 'Eletrônica Digital', 'Lógica de Programação'],
          competenciasFrageis: ['Resolução de Problemas', 'Pensamento Analítico'],
          questoesMalCalibradas: ['Q-102', 'Q-405'],
          recomendacoes: [
            "Aplicar aula invertida sobre Gate Logic para os alunos do grupo de risco.",
            "Revisar o simulado de Circuitos: as questões de nível 'Médio' apresentam taxa de erro incoerente.",
            "Agendar oficina prática para reforçar a competência de Montagem de Sistemas."
          ]
        });
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    }
    loadData();
  }, [tenant, selectedTurma]);

  if (loading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-white space-y-6">
        <div className="relative">
           <Binary className="w-12 h-12 text-indigo-600 animate-pulse" />
           <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-ping" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Sincronizando Heurísticas...</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Processando Amostra Sigma // TRI</p>
        </div>
      </div>
    );
  }

  const skillData = [
    { subject: 'Teoria', A: 120, B: 110, fullMark: 150 },
    { subject: 'Prática', A: 98, B: 130, fullMark: 150 },
    { subject: 'Segurança', A: 86, B: 130, fullMark: 150 },
    { subject: 'Inovação', A: 99, B: 100, fullMark: 150 },
    { subject: 'Cooperação', A: 85, B: 90, fullMark: 150 },
  ];

  const triGrowth = [
    { week: 'Sem 1', prof: 0.8 },
    { week: 'Sem 2', prof: 0.95 },
    { week: 'Sem 3', prof: 1.1 },
    { week: 'Sem 4', prof: 1.25 },
    { week: 'Sem 5', prof: 1.2 },
    { week: 'Sem 6', prof: 1.4 },
  ];

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 font-sans space-y-10">
      {/* Precision Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-2 rounded-xl text-indigo-400 shadow-xl">
              <Microscope className="w-5 h-5" />
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Núcleo de Inteligência Pedagógica</h2>
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
            Análise <span className="text-indigo-600">Sigma</span> TRI
          </h1>
          <p className="text-slate-500 font-medium max-w-xl">Mapeamento de proficiência latente e calibração de itens via Teoria de Resposta ao Item.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <select 
            value={selectedTurma}
            onChange={(e) => setSelectedTurma(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 font-black uppercase text-[10px] tracking-widest text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm transition-all"
          >
            <option value="TURMA-A-2024">Turma A - Eletrotécnica</option>
            <option value="TURMA-B-2024">Turma B - Mecatrônica</option>
          </select>
          <button className="bg-slate-900 text-white p-3.5 rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Sigma Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <SigmaCard 
          label="Proficiência Média (θ)" 
          value={analysis?.mediaProficiencia.toFixed(2) || "0.00"}
          sub="Theta Elevado"
          icon={Brain}
          color="indigo"
          trend="+8.4%"
        />
        <SigmaCard 
          label="Alunos em Risco" 
          value={analysis?.alunosEmRisco.toString() || "0"}
          sub="Intervenção Necessária"
          icon={AlertTriangle}
          color="rose"
          isAlert={analysis && analysis.alunosEmRisco > 0}
        />
        <SigmaCard 
          label="Coerência Global" 
          value="88.2%"
          sub="Baixo Ruído Sigma"
          icon={Activity}
          color="emerald"
        />
        <SigmaCard 
          label="Sessões Ativas" 
          value="1.4k"
          sub="Engajamento Nominal"
          icon={Zap}
          color="amber"
          trend="+22%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Analysis Chart */}
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-2xl shadow-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Binary className="w-48 h-48 text-indigo-600" />
              </div>
              <div className="relative z-10">
                 <div className="flex items-center justify-between mb-12">
                    <div>
                       <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900">Curva de Evolução (θ)</h3>
                       <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Desenvolvimento de Habilidades Longitudinais</p>
                    </div>
                    <button 
                       onClick={() => setShowTriModal(true)}
                       className="flex items-center gap-2 px-6 py-2.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all"
                    >
                       <Info className="w-4 h-4" /> Entenda a TRI
                    </button>
                 </div>
                 <div className="h-[350px] min-h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={normalizeArray(triGrowth)} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                          <defs>
                             <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 900}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 900}} />
                          <Tooltip 
                             contentStyle={{borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                             itemStyle={{fontSize: '12px', fontWeight: 900}}
                          />
                          <Area type="monotone" dataKey="prof" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#colorProf)" />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>

           {/* Item Analysis Section */}
           <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Calibração de Itens // Alertas TRI</h3>
                 <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-[9px] font-black uppercase">Ruído Detectado</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {(analysis?.questoesMalCalibradas || ['Q-102', 'Q-405']).map((id, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm group hover:border-rose-300 transition-all">
                       <div className="flex justify-between items-start mb-4">
                          <code className="bg-slate-900 text-indigo-400 px-3 py-1 rounded-lg text-xs font-bold">{id}</code>
                          <ShieldAlert className="w-5 h-5 text-rose-500" />
                       </div>
                       <p className="text-[10px] font-black uppercase text-slate-900 mb-2">Item Mal Calibrado</p>
                       <p className="text-[10px] font-bold text-slate-400 leading-tight">Taxas de acerto inconsistentes com o nível de dificuldade estimado (θ).</p>
                    </div>
                 ))}
                 <div className="bg-indigo-600 p-6 rounded-[2rem] text-white flex flex-col justify-center items-center text-center space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest">Ação Corretiva</p>
                    <button className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all">
                       <Zap className="w-5 h-5" />
                    </button>
                    <p className="text-[9px] font-bold uppercase">Recalibrar Banco</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Sidebar Diagnostics */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-10">
                    <div className="bg-indigo-600 p-3 rounded-2xl">
                       <Bot className="w-6 h-6" />
                    </div>
                    <div>
                       <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400">Diagnosis Core</h3>
                       <p className="text-[9px] font-bold text-slate-500">EduJarvis Logic Engine</p>
                    </div>
                 </div>

                 <div className="space-y-6 mb-12">
                    {analysis?.recomendacoes.map((rec, i) => (
                       <div key={i} className="flex gap-4 group">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                          <p className="text-sm font-medium text-slate-300 leading-relaxed group-hover:text-white transition-colors">{rec}</p>
                       </div>
                    ))}
                 </div>

                 <button className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-xl shadow-indigo-950 flex items-center justify-center gap-2">
                    Acionar Plano de Intervenção <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
           </div>

           <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Déficit de Competências</h3>
              <div className="h-[250px] min-h-[250px] w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={normalizeArray(skillData)}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{fontSize: 9, fill: '#94a3b8', fontWeight: 900}} />
                    <Radar dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
                    <Radar dataKey="B" stroke="#cbd5e1" fill="transparent" />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                 <div className="flex items-center justify-between text-[10px] font-black uppercase">
                    <span className="text-indigo-600">Turma Atual</span>
                    <span className="text-slate-300">Target SENAI</span>
                 </div>
                 <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-indigo-600 w-2/3" />
                    <div className="h-full bg-slate-200 w-1/3" />
                 </div>
              </div>
           </div>

           <div className="bg-indigo-600 rounded-[3rem] p-10 text-white relative group overflow-hidden">
              <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:rotate-12 transition-transform">
                 <Target className="w-48 h-48" />
              </div>
              <h3 className="text-xl font-black italic uppercase tracking-tighter mb-4">Geração de Trilhas</h3>
              <p className="text-xs text-indigo-100 font-medium leading-relaxed mb-10">
                 Crie trilhas adaptativas instantâneas para os grupos identificados com gap de proficiência.
              </p>
              <button className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">
                 Iniciar Maestro
              </button>
           </div>
        </div>
      </div>

      {/* Modal TRI */}
      <AnimatePresence>
        {showTriModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div 
               initial={{ scale: 0.9, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               className="bg-white rounded-[2rem] p-10 max-w-2xl w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setShowTriModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <Download className="w-6 h-6 rotate-45" />
              </button>

              <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tighter">O que é a TRI?</h2>
              <div className="space-y-6 text-slate-600 leading-relaxed">
                <p>
                  A **Teoria de Resposta ao Item (TRI)** não analisa apenas a quantidade de acertos, mas a **qualidade** e a **coerência** desses acertos.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <div className="font-black text-indigo-600 text-xs uppercase mb-2">Dificuldade (b)</div>
                    <p className="text-[10px] leading-tight">Posiciona a questão na régua de proficiência.</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <div className="font-black text-emerald-600 text-xs uppercase mb-2">Discriminação (a)</div>
                    <p className="text-[10px] leading-tight">Capacidade da questão de separar quem sabe de quem não sabe.</p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                    <div className="font-black text-amber-600 text-xs uppercase mb-2">Acerto Casual (c)</div>
                    <p className="text-[10px] leading-tight">Probabilidade de acertar chutando (Questões de múltipla escolha).</p>
                  </div>
                </div>

                <p className="bg-slate-900 text-indigo-400 p-6 rounded-2xl text-sm font-medium border-l-4 border-indigo-500 italic">
                  "Um aluno que acerta questões difíceis mas erra fáceis tem uma proficiência estimada menor do que aquele que segue o caminho lógico, devido à incoerência pedagógica."
                </p>
              </div>

              <button 
                onClick={() => setShowTriModal(false)}
                className="mt-10 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-indigo-600 transition-colors"
              >
                Entendi, voltar ao Dashboard
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SigmaCard({ label, value, sub, icon: Icon, color, trend, isAlert }: any) {
  return (
    <div className={cn(
      "bg-white p-8 rounded-[3rem] border-2 transition-all group relative overflow-hidden",
      isAlert ? "border-rose-100 shadow-rose-100 shadow-2xl" : "border-slate-50 shadow-slate-100 shadow-xl"
    )}>
      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity">
         <Icon className="w-20 h-20 text-slate-900" />
      </div>
      <div className="relative z-10 flex flex-col h-full">
         <div className="flex justify-between items-start mb-6">
            <div className={cn(
               "p-4 rounded-[1.5rem] shadow-inner",
               color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
               color === 'rose' ? 'bg-rose-50 text-rose-600' :
               color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
               'bg-amber-50 text-amber-600'
            )}>
               <Icon className="w-6 h-6" />
            </div>
            {trend && (
               <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                  {trend}
               </div>
            )}
         </div>
         <div className="mt-auto">
            <p className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 mb-1">{value}</p>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">{label}</h3>
            <div className={cn(
               "mt-6 text-[9px] font-black uppercase text-white px-3 py-1.5 rounded-xl inline-block",
               isAlert ? 'bg-rose-500' : 'bg-slate-900'
            )}>
               {sub}
            </div>
         </div>
      </div>
    </div>
  );
}
