import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, Brain, Zap, Target, BookOpen, 
  ChevronRight, ArrowRight, Star, AlertCircle,
  TrendingUp, Activity, Sparkles, Clock, X, Check, Search, Calendar, ChevronLeft
} from 'lucide-react';
import { useAuth } from '../../../lib/AuthContext';
import { cn } from '../../../lib/utils';
import { SRSService, SpacedReviewItem } from '../../../services/srsService';

export default function SpacedLearningHub() {
  const { profile, user } = useAuth();
  const [items, setItems] = useState<SpacedReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Quiz State
  const [activeQuizItem, setActiveQuizItem] = useState<SpacedReviewItem | null>(null);
  const [quizData, setQuizData] = useState<any>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadItems();
  }, [user]);

  const loadItems = async () => {
    if (!user) return;
    setLoading(true);
    try {
       const reviews = await SRSService.getItemsToReview(user.id);
       setItems(reviews);
    } catch (e) {
       console.error("Erro ao carregar revisões SRS:", e);
    } finally {
       setLoading(false);
    }
  };

  const handleStartReview = async (item: SpacedReviewItem) => {
    setActiveQuizItem(item);
    setQuizLoading(true);
    try {
       const data = await SRSService.generateReviewQuiz(item);
       setQuizData(data);
       setCurrentQuestionIdx(0);
       setSelectedAnswer(null);
       setShowExplanation(false);
       setScore(0);
    } catch (e) {
       console.error(e);
       alert("Não foi possível gerar revisão agora.");
       setActiveQuizItem(null);
    } finally {
       setQuizLoading(false);
    }
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null || !quizData) return;
    
    setShowExplanation(true);
    
    if (selectedAnswer === quizData.perguntas[currentQuestionIdx].respostaCorretaIndex) {
        setScore(s => s + 1);
    }
  };

  const handleNextQuestion = () => {
     if (currentQuestionIdx < quizData.perguntas.length - 1) {
         setCurrentQuestionIdx(c => c + 1);
         setSelectedAnswer(null);
         setShowExplanation(false);
     } else {
         // Finalizou quiz
         alert(`Revisão concluída! Você acertou ${score} de ${quizData.perguntas.length}`);
         setActiveQuizItem(null);
         setQuizData(null);
         // Num cenário ideal salvaríamos isso num log e atualizaríamos a força / proxima data
         // Mas como é um hub visual, recarregamos
     }
  };
  
  if (loading) {
     return <div className="p-12 text-center text-slate-500 font-medium">Analisando suas memórias e retenção cognitiva...</div>;
  }

  const now = new Date();
  const todayReviews = items.filter(i => i.proximaRevisao <= now || i.nivelUrgencia === 'ALTO')
                            .sort((a,b) => new Date(a.proximaRevisao).getTime() - new Date(b.proximaRevisao).getTime());

  // Render Quiz Modal se ativo
  if (activeQuizItem) {
     return (
        <div className="max-w-3xl mx-auto space-y-6 pb-24 pt-6">
           <button onClick={() => { setActiveQuizItem(null); setQuizData(null); }} className="text-slate-400 hover:text-slate-700 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors mb-8">
              <ChevronLeft className="w-4 h-4" /> Voltar ao Hub
           </button>
           
           <div className="flex items-center gap-4 border-b border-slate-200 pb-6 mb-6">
              <div className="bg-amber-100 p-3 rounded-2xl">
                 <Zap className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                 <h2 className="text-2xl font-black tracking-tight text-slate-900 leading-none mb-1">Revisão Rápida</h2>
                 <p className="text-slate-500 font-medium text-sm">{activeQuizItem.titulo}</p>
              </div>
           </div>

           {quizLoading ? (
               <div className="bg-white border border-slate-200 rounded-[2rem] p-12 text-center shadow-xl shadow-slate-200/50">
                  <div className="bg-amber-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Brain className="w-8 h-8 text-amber-500 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-black tracking-tighter text-slate-900 mb-2">Construindo Revisão Personalizada...</h3>
                  <p className="text-slate-500 text-sm">O modelo pedagógico está analisando as suas lacunas.</p>
               </div>
           ) : quizData ? (
               <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-xl shadow-slate-200/50">
                   <div className="flex items-center justify-between mb-8">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                           Pergunta {currentQuestionIdx + 1} de {quizData.perguntas.length}
                       </span>
                       <div className="flex gap-1 border border-slate-200 p-1 rounded-full">
                           {quizData.perguntas.map((_: any, i: number) => (
                               <div key={i} className={cn("w-2 h-2 rounded-full", i === currentQuestionIdx ? "bg-amber-500" : i < currentQuestionIdx ? "bg-emerald-500" : "bg-slate-200")} />
                           ))}
                       </div>
                   </div>
                   
                   <p className="text-xl font-medium text-slate-800 leading-relaxed mb-8">
                       {quizData.perguntas[currentQuestionIdx].pergunta}
                   </p>

                   <div className="space-y-3">
                       {quizData.perguntas[currentQuestionIdx].opcoes.map((opt: string, idx: number) => {
                           const isSelected = selectedAnswer === idx;
                           const isCorrect = idx === quizData.perguntas[currentQuestionIdx].respostaCorretaIndex;
                           
                           let borderClass = "border-slate-200 hover:border-amber-400";
                           let bgClass = "bg-white hover:bg-amber-50";
                           
                           if (showExplanation) {
                               if (isCorrect) {
                                   borderClass = "border-emerald-500";
                                   bgClass = "bg-emerald-50/50";
                               } else if (isSelected && !isCorrect) {
                                   borderClass = "border-rose-400";
                                   bgClass = "bg-rose-50/50";
                               } else {
                                   borderClass = "border-slate-100 opacity-50";
                                   bgClass = "bg-slate-50";
                               }
                           } else if (isSelected) {
                               borderClass = "border-amber-500 ring-2 ring-amber-500/20";
                               bgClass = "bg-amber-50/50";
                           }

                           return (
                               <button 
                                 key={idx}
                                 disabled={showExplanation}
                                 onClick={() => setSelectedAnswer(idx)}
                                 className={cn(
                                     "w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between",
                                     borderClass, bgClass
                                 )}
                               >
                                  <span className="text-[15px] font-medium text-slate-700">{opt}</span>
                                  {showExplanation && isCorrect && <Check className="w-5 h-5 text-emerald-500" />}
                                  {showExplanation && isSelected && !isCorrect && <X className="w-5 h-5 text-rose-500" />}
                               </button>
                           )
                       })}
                   </div>
                   
                   {showExplanation && (
                       <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-6">
                           <div className="flex items-center gap-3 mb-3">
                               <Sparkles className="w-5 h-5 text-amber-500" />
                               <span className="text-xs font-black uppercase tracking-widest text-slate-800">Explicação</span>
                           </div>
                           <p className="text-sm text-slate-600 leading-relaxed font-medium">
                               {quizData.perguntas[currentQuestionIdx].explicacao}
                           </p>
                           
                           <button onClick={handleNextQuestion} className="w-full mt-6 bg-slate-900 text-white rounded-xl py-4 font-black uppercase tracking-widest text-[11px] hover:bg-slate-800 transition-colors">
                               {currentQuestionIdx < quizData.perguntas.length - 1 ? "Próxima Pergunta" : "Finalizar Revisão"}
                           </button>
                       </motion.div>
                   )}
                   
                   {!showExplanation && (
                       <div className="pt-8 mt-8 border-t border-slate-100 flex justify-end">
                           <button 
                             disabled={selectedAnswer === null}
                             onClick={handleAnswerSubmit}
                             className="px-8 py-3 bg-amber-500 text-white rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                              Confirmar Resposta
                           </button>
                       </div>
                   )}
               </div>
           ) : null}
        </div>
     );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="bg-amber-500 p-4 rounded-3xl shadow-2xl shadow-amber-100">
            <History className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Revisão Espaçada</h1>
            <p className="text-slate-500 font-medium mt-2">Drible a curva do esquecimento com inteligência.</p>
          </div>
        </div>

        <div className="flex bg-white p-2 border border-slate-200 rounded-3xl items-center gap-6 px-6 shadow-sm">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-xs">
                {todayReviews.length}
             </div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revisões<br/>Hoje</span>
           </div>
           <div className="w-px h-8 bg-slate-100" />
           <div className="flex items-center gap-3">
             <Brain className="w-6 h-6 text-indigo-600" />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Memória<br/>Ativa</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Fixação Pendente</h2>
              {/* <button className="text-xs font-black text-amber-600 uppercase tracking-widest hover:bg-amber-50 px-4 py-2 rounded-xl transition-all">
                Ver Todo o Banco
              </button> */}
           </div>

           <div className="grid gap-4">
              <AnimatePresence>
                {todayReviews.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-3xl text-slate-500">
                       <Check className="w-10 h-10 mx-auto text-emerald-400 mb-4" />
                       <p className="font-medium">Nenhuma revisão pendente no momento! 🎉</p>
                    </div>
                ) : null}
                {todayReviews.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => handleStartReview(item)}
                    className="bg-white border border-slate-200 rounded-3xl p-6 flex items-center justify-between group hover:border-amber-200 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-6">
                       <div className="relative w-16 h-16">
                          <svg className="w-full h-full -rotate-90">
                            <circle cx="32" cy="32" r="28" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                            <circle cx="32" cy="32" r="28" fill="none" stroke={item.nivelUrgencia === 'ALTO' ? "#f43f5e" : "#f59e0b"} strokeWidth="6" strokeDasharray={175} strokeDashoffset={175 - (175 * item.strength / 100)} strokeLinecap="round" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center font-black text-xs text-slate-400">
                             {item.strength}%
                          </div>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">
                              FORÇA: {item.strength.toFixed(0)}% • URGÊNCIA: {item.nivelUrgencia}
                          </p>
                          <h3 className="text-lg font-black text-slate-900 group-hover:text-amber-600 transition-colors uppercase tracking-tight leading-none">{item.titulo}</h3>
                          <div className="flex items-center gap-4 mt-2">
                             <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                               <Clock className="w-3 h-3" /> Pontos de melhoria detectados pela IA
                             </span>
                          </div>
                       </div>
                    </div>
                    <button className="p-4 bg-slate-50 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-all transform group-hover:scale-105 shrink-0 ml-4">
                       <Zap className="w-5 h-5 fill-current" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-300">
              <div className="relative z-10">
                <Sparkles className="w-10 h-10 text-amber-400 mb-6" />
                <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-none mb-4">Meta Estudo</h3>
                <p className="text-slate-400 font-medium text-sm leading-relaxed mb-8">
                  {todayReviews.length > 0 
                     ? `Você tem ${todayReviews.length} revisões recomendadas pela inteligência artificial. Manter a prática ajuda a evitar que o conhecimento evapore.`
                     : `Você está com a retenção excelente. Aproveite para fazer novos desafios na jornada adaptativa!`
                  }
                </p>
                {todayReviews.length > 0 && (
                  <button onClick={() => handleStartReview(todayReviews[0])} className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform flex items-center justify-center gap-2">
                     Iniciar Sessão <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 blur-[80px]" />
           </div>

           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Próximos Dias</h3>
              <div className="space-y-4">
                 {items.filter(i => i.proximaRevisao > now).slice(0, 3).map((futuro, fw) => (
                    <div key={fw} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                       <div className="flex items-center gap-3">
                           <Calendar className="w-4 h-4 text-slate-400" />
                           <span className="text-[11px] font-black text-slate-600 uppercase truncate max-w-[120px]">{futuro.titulo}</span>
                       </div>
                       <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">
                           {new Date(futuro.proximaRevisao).toLocaleDateString('pt-BR')}
                       </span>
                    </div>
                 ))}
                 
                 {items.filter(i => i.proximaRevisao > now).length === 0 && (
                     <p className="text-xs text-slate-400 text-center font-medium">Não há revisões futuras programadas ainda.</p>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
