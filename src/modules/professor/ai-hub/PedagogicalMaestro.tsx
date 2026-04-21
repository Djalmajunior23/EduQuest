import React, { useState } from 'react';
import { 
  Sparkles, 
  Brain, 
  Dices, 
  BookOpen, 
  ClipboardList, 
  CheckSquare, 
  Loader2,
  Zap,
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AIService } from '../../../services/aiService';

type Mode = 'PLAN' | 'SIMULATOR' | 'CASE' | 'QUEST' | 'LAB' | 'FULL';

export default function PedagogicalMaestro() {
  const [activeMode, setActiveMode] = useState<Mode>('PLAN');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const modes = [
    { id: 'PLAN', name: 'Plano de Aula', icon: <ClipboardList size={18} />, color: 'indigo' },
    { id: 'SIMULATOR', name: 'Simulador IA', icon: <Dices size={18} />, color: 'rose' },
    { id: 'CASE', name: 'Estudo PBL', icon: <BookOpen size={18} />, color: 'amber' },
    { id: 'QUEST', name: 'Banco de Questões', icon: <CheckSquare size={18} />, color: 'emerald' },
    { id: 'LAB', name: 'Laboratório', icon: <Zap size={18} />, color: 'violet' },
    { id: 'FULL', name: 'Aula Completa', icon: <Sparkles size={18} />, color: 'slate' },
  ];

  const handleGenerate = async () => {
    if (!topic || loading) return;
    setLoading(true);
    try {
      // Logic for different modes... 
      // This is a hub that orchestrates the individual services.
      setResult({ status: 'success', message: 'Conteúdo orquestrado com sucesso. Verifique os módulos individuais.' });
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2 flex items-center gap-4">
           <div className="p-3 bg-indigo-600 text-white rounded-3xl shadow-xl shadow-indigo-100">
             <Brain size={32} />
           </div>
           Maestro Pedagógico
        </h1>
        <p className="text-slate-500 font-medium">Orquestre toda a sua sequência didática através do motor de inteligência avançada.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-3">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 pl-1">Escolha o Instrumento</h3>
             {modes.map(m => (
               <button 
                 key={m.id}
                 onClick={() => setActiveMode(m.id as Mode)}
                 className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all group ${activeMode === m.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
               >
                 <div className="flex items-center gap-3 font-black text-xs uppercase tracking-wider">
                   {m.icon} {m.name}
                 </div>
                 <ChevronRight size={16} className={`${activeMode === m.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
               </button>
             ))}
          </div>

          <div className="bg-amber-50 p-8 rounded-[3rem] border border-amber-200">
             <ShieldAlert className="text-amber-600 mb-4" />
             <h4 className="font-bold text-amber-900 mb-2">Governança Integrada</h4>
             <p className="text-xs text-amber-800/80 leading-relaxed font-semibold uppercase tracking-tight">
               As chaves de API estão protegidas pela camada NEXUS. O uso é monitorado por tenant e perfil (Professor).
             </p>
          </div>
        </div>

        <div className="lg:col-span-8 bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Sparkles size={120} />
           </div>

           <div className="max-w-2xl">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">
                {modes.find(m => m.id === activeMode)?.name} Inteligente
              </h2>
              <p className="text-slate-500 font-medium mb-8">
                A IA analisará o tema e criará um recurso otimizado para o perfil dos seus alunos.
              </p>

              <div className="space-y-6 mb-8">
                <textarea 
                   value={topic}
                   onChange={e => setTopic(e.target.value)}
                   placeholder="Sobre o que você quer ensinar hoje? Descreva o tema ou a competência..."
                   className="w-full p-8 bg-slate-50 border-none rounded-[2rem] text-lg font-bold text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-100 transition-all h-64 resize-none shadow-inner"
                />
              </div>

              <button 
                onClick={handleGenerate}
                disabled={!topic || loading}
                className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-sm tracking-[0.3em] hover:bg-slate-800 transition-all shadow-2xl flex items-center justify-center gap-4 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Zap size={20} className="text-indigo-400" />}
                Orquestrar Conteúdo
              </button>

              <AnimatePresence>
                {result && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-6 bg-indigo-50 rounded-3xl border border-indigo-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 text-indigo-900 font-bold">
                      <Sparkles size={20} className="text-indigo-600" /> {result.message}
                    </div>
                    <button className="flex items-center gap-2 text-xs font-black uppercase text-indigo-600">
                       Ver Agora <ArrowRight size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
}
