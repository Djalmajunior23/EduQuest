// src/components/EduJarvis/NarrativeBI.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart3, Sparkles, TrendingUp, AlertTriangle, Lightbulb, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import { EduJarvisService } from '../../services/edujarvis/EduJarvisService';
import { useAuth } from '../../lib/AuthContext';
import { cn } from '../../lib/utils';

interface Props {
  turmaId: string;
}

export function EduJarvisNarrativeBI({ turmaId }: Props) {
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useAuth();

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      // Usamos o serviço do EduJarvis direcionando para o ANALYST
      // O EduJarvisService já sabe que se for ANALYST e tiver turmaId, chama o NarrativeBIAgent
      const response = await EduJarvisService.sendMessage(
        "Gere um relatório narrativo de desempenho para minha turma.",
        profile,
        { turmaId }
      );
      setReport(response.content);
    } catch (error) {
      console.error(error);
      setReport("Não foi possível processar a análise da turma no momento.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-indigo-50 shadow-sm overflow-hidden relative group">
      {/* Background Decorative */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/30 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-indigo-100/30 transition-colors" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <BarChart3 className="w-8 h-8 text-white" />
           </div>
           <div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">BI Narrativo EduJarvis</h2>
              <p className="text-slate-500 font-medium">Análise neural de desempenho e recomendações pedagógicas</p>
           </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={isLoading}
          className={cn(
            "flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest text-sm",
            isLoading 
              ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processando Dados...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Gerar Análise IA
            </>
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {report && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-8 pt-8 border-t border-slate-100"
          >
            <div className="bg-slate-50/50 rounded-3xl p-8 border border-slate-100 prose prose-indigo max-w-none prose-p:text-slate-600 prose-headings:text-slate-800 prose-strong:text-indigo-600">
               {/* No React-Markdown aqui por simplicidade, tratando como texto formatado basico */}
               <div className="whitespace-pre-wrap font-sans leading-relaxed">
                  {report}
               </div>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-4">
               <div className="flex items-center gap-3 px-5 py-3 bg-red-50 text-red-600 rounded-2xl text-xs font-bold uppercase tracking-wider border border-red-100">
                  <AlertTriangle className="w-4 h-4" />
                  Alunos em Risco
               </div>
               <div className="flex items-center gap-3 px-5 py-3 bg-amber-50 text-amber-600 rounded-2xl text-xs font-bold uppercase tracking-wider border border-amber-100">
                  <TrendingUp className="w-4 h-4" />
                  Tendência de Queda
               </div>
               <div className="flex items-center gap-3 px-5 py-3 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-bold uppercase tracking-wider border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4" />
                  Plano de Ação Pronto
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
