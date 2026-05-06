import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Sparkles, 
  Calendar, 
  BookOpen, 
  Users, 
  Target, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  FileText,
  Save,
  Loader2,
  Brain,
  Layers,
  ChevronRight,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { generateLessonPlan } from '../services/aiAssistantService';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';

export default function LessonPlanner() {
  const { profile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('plans');
  const [formData, setFormData] = useState({
    title: '',
    uc: '',
    theme: '',
    level: 'Intermediário',
    discipline: '',
    objectives: '',
    aiInsights: true
  });

  useEffect(() => {
    if (profile) {
      fetchPlans();
    }
  }, [profile]);

  const fetchPlans = async () => {
    if (!profile) return;
    try {
      const { data, error } = await supabase
        .from('planos_aula')
        .select('*')
        .eq('teacher_id', profile.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handleGenerate = async () => {
    if (!formData.title || !formData.uc || !formData.theme || !profile) return;
    setLoading(true);
    try {
      const classInsights = { 
        averagePerformance: 6.8, 
        mainWeakness: 'Lógica Proposicional',
        preferredStyle: 'Prático' 
      };
      
      const plan = await generateLessonPlan({ 
        unit: formData.uc,
        theme: formData.theme,
        level: formData.level,
        classInsights 
      });

      if (plan) {
        const newPlan = {
          title: formData.title,
          uc: formData.uc,
          theme: formData.theme,
          level: formData.level,
          discipline: formData.discipline,
          objectives: formData.objectives,
          ai_insights: formData.aiInsights,
          ai_recommendation: plan.aiRecommendation,
          activities: plan.activities,
          teacher_id: profile.id,
          created_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('planos_aula')
          .insert(newPlan);
        
        if (error) throw error;
        
        fetchPlans();
        setIsModalOpen(false);
        setFormData({ 
          title: '', 
          uc: '', 
          theme: '', 
          level: 'Intermediário', 
          discipline: '', 
          objectives: '', 
          aiInsights: true 
        });
      }
    } catch (error) {
      console.error('Error generating plan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Planejamento Docente</h1>
          <p className="text-slate-500 font-medium">Crie cronogramas, sequências didáticas e atividades inteligentes.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Novo Plano de Aula
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Minhas Turmas
            </h3>
            <div className="space-y-2">
              {['Desenvolvimento Web - T1', 'Banco de Dados - T3', 'Redes - T2'].map((turma, i) => (
                <button key={i} className="w-full text-left p-3 rounded-xl hover:bg-slate-50 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-all flex items-center justify-between group">
                  {turma}
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-3xl text-white shadow-xl">
            <Sparkles className="w-8 h-8 mb-4 text-indigo-200" />
            <h3 className="font-bold text-lg mb-2">Insights do BI</h3>
            <p className="text-sm text-indigo-100 leading-relaxed mb-4">
              A turma T1 apresenta queda de desempenho em <strong>Lógica de Programação</strong>. Sugere-se uma atividade prática de reforço.
            </p>
            <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition-all">
              Ver Detalhes do BI
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 gap-6">
            {plans.length === 0 ? (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl h-96 flex flex-col items-center justify-center text-center p-12 text-slate-400">
                <FileText className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-bold text-lg mb-2">Nenhum plano gerado ainda</p>
                <p className="text-sm max-w-xs">Use a IA para gerar sequências didáticas personalizadas com base na fragilidade da sua turma.</p>
              </div>
            ) : (
              plans.map(plan => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={plan.id} 
                  className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-xs font-black text-indigo-500 uppercase tracking-widest">
                        <BookOpen className="w-3 h-3" />
                        {plan.uc}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{plan.title}</h3>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase ring-1 ring-emerald-100">
                      Plano Inteligente
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h4 className="text-sm font-black text-slate-400 uppercase mb-4 tracking-tighter">Objetivos Pedagógicos</h4>
                      <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{plan.theme}</p>
                      {plan.ai_recommendation && (
                        <div className="mt-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 italic text-indigo-700 text-xs">
                          <Sparkles className="w-4 h-4 mb-2" />
                          {plan.ai_recommendation}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-400 uppercase mb-4 tracking-tighter">Sequência Didática</h4>
                      <div className="space-y-4">
                        {(plan.activities || []).slice(0, 4).map((step: any, idx: number) => (
                          <div key={idx} className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0">
                              {step.time}
                            </div>
                            <p className="text-xs text-slate-600 font-medium leading-snug">
                              <span className="font-bold text-slate-900 block">{step.activity}</span>
                              {step.focus}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                        <Clock className="w-4 h-4" /> 4 Horas
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                        <Users className="w-4 h-4" /> 32 Alunos
                      </div>
                    </div>
                    <button className="flex items-center gap-2 text-sm font-black text-indigo-600 hover:text-indigo-700 transition-all uppercase">
                      Ver Plano Completo
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* New Plan Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-xl p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8">
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Novo Plano Inteligente</h2>
                  <p className="text-sm text-slate-500">A IA irá orquestrar o plano com base na BNCC e no BI.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest pl-1">Título da Aula</label>
                    <input 
                      type="text" 
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      placeholder="Ex: Dominação do DOM"
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest pl-1">Nível Desejado</label>
                    <select 
                      value={formData.level}
                      onChange={e => setFormData({...formData, level: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all font-medium appearance-none"
                    >
                      <option value="Básico">Básico</option>
                      <option value="Intermediário">Intermediário</option>
                      <option value="Avançado">Avançado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest pl-1">Tema e Objetivos</label>
                  <textarea 
                    value={formData.theme}
                    onChange={e => setFormData({...formData, theme: e.target.value})}
                    placeholder="Descreva o que os alunos devem aprender hoje..."
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all font-medium h-32 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest pl-1">Unidade Curricular</label>
                    <select 
                      value={formData.uc}
                      onChange={e => setFormData({...formData, uc: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all font-medium appearance-none"
                    >
                      <option value="">Selecione a UC</option>
                      <option value="Dev Front-end">Dev Front-end</option>
                      <option value="Banco de Dados">Banco de Dados</option>
                      <option value="Lógica Programação">Lógica Programação</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest pl-1">Turma</label>
                    <select className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all font-medium appearance-none">
                      <option value="T1">T1 - Manhã</option>
                      <option value="T2">T2 - Tarde</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-500" />
                      <span className="text-sm font-bold text-slate-700">Otimizar com Inteligência Pedagógica</span>
                    </div>
                    <button 
                      onClick={() => setFormData({...formData, aiInsights: !formData.aiInsights})}
                      className={cn(
                        "w-12 h-6 rounded-full transition-all relative p-1",
                        formData.aiInsights ? "bg-indigo-600" : "bg-slate-200"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 bg-white rounded-full transition-all flex items-center justify-center shadow-sm",
                        formData.aiInsights ? "translate-x-6" : "translate-x-0"
                      )} />
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Se ativado, a IA analisará o desempenho recente da turma e sugerirá atividades de reforço personalizadas para os pontos fracos detectados.
                  </p>
                </div>

                <button 
                  onClick={handleGenerate}
                  disabled={loading || !formData.title || !formData.uc}
                  className="w-full py-4 mt-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-indigo-100 active:scale-95 flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  Gerar Plano Maestro
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
