import { api } from '../lib/api';


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {   User, 
  TrendingUp, 
  AlertCircle, 
  Target, 
  Award, 
  BookOpen, 
  History, 
  Zap, 
  Brain,
  ChevronLeft,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Calendar
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { predictStudentRisk } from '../services/aiAssistantService';export default function StudentDossier() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (studentId) fetchStudentData();
  }, [studentId]);

  const fetchStudentData = async () => {
    try {
      const { data, error } = await api
        .from('usuarios')
        .select('*')
        .eq('id', studentId!)
        .maybeSingle();
      
      if (error) throw error;
      setStudent(data);
    } catch (error) {
      console.error('Error fetching student:', error);
    } finally {
      setLoading(false);
    }
  };

  const runAiAnalysis = async () => {
    if (!student) return;
    setAnalyzing(true);
    try {
      // Fetch performance data for AI
      const { data: history, error } = await api
        .from('resultados')
        .select('*')
        .eq('student_id', student.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      const data = {
        profile: student,
        examHistory: history || [],
        engagement: {
          lastLogin: student.ultimo_login,
          totalTokens: student.saldo_tokens_ia
        }
      };

      const analysis = await predictStudentRisk(data);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('AI Analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center ring-4 ring-white shadow-sm overflow-hidden text-indigo-600 font-bold text-2xl">
            {student.foto_url ? <img src={student.foto_url} alt={student.nome} className="w-full h-full object-cover" /> : student.nome.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{student.nome}</h1>
            <p className="text-slate-500">{student.email} • {student.perfil}</p>
          </div>
        </div>
        <div className="ml-auto">
          <button 
            onClick={runAiAnalysis}
            disabled={analyzing}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 transition-all"
          >
            {analyzing ? <Loader2 className="w-5 h-5 animate-spin"/> : <Brain className="w-5 h-5" />}
            Gerar Análise Pedagógica IA
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column - Stats & Risks */}
        <div className="space-y-6">
          {/* Risk Card */}
          <div className={cn(
            "p-6 rounded-3xl border shadow-sm",
            aiAnalysis?.riskLevel === 'CRITICAL' ? "bg-red-50 border-red-100" :
            aiAnalysis?.riskLevel === 'HIGH' ? "bg-orange-50 border-orange-100" :
            aiAnalysis?.riskLevel === 'MEDIUM' ? "bg-amber-50 border-amber-100" :
            "bg-emerald-50 border-emerald-100"
          )}>
            <div className="flex justify-between items-start mb-4">
              <ShieldAlert className={cn(
                "w-8 h-8",
                aiAnalysis?.riskLevel === 'CRITICAL' || aiAnalysis?.riskLevel === 'HIGH' ? "text-red-500" : "text-emerald-500"
              )} />
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-black uppercase",
                aiAnalysis?.riskLevel === 'CRITICAL' || aiAnalysis?.riskLevel === 'HIGH' ? "bg-red-200 text-red-700" : "bg-emerald-200 text-emerald-700"
              )}>
                Risco {aiAnalysis?.riskLevel || 'BAIXO'}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Predição de Evasão</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {aiAnalysis?.reason || 'Carregue a análise para verificar vulnerabilidades pedagógicas e preditivas.'}
            </p>
          </div>

          {/* Core Metrics */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              Métricas de Desempenho
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1 uppercase">
                  <span>Média Geral</span>
                  <span>8.5</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[85%] rounded-full shadow-lg shadow-emerald-100" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1 uppercase">
                  <span>Engajamento</span>
                  <span>{student.saldo_tokens_ia > 500 ? '92%' : '45%'}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[92%] rounded-full shadow-lg shadow-indigo-100" />
                </div>
              </div>
            </div>
          </div>

          {/* Learning Profile */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-amber-500" />
              Perfil de Aprendizagem
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {['Visual', 'Cenestésico', 'Teórico', 'Prático'].map(style => (
                <div key={style} className={cn(
                  "p-3 rounded-2xl text-xs font-bold flex items-center gap-2 border",
                  aiAnalysis?.learningProfile?.includes(style) ? "bg-indigo-50 border-indigo-100 text-indigo-600" : "bg-slate-50 border-slate-100 text-slate-400"
                )}>
                  <div className="w-2 h-2 rounded-full bg-current" />
                  {style}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Tabs & Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
            {[
              { id: 'overview', label: 'Visão Geral', icon: Target },
              { id: 'technical', label: 'Evolução Técnica', icon: Award },
              { id: 'history', label: 'Histórico Completo', icon: History },
              { id: 'intervention', label: 'Intervenções', icon: AlertCircle }
            ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                    activeTab === tab.id ? "bg-slate-900 text-white shadow-xl shadow-slate-200" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm min-h-[500px] overflow-hidden">
            {activeTab === 'overview' && (
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-slate-900 border-l-4 border-indigo-500 pl-4">Predição de Dificuldade Futura</h4>
                    <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">
                      {aiAnalysis?.difficultyPrediction || "Aguardando análise de IA para projetar os próximos desafios do aluno basedo na Taxonomia de Bloom."}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-slate-900 border-l-4 border-emerald-500 pl-4">Sugestão de Intervenção Pró-ativa</h4>
                    <p className="text-slate-600 leading-relaxed bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                      {aiAnalysis?.suggestedIntervention || "Inicie a análise para receber sugestões de reforço adaptativo."}
                    </p>
                  </div>
                </div>

                <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  Evolução por Competência (Inteligência Educacional Interativa)
                </h4>
                <div className="space-y-6">
                  {['Lógica de Programação', 'Banco de Dados', 'Versionamento', 'Desenvolvimento Web'].map(comp => (
                    <div key={comp} className="group">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-slate-700">{comp}</span>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black text-slate-400 uppercase">Progresso Fundamental</span>
                           <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">EM DESENVOLVIMENTO</span>
                        </div>
                      </div>
                      <div className="h-4 bg-slate-100 rounded-2xl flex gap-1 p-1 shadow-inner">
                        <div className="h-full bg-emerald-400 w-1/4 rounded-xl shadow-sm" />
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '25%' }}
                          className="h-full bg-emerald-500 rounded-xl shadow-sm" 
                        />
                        <div className="h-full bg-slate-200 w-1/4 rounded-xl" />
                        <div className="h-full bg-slate-200 w-1/4 rounded-xl" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'technical' && (
              <div className="p-8 space-y-8">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-bold text-slate-900">Capacidades Técnicas vs Conhecimentos</h4>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-400"><div className="w-3 h-3 bg-indigo-500 rounded-sm"/> Conhecido</div>
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-400"><div className="w-3 h-3 bg-emerald-500 rounded-sm"/> Aplicado</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="bg-slate-50 p-4 rounded-3xl border border-slate-100 hover:border-indigo-200 transition-all cursor-pointer group">
                      <div className="flex items-center gap-1 text-[10px] font-black text-indigo-500 mb-2 uppercase tracking-widest">UC {i}</div>
                      <h5 className="font-bold text-slate-900 mb-3 group-hover:text-indigo-600">Fundamentos da TI {i}</h5>
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-600">8.2</div>
                        <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-emerald-600">95%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="p-0">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Data</th>
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Atividade</th>
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Resultado</th>
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[1, 2, 3, 4, 5].map(i => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-slate-300" />
                            <span className="text-sm text-slate-600">1{i} Abr, 2024</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-sm font-bold text-slate-900">Simulado de Lógica II</p>
                          <span className="text-[10px] font-bold text-slate-400">FORMATIVA</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-2 bg-slate-100 rounded-full">
                              <div className="h-full bg-emerald-500 rounded-full w-[80%]" />
                            </div>
                            <span className="text-xs font-black text-emerald-600">8.0</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button className="text-xs font-bold text-indigo-600 hover:underline">Ver Detalhes</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
