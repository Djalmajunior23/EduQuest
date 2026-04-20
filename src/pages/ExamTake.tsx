import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { missionService } from '../services/missionService';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Send,
  AlertCircle,
  CheckCircle2,
  XCircle,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function ExamTake() {
  const { examId } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    async function fetchExamData() {
      try {
        const examDoc = await getDoc(doc(db, 'exams', examId!));
        if (!examDoc.exists()) {
          navigate('/exams');
          return;
        }
        const examData = examDoc.data();
        setExam({ id: examDoc.id, ...examData });
        setTimeLeft(examData.timeLimit * 60);

        // Fetch questions
        const qSnap = await getDocs(query(collection(db, 'questions'), where('__name__', 'in', examData.questionIds)));
        setQuestions(qSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching exam:', error);
      } finally {
        setLoading(false);
      }
    }

    if (examId) fetchExamData();
  }, [examId, navigate]);

  useEffect(() => {
    if (timeLeft > 0 && !finished) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !finished && exam) {
      handleSubmit();
    }
  }, [timeLeft, finished, exam]);

  const handleAnswer = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      let correctCount = 0;
      questions.forEach((q, idx) => {
        if (answers[idx] === q.correctOptionIndex) {
          correctCount++;
        }
      });

      const score = Math.round((correctCount / questions.length) * 100);
      
      const attemptData = {
        userId: profile.uid,
        examId: exam.id,
        score,
        answers: Object.values(answers),
        startedAt: new Date(Date.now() - (exam.timeLimit * 60 - timeLeft) * 1000).toISOString(),
        completedAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'attempts'), attemptData);
      
      // Check for missions completion
      const completedMissions = await missionService.checkMissions(profile.uid, 'COMPLETE_EXAM', { 
        score, 
        examId: exam.id 
      });

      if (completedMissions.length > 0) {
        // Múltiplas missões puderam ser concluídas
      }
      
      // Trigger n8n webhook if score is low
      if (score < 70) {
        fetch('/api/webhook/n8n', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'low_performance',
            student: profile.nome,
            email: profile.email,
            exam: exam.title,
            score
          })
        }).catch(err => console.error('Webhook error:', err));
      }

      setResult({ score, correctCount, total: questions.length });
      setFinished(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'attempts');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;

  if (finished) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center"
        >
          <div className={cn(
            "w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center",
            result.score >= 70 ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
          )}>
            {result.score >= 70 ? <CheckCircle2 className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Simulado Concluído!</h2>
          <p className="text-slate-500 mb-8">Você acertou {result.correctCount} de {result.total} questões.</p>
          
          <div className="bg-slate-50 rounded-2xl p-6 mb-8">
            <p className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Sua Pontuação</p>
            <p className="text-5xl font-black text-slate-900">{result.score}%</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setShowReview(true);
                setFinished(false);
                setCurrentQuestionIndex(0);
              }}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Revisar Questões
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/exams')} className="text-slate-400 hover:text-slate-600">
            <XCircle className="w-6 h-6" />
          </button>
          <div>
            <h1 className="font-bold text-slate-900 truncate max-w-[200px] md:max-w-md">{exam.title}</h1>
            <p className="text-xs text-slate-500">
              {showReview ? 'Revisão' : 'Questão'} {currentQuestionIndex + 1} de {questions.length}
            </p>
          </div>
        </div>

        {!showReview ? (
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold",
            timeLeft < 300 ? "bg-red-50 text-red-600 animate-pulse" : "bg-slate-100 text-slate-600"
          )}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        ) : (
          <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-bold text-sm">
            Modo Revisão
          </div>
        )}
      </header>

      {/* Progress Bar & Navigation */}
      <div className="w-full bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto flex items-center p-2 gap-1 overflow-x-auto no-scrollbar">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={cn(
                "w-8 h-8 rounded-lg font-bold text-sm flex items-center justify-center transition-all shrink-0",
                currentQuestionIndex === idx 
                  ? "bg-blue-600 text-white" 
                  : (answers[idx] !== undefined ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200")
              )}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Question Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                <h2 className="text-xl font-medium text-slate-900 leading-relaxed">
                  {currentQuestion?.text}
                </h2>
              </div>

              <div className="space-y-4">
                {currentQuestion?.options.map((option: string, idx: number) => {
                  const isSelected = answers[currentQuestionIndex] === idx;
                  const isCorrect = currentQuestion.correctOptionIndex === idx;
                  
                  let buttonClass = "border-slate-100 bg-white text-slate-600 hover:border-slate-200";
                  if (showReview) {
                    if (isCorrect) buttonClass = "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm";
                    else if (isSelected && !isCorrect) buttonClass = "border-red-500 bg-red-50 text-red-700 shadow-sm";
                  } else if (isSelected) {
                    buttonClass = "border-blue-600 bg-blue-50 text-blue-700 shadow-md";
                  }

                  return (
                    <button
                      key={idx}
                      disabled={showReview}
                      onClick={() => handleAnswer(idx)}
                      className={cn(
                        "w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center gap-4",
                        buttonClass
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold border-2",
                        showReview 
                          ? (isCorrect ? "bg-emerald-500 border-emerald-500 text-white" : (isSelected ? "bg-red-500 border-red-500 text-white" : "border-slate-200 text-slate-400"))
                          : (isSelected ? "bg-blue-600 border-blue-600 text-white" : "border-slate-200 text-slate-400")
                      )}>
                        {showReview && isCorrect ? <CheckCircle2 className="w-5 h-5" /> : (showReview && isSelected && !isCorrect ? <XCircle className="w-5 h-5" /> : String.fromCharCode(65 + idx))}
                      </div>
                      <span className="font-medium">{option}</span>
                    </button>
                  );
                })}
              </div>

              {showReview && currentQuestion.explanation && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-50 border border-blue-100 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-2 text-blue-700 font-bold mb-2">
                    <AlertCircle className="w-5 h-5" />
                    Explicação Pedagógica
                  </div>
                  <p className="text-blue-900 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="bg-white border-t border-slate-200 p-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
            Anterior
          </button>

          {currentQuestionIndex === questions.length - 1 ? (
            showReview ? (
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
              >
                Finalizar Revisão
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting || Object.keys(answers).length < questions.length}
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-200"
              >
                {submitting ? 'Enviando...' : 'Finalizar'}
                <Send className="w-5 h-5" />
              </button>
            )
          ) : (
            <button
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800"
            >
              Próxima
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
