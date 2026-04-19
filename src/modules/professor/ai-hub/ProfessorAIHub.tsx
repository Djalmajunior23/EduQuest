import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  Sparkles, 
  FilePlus, 
  BarChart3, 
  BookOpen, 
  Target, 
  Zap, 
  ChevronRight,
  Loader2,
  Copy,
  ChevronDown,
  Layout,
  ClipboardList
} from 'lucide-react';
import { professorAiService } from '../../../services/professorAiService';
import { cn } from '../../../lib/utils';
import Markdown from 'react-markdown';

export default function ProfessorAIHub() {
  const [activeTab, setActiveTab] = useState<'GENERATOR' | 'ANALYZE' | 'HISTORY'>('GENERATOR');
  const [contentType, setContentType] = useState('PLANO_AULA');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const contentTypes = [
    { id: 'PLANO_AULA', label: 'Plano de Aula', icon: Layout },
    { id: 'ESTUDO_CASO', label: 'Estudo de Caso', icon: BookOpen },
    { id: 'ATIVIDADE_PRATICA', label: 'Atividade Prática', icon: ClipboardList },
    { id: 'MATERIAL_APOIO', label: 'Material de Apoio', icon: FilePlus },
    { id: 'RUBRICA', label: 'Rubrica Avaliativa', icon: Target },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setResult(null);
    try {
      const label = contentTypes.find(t => t.id === contentType)?.label || 'Conteúdo';
      const response = await professorAiService.generateContent(label, prompt);
      setResult(response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 rounded-2xl shadow-lg shadow-blue-500/20">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter">Cérebro do Professor</h1>
                <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" /> IA Pedagógica de Alta Performance
                </p>
              </div>
            </div>
            <p className="max-w-xl text-slate-400 text-sm font-medium leading-relaxed">
              Otimize seu planejamento, analise turmas em segundos e gere instrumentos avaliativos alinhados à metodologia SENAI.
            </p>
          </div>
          
          <div className="flex gap-2 bg-slate-800/50 p-2 rounded-2xl backdrop-blur-sm border border-white/5">
             {['GENERATOR', 'ANALYZE', 'HISTORY'].map((tab) => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab as any)}
                 className={cn(
                   "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                   activeTab === tab ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
                 )}
               >
                 {tab === 'GENERATOR' ? 'Gerador' : tab === 'ANALYZE' ? 'Analisador' : 'Histórico'}
               </button>
             ))}
          </div>
        </div>
        <Sparkles className="absolute -right-16 -bottom-16 w-64 h-64 text-white/5 rotate-12" />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Config */}
        <aside className="lg:col-span-1 space-y-6">
           <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 bg-slate-50 border-b border-slate-100">
                <h2 className="text-xs font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" /> O que deseja criar?
                </h2>
              </div>
              <div className="p-4 space-y-2">
                 {contentTypes.map((type) => {
                   const Icon = type.icon;
                   return (
                     <button
                       key={type.id}
                       onClick={() => setContentType(type.id)}
                       className={cn(
                         "w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all group",
                         contentType === type.id 
                           ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                           : "hover:bg-slate-50 text-slate-600"
                       )}
                     >
                       <div className={cn(
                         "p-2 rounded-lg transition-colors",
                         contentType === type.id ? "bg-blue-600" : "bg-slate-100 group-hover:bg-white"
                       )}>
                         <Icon className="w-4 h-4" />
                       </div>
                       <span className="text-[11px] font-black uppercase tracking-wider">{type.label}</span>
                       <ChevronRight className={cn(
                         "ml-auto w-4 h-4 opacity-0 group-hover:opacity-40 transition-all",
                         contentType === type.id && "opacity-100 translate-x-1"
                       )} />
                     </button>
                   );
                 })}
              </div>
           </section>

           <section className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-100">
              <h3 className="font-black italic uppercase text-lg tracking-tighter mb-2">Dica Pro</h3>
              <p className="text-xs text-blue-100 leading-relaxed font-medium">
                Seja específico nos KTs (Conhecimentos Técnicos) e CTs (Capacidades Técnicas) que deseja abordar para uma geração mais precisa.
              </p>
           </section>
        </aside>

        {/* Main Column: Editor/Result */}
        <main className="lg:col-span-3 space-y-6">
           <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              <div className="p-8 border-b border-slate-100 space-y-6">
                 <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Contexto / Prompt do Professor</label>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold">Poder: Máximo</span>
                 </div>
                 <textarea 
                   value={prompt}
                   onChange={(e) => setPrompt(e.target.value)}
                   className="w-full min-h-[120px] p-0 text-xl font-medium text-slate-900 placeholder:text-slate-200 border-none focus:ring-0 resize-none"
                   placeholder={`Descreva aqui o ${contentTypes.find(t => t.id === contentType)?.label.toLowerCase()} que deseja gerar...`}
                 />
                 <div className="flex justify-between items-center pt-4">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                       <Sparkles className="w-4 h-4" /> Gere questões, planos ou atividades em segundos
                    </p>
                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt.trim()}
                      className={cn(
                        "px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-3 transition-all",
                        isGenerating 
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                          : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02] shadow-xl shadow-blue-100 active:scale-95"
                      )}
                    >
                      {isGenerating ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Processando Inteligência...</>
                      ) : (
                        <><Zap className="w-5 h-5 fill-current" /> Acionar Cérebro</>
                      )}
                    </button>
                 </div>
              </div>

              {result && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 bg-slate-50/50"
                >
                   <div className="p-8 space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                           <ClipboardList className="w-4 h-4" /> Resultado Gerado
                        </h3>
                        <div className="flex gap-2">
                           <button 
                             onClick={() => {
                               navigator.clipboard.writeText(result);
                               alert('Copiado para o seu clipboard!');
                             }}
                             className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                           >
                             <Copy className="w-4 h-4" />
                           </button>
                           <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200">
                             Salvar na Biblioteca
                           </button>
                        </div>
                      </div>
                      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm prose prose-slate max-w-none prose-sm lg:prose-base font-medium text-slate-700">
                         <div className="markdown-body">
                           <Markdown>{result}</Markdown>
                         </div>
                      </div>
                   </div>
                </motion.div>
              )}
           </section>
        </main>
      </div>
    </div>
  );
}
