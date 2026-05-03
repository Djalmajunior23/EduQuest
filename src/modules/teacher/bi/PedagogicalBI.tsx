import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, Brain, ShieldAlert, 
  Lightbulb, CheckCircle2, AlertTriangle, FileText, Bot, Info,
  Search, Filter, Download, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BIService, BIAnalysis } from '../../../services/edujarvis/BIService';
import { useAuth } from '../../../lib/AuthContext';
import { useTenant } from '../../../lib/TenantContext';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function PedagogicalBI() {
  const { user } = useAuth();
  const { tenant } = useTenant();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<BIAnalysis | null>(null);
  const [selectedTurma, setSelectedTurma] = useState('TURMA-A-2024'); // Mock default
  const [showTriModal, setShowTriModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!user || !tenant) return;
      setLoading(true);
      try {
        // Encenando uma análise (em produção usaria IDs reais das turmas do professor)
        const result = await BIService.analyzeTurma(selectedTurma, tenant.id);
        setAnalysis(result);
      } catch (error) {
        console.error("Erro ao carregar BI:", error);
        // Fallback mock para demonstração se não houver registros no Supabase
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
            "Revisar o simulado de Circuitos, as questões de nível 'Médio' apresentam taxa de erro incoerente.",
            "Agendar oficina prática para reforçar a competência de Montagem de Sistemas."
          ]
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user, tenant, selectedTurma]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <h2 className="text-lg font-bold text-slate-800">Processando Cubo de BI Inteligente...</h2>
          <p className="text-sm text-slate-500">Calculando métricas TRI e proficiência das turmas</p>
        </div>
      </div>
    );
  }

  // Mock data para gráficos (baseado na análise)
  const skillData = [
    { subject: 'Teoria', A: 120, B: 110, fullMark: 150 },
    { subject: 'Prática', A: 98, B: 130, fullMark: 150 },
    { subject: 'Segurança', A: 86, B: 130, fullMark: 150 },
    { subject: 'Inovação', A: 99, B: 100, fullMark: 150 },
    { subject: 'Trabalho em Equipe', A: 85, B: 90, fullMark: 150 },
  ];

  const triGrowth = [
    { week: 'Sem 1', prof: 0.8 },
    { week: 'Sem 2', prof: 0.95 },
    { week: 'Sem 3', prof: 1.1 },
    { week: 'Sem 4', prof: 1.25 },
    { week: 'Sem 5', prof: 1.2 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-1">
            <Zap className="w-4 h-4" />
            NexusInt BI Inteligente
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Análise Pedagógica & TRI</h1>
          <p className="text-slate-500 font-medium">Diagnóstico automatizado baseado em proficiência latente</p>
        </div>

        <div className="flex items-center gap-2">
          <select 
            value={selectedTurma}
            onChange={(e) => setSelectedTurma(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="TURMA-A-2024">Turma A - 2024 (Eletrotécnica)</option>
            <option value="TURMA-B-2024">Turma B - 2024 (Mecatrônica)</option>
          </select>
          <button className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Grid de Cards Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <BIStatCard 
          label="Proficiência Média (TRI)" 
          value={analysis?.mediaProficiencia.toFixed(2) || "0.00"}
          subText="Acima da média estadual"
          icon={Brain}
          trend="+12%"
          color="indigo"
        />
        <BIStatCard 
          label="Alunos em Risco" 
          value={analysis?.alunosEmRisco.toString() || "0"}
          subText="Necessitam intervenção"
          icon={AlertTriangle}
          isRisk={analysis && analysis.alunosEmRisco > 0}
          color="rose"
        />
        <BIStatCard 
          label="Coerência Pedagógica" 
          value="88%"
          subText="Respostas consistentes"
          icon={CheckCircle2}
          color="emerald"
        />
        <BIStatCard 
          label="Engajamento Geral" 
          value="74%"
          subText="Tempo médio: 42min/sessão"
          icon={Users}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico de Evolução TRI */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-indigo-500" />
              Evolução da Proficiência (Theta)
            </h3>
            <button 
              onClick={() => setShowTriModal(true)}
              className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
            >
              <Info className="w-4 h-4" />
              O que é TRI?
            </button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={triGrowth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Line type="monotone" dataKey="prof" stroke="#6366f1" strokeWidth={4} dot={{r: 6, fill: '#6366f1', strokeWidth: 0}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Diagnóstico do EduJarvis */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Bot className="w-40 h-40" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-500 p-2 rounded-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-widest text-indigo-400">Diagnosis Central</h3>
            </div>

            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              O modelo de IA analisou {analysis?.totalAlunos} padrões de resposta e identificou os seguintes pontos críticos para sua turma:
            </p>

            <div className="space-y-4 mb-8">
              {analysis?.recomendacoes.map((rec, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="flex gap-4 items-start bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <Lightbulb className="w-5 h-5 text-amber-400 shrink-0" />
                  <p className="text-sm font-medium text-slate-200">{rec}</p>
                </motion.div>
              ))}
            </div>

            <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-indigo-600/20 transition-all">
              Gerar Plano de Intervenção
            </button>
          </div>
        </div>

        {/* Competências Frágeis */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm lg:col-span-1">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            Gap de Competências
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{fontSize: 10, fill: '#64748b'}} />
                <Radar name="Turma A" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                <Radar name="Meta SENAI" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conteúdos com maior dificuldade */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm lg:col-span-1">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Conteúdos Críticos</h3>
          <div className="space-y-6">
            {analysis?.conteudosCriticos.map((content, i) => (
              <div key={i} className="group">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-slate-700">{content}</span>
                  <span className="text-rose-500 font-black">-{40 - i * 5}% acertos</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(150 + i * 20) / 3}%` }}
                    className="h-full bg-rose-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alunos que precisam de apoio */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm lg:col-span-1">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-500" />
            Alunos (Risco Acadêmico)
          </h3>
          <div className="space-y-4">
             {['Arthur Silva', 'Beatriz Santos', 'Carlos Eduardo', 'Diana Lima'].map((name, i) => (
               <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs">
                      {name[0]}
                    </div>
                    <span className="text-sm font-bold text-slate-700">{name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black text-rose-500 uppercase">Proficiência -1.{i}</div>
                    <div className="text-[10px] text-slate-400">Risco Alto</div>
                  </div>
               </div>
             ))}
          </div>
          <button 
            onClick={async () => {
              // Simulação de geração de plano
              alert("Gerando Plano de Estudo Individualizado via ProfessorIA...");
            }}
            className="w-full mt-6 text-sm font-bold text-indigo-600 py-3 border-t border-slate-100 italic hover:text-indigo-800 transition-colors"
          >
            Gerar Plano de Estudo Automático &rarr;
          </button>
        </div>

        {/* Análise por Questão */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm lg:col-span-3">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Filter className="w-6 h-6 text-indigo-500" />
              Análise de Itens (TRI)
            </h3>
            <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase">Calibração de questões</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {analysis?.questoesMalCalibradas.length === 0 ? (
              <div className="col-span-4 p-8 text-center bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 flex items-center justify-center gap-2 font-bold">
                <CheckCircle2 className="w-5 h-5" />
                Todas as questões da avaliação estão bem calibradas de acordo com a TRI.
              </div>
            ) : (
              analysis?.questoesMalCalibradas.map((qid, i) => (
                <div key={i} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-black text-rose-600 text-xs">{qid}</span>
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                  </div>
                  <p className="text-[10px] font-bold text-rose-700 uppercase mb-1">Questão Mal Calibrada</p>
                  <p className="text-[9px] text-rose-600 leading-tight">Alta taxa de acerto em questão de dificuldade elevada.</p>
                </div>
              ))
            )}
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

function BIStatCard({ label, value, subText, icon: Icon, trend, isRisk, color }: any) {
  const themes: any = {
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    rose: 'text-rose-600 bg-rose-50 border-rose-100',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    amber: 'text-amber-600 bg-amber-50 border-amber-100',
  };

  const theme = themes[color] || themes.indigo;

  return (
    <div className={`bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group transition-all hover:border-indigo-300`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${theme.split(' ')[1]} ${theme.split(' ')[0]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </div>
        )}
      </div>
      
      <div>
        <div className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{value}</div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</div>
      </div>

      <div className={`mt-4 text-[10px] font-bold py-1 px-2 rounded-lg inline-block ${isRisk ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
        {subText}
      </div>
    </div>
  );
}
