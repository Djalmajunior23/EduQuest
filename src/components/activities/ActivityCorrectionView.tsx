import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { activityService } from '../../services/activityService';
import { UniversalActivityCorrectionEngine } from '../../services/UniversalActivityCorrectionEngine';
import { activityCorrectionService } from '../../services/activityCorrectionService';
import { Activity, ActivitySubmission } from '../../types/activities';
import { ArrowLeft, BrainCircuit, CheckCircle2, MessageSquare, Target, Code, AlertTriangle, Lightbulb, Terminal, ChevronDown, ChevronRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ActivityCorrectionView() {
  const { id, submissionId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [sub, setSub] = useState<ActivitySubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [teacherScore, setTeacherScore] = useState<number>(0);
  const [teacherFeedback, setTeacherFeedback] = useState<string>('');
  const [showDetailedAI, setShowDetailedAI] = useState(true);

  useEffect(() => {
    if (id && submissionId && user) {
      loadData();
    }
  }, [id, submissionId, user]);

  const loadData = async () => {
    try {
      const actDocs = await activityService.getActivitiesByTeacher(user!.id);
      const act = actDocs.find(a => a.id === id);
      if (act) {
        setActivity(act);
        const subs = await activityService.getSubmissionsByActivity(act.id!);
        const targetSub = subs.find(s => s.id === submissionId);
        if (targetSub) {
          setSub(targetSub);
          setTeacherScore(targetSub.finalScore ?? targetSub.aiScore ?? 0);
          setTeacherFeedback(targetSub.teacherFeedback || targetSub.aiFeedback || '');
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAI = async () => {
    if (!activity || !sub) return;
    setAiLoading(true);
    try {
      const aiResult = await UniversalActivityCorrectionEngine.correct(activity, sub);
      
      // Fetch updated sub from DB or update local state
      const subs = await activityService.getSubmissionsByActivity(activity.id!);
      const targetSub = subs.find(s => s.id === submissionId);
      if (targetSub) {
        setSub(targetSub);
        setTeacherScore(targetSub.aiScore || 0);
        setTeacherFeedback(targetSub.teacherFeedback || targetSub.aiFeedback || '');
      }
      
      alert('Correção automática com Universal Engine concluída!');
    } catch (e) {
      console.error(e);
      alert('Falha na correção por IA.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveReview = async () => {
    if (!activity || !sub || !user) return;
    try {
      await activityCorrectionService.teacherReview(
        sub.id!, activity.id!, sub.studentId, user.id, teacherScore, teacherFeedback, sub.finalScore
      );
      alert('Avaliação salva com sucesso!');
      navigate(`/activities/${activity.id}`);
    } catch (e) {
      console.error(e);
      alert('Erro ao salvar review.');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Recuperando submissão...</div>;
  if (!activity || !sub) return <div className="p-8 text-center text-red-500">Dados não encontrados.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-black italic uppercase text-slate-900 tracking-tighter">Correção Atividade</h1>
            <p className="text-sm text-slate-500 mt-1">Aluno: {sub.studentId}</p>
          </div>
        </div>
        {!sub.aiScore && (
          <button 
            onClick={handleRunAI} 
            disabled={aiLoading}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            <BrainCircuit className="w-5 h-5"/>
            {aiLoading ? 'O Oráculo está Avaliando...' : 'Autocorreção Inteligente'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Col: Activity and Answer */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Enunciado</h3>
            <p className="text-slate-700 whitespace-pre-wrap">{activity.description}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4">Resposta do Aluno</h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 min-h-[200px] text-slate-800 font-medium whitespace-pre-wrap">
              {sub.studentCode && (
                <div className="mb-4">
                  <span className="bg-slate-200 px-2 py-1 rounded text-xs font-bold text-slate-600 mb-2 inline-block">Linguagem: {sub.programmingLanguage || 'N/A'}</span>
                  <pre className="bg-slate-800 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm font-mono border border-slate-700">
                    {sub.studentCode}
                  </pre>
                </div>
              )}
              {sub.answerText || sub.codeAnswer || (!sub.studentCode && <span className="text-slate-400 italic">Nenhum texto enviado. Analise os anexos se houver.</span>)}
            </div>
            
            {sub.fileUrls && sub.fileUrls.length > 0 && (
              <div className="mt-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Anexos</h4>
                <div className="flex gap-2">
                  {sub.fileUrls.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline text-sm font-bold">Anexo {i + 1}</a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Correction & Feedback */}
        <div className="space-y-6">
          {sub.status !== 'submitted' && (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <button 
                onClick={() => setShowDetailedAI(!showDetailedAI)}
                className="w-full flex items-center justify-between p-6 bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                <div className="flex items-center gap-3">
                  <BrainCircuit className="w-6 h-6 animate-pulse" />
                  <div className="text-left">
                    <h3 className="font-bold text-lg leading-tight">Análise Universal Inteligente</h3>
                    <p className="text-xs text-indigo-100 opacity-80 uppercase tracking-widest">Motor EduQuest v2.5</p>
                  </div>
                </div>
                {showDetailedAI ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
              </button>

              <AnimatePresence>
                {showDetailedAI && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="p-6 space-y-6"
                  >
                    {/* Score and Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-1 text-slate-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Nota Sugerida</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-indigo-600">{sub.aiScore}</span>
                          <span className="text-slate-300 font-bold">/ {activity.maxScore}</span>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-1 text-slate-400">
                          <Target className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Confiança</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold uppercase px-2 py-0.5 rounded ${
                            sub.executionResult?.totalTests ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {sub.executionResult?.totalTests ? 'Alta' : 'Média'}
                          </span>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-1 text-slate-400">
                          <Star className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Status IA</span>
                        </div>
                        <span className="text-sm font-bold text-slate-600">Completo</span>
                      </div>
                    </div>

                    {/* Code Analysis Detailed */}
                    {sub.codeAnalysis && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="h-px bg-slate-200 flex-1"></div>
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Raio-X do Código</h4>
                          <div className="h-px bg-slate-200 flex-1"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className={`p-3 rounded-lg border flex items-center justify-between ${sub.codeAnalysis.syntaxOk ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                            <span className="text-xs font-bold text-slate-600">Sintaxe</span>
                            <span className={`text-[10px] font-black uppercase ${sub.codeAnalysis.syntaxOk ? 'text-emerald-600' : 'text-red-600'}`}>
                              {sub.codeAnalysis.syntaxOk ? 'Válida' : 'Erro'}
                            </span>
                          </div>
                          <div className={`p-3 rounded-lg border flex items-center justify-between ${sub.codeAnalysis.logicalIssues?.length ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'}`}>
                            <span className="text-xs font-bold text-slate-600">Lógica</span>
                            <span className={`text-[10px] font-black uppercase ${sub.codeAnalysis.logicalIssues?.length ? 'text-amber-600' : 'text-emerald-600'}`}>
                              {sub.codeAnalysis.logicalIssues?.length ? `${sub.codeAnalysis.logicalIssues.length} Alertas` : 'Sólida'}
                            </span>
                          </div>
                        </div>

                        {sub.codeAnalysis.lineByLine && (
                          <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800">
                            <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Terminal className="w-3 h-3" /> Debug Pedagógico
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono italic">{sub.programmingLanguage || 'detectada'}</span>
                            </div>
                            <div className="p-0 font-mono text-xs">
                              {sub.codeAnalysis.lineByLine.map((line: any, idx: number) => (
                                <div key={idx} className={`group border-b border-slate-800/50 last:border-0`}>
                                  <div className="flex bg-slate-900/50 px-4 py-2 hover:bg-slate-800/80 transition">
                                    <span className="w-8 text-slate-600 select-none border-r border-slate-800 mr-4">{line.line || line.linha}</span>
                                    <span className="text-indigo-300 truncate">{line.code || line.codigo}</span>
                                  </div>
                                  <div className={`px-4 py-2 flex gap-3 ${
                                    line.type === 'erro' ? 'bg-red-900/20 text-red-300' : 
                                    line.type === 'alerta' ? 'bg-amber-900/20 text-amber-300' : 
                                    line.type === 'melhoria' ? 'bg-indigo-900/20 text-indigo-300' : 'bg-emerald-900/10 text-emerald-300'
                                  }`}>
                                    <div className="mt-0.5">
                                      {line.type === 'erro' ? <AlertTriangle className="w-3 h-3" /> : 
                                       line.type === 'alerta' ? <Lightbulb className="w-3 h-3" /> : 
                                       line.type === 'melhoria' ? <BrainCircuit className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                                    </div>
                                    <p className="text-[11px] leading-relaxed italic">{line.comment || line.comentario}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Rubric and Criteria Grid */}
                    {(sub.rubricResults || sub.competencyResults) && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="h-px bg-slate-200 flex-1"></div>
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Desempenho por Critério</h4>
                          <div className="h-px bg-slate-200 flex-1"></div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {sub.rubricResults?.map((r: any, idx: number) => (
                            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition">
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-slate-700">{r.criterion}</span>
                                <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2 py-0.5 rounded-full">{r.score} pts</span>
                              </div>
                              <p className="text-[10px] text-slate-500 leading-relaxed italic">{r.feedback}</p>
                            </div>
                          ))}
                          
                          {sub.competencyResults?.map((c: any, idx: number) => (
                            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
                              <div className={`absolute top-0 left-0 w-1 h-full ${
                                c.performance === 'alto' ? 'bg-emerald-400' : c.performance === 'médio' ? 'bg-amber-400' : 'bg-red-400'
                              }`}></div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-800">{c.competency}</span>
                                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                                  c.performance === 'alto' ? 'bg-emerald-100 text-emerald-700' : c.performance === 'médio' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {c.performance}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 line-clamp-2">{c.recommendation}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Strengths & Gaps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                         <h5 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                           <Star className="w-3 h-3" /> Pontos Fortes
                         </h5>
                         <div className="space-y-2">
                           {sub.strengths?.map((s: string, idx: number) => (
                             <div key={idx} className="flex gap-2 text-[11px] text-slate-600 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/50">
                               <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 flex-shrink-0"></div>
                               {s}
                             </div>
                           ))}
                         </div>
                      </div>
                      <div className="space-y-3">
                         <h5 className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2">
                           <AlertTriangle className="w-3 h-3" /> Gaps Técnicos
                         </h5>
                         <div className="space-y-2">
                           {sub.weaknesses?.map((w: string, idx: number) => (
                             <div key={idx} className="flex gap-2 text-[11px] text-slate-600 bg-amber-50/50 p-2 rounded-lg border border-amber-100/50">
                               <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 flex-shrink-0"></div>
                               {w}
                             </div>
                           ))}
                         </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    {sub.nextSteps && sub.nextSteps.length > 0 && (
                      <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50">
                        <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3">Roteiro de Evolução</h5>
                        <div className="flex flex-wrap gap-2">
                          {sub.nextSteps.map((step: string, idx: number) => (
                            <span key={idx} className="bg-white px-3 py-1.5 rounded-lg border border-indigo-100 text-[10px] font-medium text-indigo-700 shadow-sm flex items-center gap-2">
                              <Target className="w-3 h-3 text-indigo-300" /> {step}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2 mb-4"><CheckCircle2 className="w-4 h-4"/> Avaliação Final</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nota Final</label>
                <input 
                  type="number" 
                  value={teacherScore}
                  onChange={e => setTeacherScore(Number(e.target.value))}
                  className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-xl font-bold font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><MessageSquare className="w-4 h-4"/> Feedback ao Aluno (Editável)</label>
                <textarea 
                  value={teacherFeedback}
                  onChange={e => setTeacherFeedback(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none min-h-[150px]"
                />
              </div>
              <button 
                onClick={handleSaveReview}
                className="w-full bg-emerald-500 text-white px-5 py-4 rounded-xl font-bold hover:bg-emerald-600 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
              >
                <CheckCircle2 className="w-5 h-5"/> Aprovar e Publicar Nota
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
