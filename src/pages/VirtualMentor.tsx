import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Target, 
  Compass, 
  Briefcase, 
  Zap,
  Loader2,
  Calendar,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useAuth } from '../lib/AuthContext';
import { getVirtualMentorAdvice } from '../services/aiAssistantService';

export default function VirtualMentor() {
  const { profile } = useAuth();
  const [advice, setAdvice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSurvey, setShowSurvey] = useState(false);

  useEffect(() => {
    fetchMentorAdvice();
  }, [profile]);

  const fetchMentorAdvice = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const studentStatus = {
        name: profile.nome,
        progress: 65,
        lastTopic: 'React Hooks',
        difficulties: ['useEffect', 'Circular Dependencies'],
        careerGoal: 'Fullstack Developer'
      };
      
      const mentorAdvice = await getVirtualMentorAdvice(studentStatus);
      setAdvice(mentorAdvice);
    } catch (error) {
      console.error('Error fetching mentor advice:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Mentor Hero Section */}
      <div className="relative mb-16">
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-violet-500/10 rounded-full blur-[100px] animate-pulse" />
        
        <div className="relative bg-white/40 backdrop-blur-md rounded-[3rem] p-12 border border-white/50 shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="relative">
              <div className="w-48 h-48 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[3rem] p-1 shadow-2xl flex items-center justify-center transform hover:rotate-6 transition-transform duration-500">
                <div className="w-full h-full bg-white rounded-[2.8rem] flex items-center justify-center overflow-hidden relative group">
                  <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                  <Brain className="w-20 h-20 text-indigo-600" />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 p-4 bg-white rounded-2xl shadow-xl border border-slate-50">
                <Zap className="w-6 h-6 text-amber-500 animate-bounce" />
              </div>
            </div>

            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase mb-6 tracking-[0.2em]">
                <Sparkles className="w-3 h-3" />
                Mentor Inteligente Inteligência Educacional Interativa
              </div>
              <h1 className="text-5xl font-black text-slate-900 leading-tight mb-6 tracking-tight">
                Olá, {profile?.nome?.split(' ')[0]}!<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">O que vamos conquistar hoje?</span>
              </h1>
              <p className="text-xl text-slate-500 leading-relaxed font-medium">
                Sua evolução está em <strong>65%</strong>. Detectei que você avançou rápido em React, mas podemos polir alguns fundamentos hoje.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Insights Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="text-lg font-bold text-slate-400">Consultando sua rede neural pedagógica...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Focus */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Target className="w-32 h-32" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-indigo-600" />
                Foco do Dia
              </h3>
              <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 mb-8">
                <p className="text-lg font-bold text-indigo-900 leading-relaxed">
                  {advice?.todayTask || "Revisão prática de 'useEffect' com exemplos de ciclo de vida e limpeza de listeners."}
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest pl-1">Orientação do Mentor</h4>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {advice?.advice || "Você dominou a criação de componentes, mas a gestão de efeitos colaterais ainda causa pequenos atrasos. Vamos focar nisso para que você possa avançar para Context API com segurança."}
                </p>
              </div>
              <button className="mt-8 flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all group">
                Começar agora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Career Guidance */}
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.1 }}
               className="bg-emerald-600 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden"
            >
              <div className="absolute bottom-0 right-0 p-8 opacity-20">
                <Briefcase className="w-48 h-48" />
              </div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Compass className="w-6 h-6 text-emerald-200" />
                Direcionamento de Carreira
              </h3>
              <p className="text-xl text-emerald-50 mb-8 max-w-xl leading-relaxed">
                {advice?.careerBoost || "Para um futuro desenvolvedor Fullstack, entender a reatividade no front-end é o pilar para construir dashboards robustos que o mercado tanto busca. Você está no caminho certo!"}
              </p>
              <div className="flex gap-4">
                <div className="px-4 py-2 bg-white/10 rounded-xl text-xs font-bold ring-1 ring-white/20">JS Avançado</div>
                <div className="px-4 py-2 bg-white/10 rounded-xl text-xs font-bold ring-1 ring-white/20">Arquitetura de Sistemas</div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Motivation & Progress */}
          <div className="space-y-8">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-amber-100 rounded-[2.5rem] p-10 text-amber-900 shadow-sm text-center"
            >
               <div className="w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-200/50">
                 <Zap className="w-10 h-10 text-amber-500" />
               </div>
               <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Combustível do Dia</h3>
               <p className="italic font-medium leading-relaxed">
                 "{advice?.motivation || "Sua constância é seu maior superpoder. Cada erro corrigido hoje é um bug a menos em sua carreira sênior de amanhã."}"
               </p>
            </motion.div>

            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
               <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                 <TrendingUp className="w-5 h-5 text-indigo-600" />
                 Sua Evolução Técnica
               </h3>
               <div className="space-y-6">
                 {[
                   { label: 'Front-end', progress: 85, color: 'bg-indigo-500' },
                   { label: 'Back-end', progress: 40, color: 'bg-violet-500' },
                   { label: 'Banco de Dados', progress: 55, color: 'bg-emerald-500' }
                 ].map(skill => (
                   <div key={skill.label}>
                     <div className="flex justify-between text-xs font-bold mb-2">
                       <span className="text-slate-500 uppercase tracking-widest">{skill.label}</span>
                       <span className="text-slate-900">{skill.progress}%</span>
                     </div>
                     <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${skill.progress}%` }}
                         className={cn("h-full rounded-full shadow-lg", skill.color)}
                       />
                     </div>
                   </div>
                 ))}
               </div>
               <button className="w-full mt-8 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                 Ver Dossiê Completo
               </button>
            </div>

            <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-xl shadow-indigo-100">
               <BookOpen className="w-10 h-10 mb-6 text-indigo-300" />
               <h3 className="text-xl font-bold mb-4">Trilha de Recuperação Ativa</h3>
               <p className="text-sm text-indigo-100 leading-relaxed mb-6">
                 Iniciei uma mini-trilha de exercícios sobre <strong>Dependency Arrays</strong> personalizada para você.
               </p>
               <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-700/20 active:scale-95 transition-all">
                 Acessar Trilha
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
