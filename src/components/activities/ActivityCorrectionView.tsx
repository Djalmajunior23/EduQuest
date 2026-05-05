import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { activityService } from '../../services/activityService';
import { universalActivityCorrectionEngine } from '../../services/correction/UniversalActivityCorrectionEngine';
import { activityCorrectionService } from '../../services/activityCorrectionService';
import { Activity, ActivitySubmission } from '../../types/activities';
import { ArrowLeft, BrainCircuit, CheckCircle2, MessageSquare, Target, Code, AlertTriangle, Lightbulb, Terminal } from 'lucide-react';

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

  useEffect(() => {
    if (id && submissionId && user) {
      loadData();
    }
  }, [id, submissionId, user]);

  const loadData = async () => {
    try {
      const actDocs = await activityService.getActivitiesByTeacher(user!.uid);
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
      const aiResult = await universalActivityCorrectionEngine.correct({
          activityId: activity.id!,
          submissionId: sub.id!,
          studentId: sub.studentId,
          teacherId: activity.teacherId,
          activityType: activity.type as any,
          title: activity.title,
          description: activity.description,
          studentAnswer: sub.answerText,
          studentCode: sub.studentCode || sub.codeAnswer,
          maxScore: activity.maxScore,
          correctionMode: activity.correctionMode || 'evaluative',
          programmingLanguage: sub.programmingLanguage as any
      });
      
      // Update local state to reflect new data
      setSub(prev => ({
        ...prev!,
        aiScore: aiResult.finalSuggestedScore,
        aiFeedback: aiResult.studentFeedback,
        teacherFeedback: aiResult.teacherFeedback,
        strengths: aiResult.strengths,
        weaknesses: aiResult.weaknesses,
        improvementPlan: aiResult.improvementPlan,
        competencyResults: aiResult.competencyResults,
        rubricResults: aiResult.rubricResults,
        codeAnalysis: aiResult.codeAnalysis,
        executionResult: aiResult.executionResult,
        nextSteps: aiResult.nextSteps,
        status: 'corrected'
      }));
      setTeacherScore(aiResult.finalSuggestedScore);
      setTeacherFeedback(aiResult.teacherFeedback || aiResult.studentFeedback);
      
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
        sub.id!, activity.id!, sub.studentId, user.uid, teacherScore, teacherFeedback, sub.finalScore
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
            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
              <h3 className="text-sm font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-2 mb-4"><BrainCircuit className="w-4 h-4"/> Diagnóstico IA</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-50">
                  <p className="text-xs font-bold text-slate-400 uppercase">Nota IA Sugerida</p>
                  <p className="text-2xl font-black text-indigo-600">{sub.aiScore} / {activity.maxScore}</p>
                </div>
                {sub.executionResult && sub.executionResult.executed && (
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-50">
                    <p className="text-xs font-bold text-slate-400 uppercase">Testes Passados</p>
                    <p className="text-2xl font-black text-emerald-600">{sub.executionResult.passedTests} / {sub.executionResult.totalTests}</p>
                  </div>
                )}
              </div>

              {sub.executionResult && sub.executionResult.testResults && sub.executionResult.testResults.length > 0 && (
                <div className="mb-6 bg-slate-900 p-4 rounded-xl border border-slate-700 shadow-lg font-mono">
                  <h4 className="font-bold text-emerald-400 mb-3 flex items-center gap-2 text-sm uppercase tracking-widest"><Terminal className="w-4 h-4"/> Console de Testes</h4>
                  <div className="space-y-3">
                    {sub.executionResult.testResults.map((test: any, i: number) => (
                      <div key={i} className="border-l-2 border-slate-700 pl-3 py-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-slate-500">Teste #{i+1}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${test.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                            {test.passed ? 'PASS' : 'FAIL'}
                          </span>
                        </div>
                        <div className="text-xs space-y-1">
                          <p className="text-slate-400"><span className="text-indigo-400">IN:</span> {test.input}</p>
                          <p className="text-slate-400"><span className="text-emerald-400">EXP:</span> {test.expectedOutput}</p>
                          <p className={`${test.passed ? 'text-emerald-300' : 'text-red-300'}`}><span className="text-amber-400">OUT:</span> {test.actualOutput}</p>
                          {test.error && <p className="text-red-500 italic mt-1 font-sans">{test.error}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {sub.codeAnalysis && (
                <div className="mb-6 bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                  <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><Code className="w-4 h-4 text-indigo-500"/> Análise de Código</h4>
                  <div className="flex gap-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${sub.codeAnalysis.syntaxOk ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {sub.codeAnalysis.syntaxOk ? 'Sintaxe Correta' : 'Erro Sintático'}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${sub.codeAnalysis.logicalIssues && sub.codeAnalysis.logicalIssues.length > 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {sub.codeAnalysis.logicalIssues && sub.codeAnalysis.logicalIssues.length > 0 ? 'Erro Lógico' : 'Lógica Correta'}
                    </span>
                  </div>
                  {sub.codeAnalysis.lineByLine && sub.codeAnalysis.lineByLine.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {sub.codeAnalysis.lineByLine.map((linha: any, i: number) => (
                        <div key={i} className="text-sm bg-slate-50 p-2 rounded">
                          <span className="font-mono text-xs text-slate-400 mr-2">L{linha.line}:</span>
                          <span className="font-mono text-indigo-900">{linha.code}</span>
                          <p className={`mt-1 text-xs font-medium ${linha.type === 'erro' ? 'text-red-600' : linha.type === 'alerta' ? 'text-amber-600' : 'text-slate-600'}`}>
                            {linha.type === 'erro' && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                            {linha.type === 'alerta' && <Lightbulb className="w-3 h-3 inline mr-1" />}
                            {linha.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {sub.improvementPlan && (
                <div className="mb-6 bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm">
                  <h4 className="text-sm font-bold text-amber-600 uppercase tracking-widest flex items-center gap-2 mb-3">
                    <BrainCircuit className="w-4 h-4"/> Plano de Melhoria
                  </h4>
                  <p className="text-slate-700 text-sm leading-relaxed">{sub.improvementPlan}</p>
                </div>
              )}

              {sub.saAnalysis && (
                <div className="mb-6 bg-white p-4 rounded-xl border border-indigo-100 shadow-sm space-y-3">
                  <h4 className="font-bold text-slate-800 mb-2">Análise de Situação de Aprendizagem</h4>
                  {sub.saAnalysis.compreensaoProblema && (
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Compreensão do Problema</p>
                      <p className="text-sm text-slate-700">{sub.saAnalysis.compreensaoProblema}</p>
                    </div>
                  )}
                  {sub.saAnalysis.aplicacaoPratica && (
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Aplicação Prática</p>
                      <p className="text-sm text-slate-700">{sub.saAnalysis.aplicacaoPratica}</p>
                    </div>
                  )}
                </div>
              )}

              {sub.strengths && sub.strengths.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-emerald-500 uppercase mb-2">Pontos Fortes</p>
                  <ul className="text-sm text-slate-700 list-disc pl-5">
                    {sub.strengths.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
              {sub.weaknesses && sub.weaknesses.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-amber-500 uppercase mb-2">Gaps Identificados</p>
                  <ul className="text-sm text-slate-700 list-disc pl-5">
                    {sub.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              )}
              {sub.rubricResults && sub.rubricResults.length > 0 && (
                <div className="mb-6 bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                  <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-indigo-500" /> Resultados por Rubrica
                  </h4>
                  <div className="space-y-3">
                    {sub.rubricResults.map((r: any, i: number) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-slate-700 text-sm">{r.criterion}</span>
                          <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-xs">
                            {r.score} pts
                          </span>
                        </div>
                        {r.feedback && <p className="text-xs text-slate-500 italic">{r.feedback}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {sub.competencyResults && sub.competencyResults.length > 0 && (
                <div className="mb-4">
                   <p className="text-xs font-bold text-indigo-400 uppercase mb-2">Análise de Competência</p>
                   {sub.competencyResults.map((c: any, i: number) => (
                     <div key={i} className="mb-2 p-3 bg-white rounded-lg text-sm border border-indigo-50">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-slate-700">{c.competency}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase 
                            ${c.performance === 'alto' || c.performance === 'alto' ? 'bg-emerald-100 text-emerald-700' : 
                               c.performance === 'médio' || c.performance === 'medio' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                            {c.performance}
                          </span>
                        </div>
                        {c.recommendation && <p className="text-slate-500 text-xs mt-1 leading-relaxed border-t border-slate-50 pt-1">{c.recommendation}</p>}
                        {c.evidence && <p className="text-[10px] text-slate-400 mt-1 italic">Evidência: {c.evidence}</p>}
                     </div>
                   ))}
                </div>
              )}

              {sub.nextSteps && sub.nextSteps.length > 0 && (
                <div className="mb-4 bg-emerald-50 p-4 rounded-xl">
                  <p className="text-xs font-bold text-emerald-600 uppercase mb-2">Próximos Passos</p>
                  <ul className="text-sm text-emerald-800 list-disc pl-5">
                    {sub.nextSteps.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
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
