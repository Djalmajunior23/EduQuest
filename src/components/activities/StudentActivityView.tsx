import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { activityService } from '../../services/activityService';
import { Activity, ActivitySubmission } from '../../types/activities';
import { FileUp, Save, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function StudentActivityView() {
  const { user, profile } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [submissions, setSubmissions] = useState<ActivitySubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [programmingLanguage, setProgrammingLanguage] = useState('javascript');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && profile?.perfil === 'ALUNO') {
      loadData();
    }
  }, [user, profile]);

  const loadData = async () => {
    // In a real app we fetch activities for the student's class. We mock passing a classId or fetching all.
    try {
      const allActs = await activityService.getActivitiesByClass('default'); // Fetch all published
      setActivities(allActs);
      const mySubs = await activityService.getStudentSubmissions(user!.uid);
      setSubmissions(mySubs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getSub = (actId: string) => submissions.find(s => s.activityId === actId);

  const handleSubmit = async () => {
    if (!activeActivity || !user) return;
    setSubmitting(true);
    try {
      const existingSub = getSub(activeActivity.id!);
      const newAttempt = (existingSub?.attemptNumber || 0) + 1;
      
      const newSub: Omit<ActivitySubmission, 'id' | 'createdAt'> = {
        activityId: activeActivity.id!,
        studentId: user.uid,
        classId: activeActivity.classId,
        answerText,
        studentCode,
        programmingLanguage,
        status: 'submitted',
        attemptNumber: newAttempt
      };

      await activityService.submitActivity(newSub);
      alert('Atividade enviada com sucesso!');
      setActiveActivity(null);
      setAnswerText('');
      loadData();
    } catch (e) {
      console.error(e);
      alert('Erro ao enviar atividade.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!profile || profile.perfil !== 'ALUNO') {
    return <div>Acesso restrito a alunos.</div>;
  }

  if (loading) return <div className="p-8 text-center text-slate-500">Carregando suas atividades...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black italic uppercase text-slate-900 tracking-tighter">Minhas Atividades</h1>
        <p className="text-slate-500">Realize suas entregas e acompanhe seus feedbacks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {activities.length === 0 ? (
            <div className="p-6 bg-slate-50 rounded-xl text-slate-500 text-sm text-center">Nenhuma atividade pendente.</div>
          ) : (
             activities.map(act => {
                const sub = getSub(act.id!);
                const isDone = sub && (sub.status === 'corrected' || sub.status === 'reviewed');
                return (
                  <div 
                    key={act.id}
                    onClick={() => { 
                      setActiveActivity(act); 
                      setAnswerText(sub?.status === 'submitted' ? sub.answerText || '' : ''); 
                      setStudentCode(sub?.status === 'submitted' ? sub.studentCode || '' : '');
                      setProgrammingLanguage(sub?.status === 'submitted' ? sub.programmingLanguage || 'javascript' : 'javascript');
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${activeActivity?.id === act.id ? 'border-indigo-500 shadow-md ring-2 ring-indigo-50 leading-relaxed bg-white' : 'border-slate-200 bg-white hover:border-indigo-300'}`}
                  >
                     <div className="flex justify-between items-start mb-2">
                       <h3 className="font-bold text-slate-800 line-clamp-2">{act.title}</h3>
                       {isDone ? <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0"/> : sub ? <Clock className="w-5 h-5 text-amber-500 shrink-0"/> : null}
                     </div>
                     <span className={`text-xs font-bold uppercase ${isDone ? 'text-emerald-600' : sub ? 'text-amber-600' : 'text-slate-400'}`}>
                        {isDone ? `Nota: ${sub?.finalScore !== undefined ? sub.finalScore : sub?.aiScore} / ${act.maxScore}` : sub ? 'Avaliando' : 'Pendente'}
                     </span>
                  </div>
                );
             })
          )}
        </div>

        <div className="lg:col-span-2">
          {activeActivity ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">{activeActivity.title}</h2>
                <div className="flex gap-2 mt-2">
                   <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-xs font-bold uppercase">{activeActivity.type.replace('_', ' ')}</span>
                   <span className="bg-slate-50 text-slate-500 px-2 py-1 rounded text-xs font-bold uppercase">Máx: {activeActivity.maxScore} pts</span>
                </div>
              </div>

              <div className="prose max-w-none text-slate-700 whitespace-pre-wrap">
                {activeActivity.description}
              </div>

              {(() => {
                const sub = getSub(activeActivity.id!);
                if (sub && sub.status !== 'returned') {
                   // Status submitted, corrected, reviewed => Show feedback
                   return (
                     <div className="space-y-4 pt-6 border-t border-slate-100">
                        <h3 className="font-bold text-slate-800">Sua Resposta:</h3>
                        <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 whitespace-pre-wrap">
                          {sub.studentCode && (
                             <div className="mb-4">
                               <span className="bg-slate-200 px-2 py-1 rounded text-xs font-bold text-slate-600 mb-2 inline-block">Linguagem: {sub.programmingLanguage || 'N/A'}</span>
                               <pre className="bg-slate-800 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm font-mono border border-slate-700">
                                 {sub.studentCode}
                               </pre>
                             </div>
                          )}
                          {sub.answerText}
                        </div>

                        {(sub.status === 'corrected' || sub.status === 'reviewed') && (
                          <div className="mt-6 bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                             <h4 className="font-black text-emerald-800 uppercase tracking-tighter mb-2">Feedback do Professor / IA</h4>
                             <p className="text-emerald-900 font-medium mb-4">{sub.teacherFeedback || sub.aiFeedback}</p>
                             
                             {sub.improvementPlan && (
                                <div className="mt-4 bg-white p-4 rounded-lg bg-opacity-60">
                                   <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Plano de Melhoria</p>
                                   <p className="text-slate-700 text-sm">{sub.improvementPlan}</p>
                                </div>
                             )}
                          </div>
                        )}
                     </div>
                   );
                }

                return (
                  <div className="space-y-4 pt-6 border-t border-slate-100">
                    {activeActivity.type === 'code' && (
                       <div className="space-y-4">
                         <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Linguagem de Programação</label>
                            <select 
                              value={programmingLanguage} 
                              onChange={e => setProgrammingLanguage(e.target.value)}
                              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                              <option value="javascript">JavaScript</option>
                              <option value="typescript">TypeScript</option>
                              <option value="python">Python</option>
                              <option value="java">Java</option>
                              <option value="c">C</option>
                              <option value="cpp">C++</option>
                              <option value="csharp">C#</option>
                              <option value="php">PHP</option>
                              <option value="sql">SQL</option>
                              <option value="ruby">Ruby</option>
                              <option value="go">Go</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Código Fonte</label>
                            <textarea 
                              value={studentCode}
                              onChange={e => setStudentCode(e.target.value)}
                              placeholder="Cole o seu código aqui..."
                              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[300px] font-mono text-sm bg-slate-50"
                            />
                         </div>
                       </div>
                    )}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">{activeActivity.type === 'code' ? 'Comentários / Explicação' : 'Sua Resposta'}</label>
                      <textarea 
                        value={answerText}
                        onChange={e => setAnswerText(e.target.value)}
                        placeholder="Escreva sua resposta ou solução estruturada aqui..."
                        className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[150px]"
                      />
                    </div>
                    <button 
                      onClick={handleSubmit}
                      disabled={submitting || (!answerText.trim() && !studentCode.trim())}
                      className="w-full bg-indigo-600 text-white px-5 py-4 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-50"
                    >
                      {submitting ? 'Enviando...' : <><FileUp className="w-5 h-5"/> Entregar Atividade</>}
                    </button>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-8 text-center min-h-[400px]">
               <FileUp className="w-12 h-12 mb-4 opacity-50" />
               <p className="font-medium">Selecione uma atividade na lista ao lado para começar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
