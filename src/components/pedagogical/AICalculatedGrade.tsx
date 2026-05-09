import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2, Save, History, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { calculateSuggestedGrade } from '../../services/aiAssistantService';
import { api } from '../../lib/api';
import { normalizeArray } from '../../utils/normalizeArray';
import { cn } from '../../lib/utils';

interface AICalculatedGradeProps {
  submissionId: string;
  studentId: string;
  criteria: any[];
  submissionContent: any;
  onGradeConfirmed?: (grade: number, feedback: string) => void;
}

export const AICalculatedGrade: React.FC<AICalculatedGradeProps> = ({
  submissionId,
  studentId,
  criteria,
  submissionContent,
  onGradeConfirmed
}) => {
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [adjustedGrade, setAdjustedGrade] = useState<number>(0);
  const [teacherFeedback, setTeacherFeedback] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (studentId) {
      fetchHistory();
    }
  }, [studentId]);

  const fetchHistory = async () => {
    try {
      const { data } = await api.from('notas_atividades')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });
      setHistory(normalizeArray(data));
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const result = await calculateSuggestedGrade(submissionContent, criteria);
      setAiResult(result);
      setAdjustedGrade(result.suggestedGrade);
    } catch (error) {
      console.error('Error calculating grade:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
        const finalFeedback = teacherFeedback || aiResult?.feedback;
        const { error } = await api.from('notas_atividades').insert({
            student_id: studentId,
            submission_id: submissionId,
            grade: adjustedGrade,
            feedback: finalFeedback,
            created_at: new Date().toISOString()
        });
        
        if (error) throw error;

        fetchHistory();
        if (onGradeConfirmed) {
          onGradeConfirmed(adjustedGrade, finalFeedback);
        }
    } catch (e) {
        console.error('Error saving grade:', e);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-indigo-600 to-violet-700 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
            <Sparkles className="w-5 h-5 text-indigo-100" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Avaliação Inteligente</h3>
            <p className="text-xs text-indigo-100 opacity-80 uppercase tracking-widest font-black">Powered by Nexus AI</p>
          </div>
        </div>
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
        >
          <History className="w-4 h-4" />
          {showHistory ? 'Ocultar Histórico' : 'Ver Histórico'}
        </button>
      </div>

      <div className="p-8">
        <AnimatePresence mode="wait">
          {!aiResult && !loading ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 relative">
                 <div className="absolute inset-0 bg-indigo-500/10 rounded-full animate-ping" />
                 <Sparkles className="w-10 h-10 text-indigo-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Pronto para Avaliar?</h4>
              <p className="text-slate-500 text-sm max-w-sm mb-8">
                Nossa IA analisará a entrega do aluno comparando-a com os critérios de sucesso estabelecidos.
              </p>
              <button 
                onClick={handleCalculate}
                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
              >
                Iniciar Correção IA
              </button>
            </motion.div>
          ) : loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -inset-8 bg-indigo-500/20 rounded-full blur-2xl"
                />
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin relative" />
              </div>
              <p className="mt-8 text-slate-500 font-bold animate-pulse">
                Analisando competências técnicas...
              </p>
            </motion.div>
          ) : (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Grade Selector */}
              <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                <div className="text-center">
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Sugestão IA</span>
                   <div className="text-6xl font-black text-indigo-600 tracking-tighter">
                     {aiResult.suggestedGrade.toFixed(1)}
                   </div>
                </div>
                
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-end mb-4">
                    <label className="text-xs font-black text-slate-900 uppercase">Ajuste do Professor</label>
                    <span className="text-2xl font-bold text-slate-900">{adjustedGrade.toFixed(1)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="10" 
                    step="0.1"
                    value={adjustedGrade}
                    onChange={(e) => setAdjustedGrade(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400">
                    <span>0</span>
                    <span>5</span>
                    <span>10</span>
                  </div>
                </div>
              </div>

              {/* Feedback Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                       Pontos Fortes
                    </h4>
                    <ul className="space-y-2">
                      {normalizeArray(aiResult.strengths).map((s, idx) => (
                        <li key={idx} className="text-sm text-slate-600 font-medium flex gap-2">
                          <span className="text-emerald-500">•</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <AlertCircle className="w-4 h-4 text-amber-500" />
                       Oportunidades de Melhoria
                    </h4>
                    <ul className="space-y-2">
                      {normalizeArray(aiResult.improvements).map((i, idx) => (
                        <li key={idx} className="text-sm text-slate-600 font-medium flex gap-2">
                          <span className="text-amber-500">•</span> {i}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Feedback Justificativo</h4>
                  <textarea 
                    value={teacherFeedback || aiResult.feedback}
                    onChange={(e) => setTeacherFeedback(e.target.value)}
                    className="w-full bg-white border-none rounded-xl p-4 text-sm text-slate-600 min-h-[160px] shadow-sm resize-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    placeholder="Complemente o feedback da IA aqui..."
                  />
                </div>
              </div>

              {/* Criteria Progress */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Aderência aos Critérios</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {normalizeArray(aiResult.criteriaMatched).map((c, idx) => (
                     <div key={idx} className={cn(
                       "p-4 rounded-xl border flex items-start gap-3 transition-all",
                       c.met ? "bg-emerald-50 border-emerald-100" : "bg-slate-50 border-slate-100"
                     )}>
                       {c.met ? (
                         <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                       ) : (
                         <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0" />
                       )}
                       <div>
                         <p className={cn("text-xs font-bold", c.met ? "text-emerald-700" : "text-slate-500")}>
                           {c.criterion}
                         </p>
                         <p className="text-[10px] text-slate-500 mt-1">{c.comment}</p>
                       </div>
                     </div>
                   ))}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-slate-50">
                <button 
                  onClick={() => setAiResult(null)}
                  className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Recalcular
                </button>
                <button 
                  onClick={handleSave}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
                >
                  <Save className="w-4 h-4" />
                  Confirmar e Salvar Nota
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Historical Data Section */}
        <AnimatePresence>
          {showHistory && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-8 border-t border-slate-100 pt-8"
            >
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <h4 className="font-bold text-slate-800">Evolução de Desempenho</h4>
              </div>

              {normalizeArray(history).length === 0 ? (
                <div className="py-8 text-center text-slate-400 italic text-sm">
                  Nenhum registro anterior encontrado.
                </div>
              ) : (
                <div className="space-y-4">
                  {normalizeArray(history).map((item, idx) => (
                    <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start justify-between group">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-slate-400">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full" />
                          <span className="text-xs font-black uppercase text-indigo-500">Submissão #{item.submission_id?.slice(0, 8)}</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed italic">
                          "{item.feedback || 'Sem feedback registrado.'}"
                        </p>
                      </div>
                      <div className="ml-6 flex flex-col items-end">
                        <div className="text-2xl font-black text-slate-900 tracking-tighter">
                          {item.grade?.toFixed(1)}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Nota</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
