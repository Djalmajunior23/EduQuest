import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { activityService } from '../../services/activityService';
import { Activity, ActivitySubmission } from '../../types/activities';
import { ArrowLeft, Users, BrainCircuit, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function ActivityDetailsView() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [submissions, setSubmissions] = useState<ActivitySubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && user) {
      loadData();
    }
  }, [id, user]);

  const loadData = async () => {
    try {
      const actDocs = await activityService.getActivitiesByTeacher(user!.uid);
      const act = actDocs.find(a => a.id === id);
      if (act) {
        setActivity(act);
        const subs = await activityService.getSubmissionsByActivity(act.id!);
        setSubmissions(subs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Recuperando detalhes da atividade...</div>;
  if (!activity) return <div className="p-8 text-center text-red-500">Atividade não encontrada.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/activities')} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-black italic uppercase text-slate-900 tracking-tighter">{activity.title}</h1>
          <div className="flex gap-4 text-sm text-slate-500 mt-1">
            <span className="capitalize">{activity.type.replace('_', ' ')}</span>
            <span>Máx: {activity.maxScore} pontos</span>
            <span className="font-bold text-indigo-500">{activity.status}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm prose max-w-none text-slate-700">
        <h3>Enunciado</h3>
        <p className="whitespace-pre-wrap">{activity.description}</p>
        <div className="flex gap-2 mt-4">
          {activity.competencies.map(c => <span key={c} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{c}</span>)}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Users className="w-5 h-5 text-indigo-500"/> Entregas dos Alunos</h2>
        </div>
        {submissions.length === 0 ? (
          <div className="p-12 text-center text-slate-500">Nenhum aluno submeteu a atividade ainda.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-sm uppercase font-semibold">
              <tr>
                <th className="p-4">Aluno ID</th>
                <th className="p-4">Status</th>
                <th className="p-4">Data Envio</th>
                <th className="p-4">Nota IA</th>
                <th className="p-4">Nota Prof</th>
                <th className="p-4">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.map(sub => (
                <tr key={sub.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-mono text-xs text-slate-500">{sub.studentId.slice(0, 8)}...</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase 
                      ${sub.status === 'submitted' ? 'bg-amber-100 text-amber-700' : 
                        sub.status === 'corrected' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {sub.status === 'submitted' ? 'Pendente' : sub.status === 'corrected' ? 'IA Avaliou' : 'Revisado'}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 text-sm">{format(new Date(sub.createdAt), 'dd/MM/yyyy HH:mm')}</td>
                  <td className="p-4 font-bold text-slate-600">{sub.aiScore !== undefined ? sub.aiScore : '-'}</td>
                  <td className="p-4 font-bold text-indigo-600">{sub.finalScore !== undefined ? sub.finalScore : '-'}</td>
                  <td className="p-4">
                    <Link to={`/activities/${activity.id}/correction/${sub.id}`} className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded text-sm font-bold hover:bg-indigo-100 transition">
                      {sub.status === 'submitted' ? <><BrainCircuit className="w-4 h-4"/> Corrigir IA</> : <><CheckCircle2 className="w-4 h-4"/> Revisar</>}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
