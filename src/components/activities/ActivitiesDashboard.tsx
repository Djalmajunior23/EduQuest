import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { activityService } from '../../services/activityService';
import { activityAnalyticsService } from '../../services/activityAnalyticsService';
import { Activity } from '../../types/activities';
import { Plus, List, BarChart3, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function ActivitiesDashboard() {
  const { user, profile } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [metrics, setMetrics] = useState({ totalActivities: 0, pendingSubmissions: 0, averageScore: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile?.perfil === 'PROFESSOR') {
      loadData();
    }
  }, [user, profile]);

  const loadData = async () => {
    if (!user) return;
    try {
      const docs = await activityService.getActivitiesByTeacher(user.id);
      setActivities(docs);
      const metricsData = await activityAnalyticsService.getTeacherDashboardMetrics(user.id);
      setMetrics(metricsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!profile || profile.perfil !== 'PROFESSOR') {
    return <div>Acesso restrito a professores.</div>;
  }

  if (loading) return <div className="p-8 text-center text-slate-500">Carregando painel de correção AI...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black italic uppercase text-slate-900 tracking-tighter">Módulo de Avaliação AI</h1>
          <p className="text-slate-500">Crie, corrija e diagnostique o aprendizado com inteligência artificial.</p>
        </div>
        <div className="flex gap-4">
          <Link 
            to="/activities/rubric/new" 
            className="flex items-center gap-2 bg-white text-indigo-600 border border-indigo-200 px-5 py-3 rounded-xl font-bold hover:bg-indigo-50 transition shadow-sm"
          >
            <Plus className="w-5 h-5"/> Nova Rubrica
          </Link>
          <Link 
            to="/activities/new" 
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
          >
            <Plus className="w-5 h-5"/> Nova Atividade
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-indigo-100 p-4 rounded-xl text-indigo-600"><List className="w-8 h-8"/></div>
          <div>
            <p className="text-slate-500 text-sm font-semibold uppercase">Total Atividades</p>
            <p className="text-3xl font-black">{metrics.totalActivities}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-amber-100 p-4 rounded-xl text-amber-600"><CheckSquare className="w-8 h-8"/></div>
          <div>
            <p className="text-slate-500 text-sm font-semibold uppercase">Pendentes p/ Correção</p>
            <p className="text-3xl font-black">{metrics.pendingSubmissions}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-100 p-4 rounded-xl text-emerald-600"><BarChart3 className="w-8 h-8"/></div>
          <div>
            <p className="text-slate-500 text-sm font-semibold uppercase">Média Geral Turma</p>
            <p className="text-3xl font-black">{metrics.averageScore.toFixed(1)} pts</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><List className="w-5 h-5 text-indigo-500"/> Suas Atividades</h2>
        </div>
        {activities.length === 0 ? (
          <div className="p-12 text-center text-slate-500">Nenhuma atividade criada ainda.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-sm uppercase font-semibold">
              <tr>
                <th className="p-4">Título</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Nível de Bloom</th>
                <th className="p-4">Status</th>
                <th className="p-4">Criada em</th>
                <th className="p-4">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activities.map(act => (
                <tr key={act.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-medium text-slate-800">{act.title}</td>
                  <td className="p-4 text-slate-600 capitalize">{act.type.replace('_', ' ')}</td>
                  <td className="p-4 text-slate-600">{act.bloomLevel || 'N/A'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${act.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                      {act.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 text-sm">{format(new Date(act.createdAt), 'dd/MM/yyyy')}</td>
                  <td className="p-4">
                    <Link to={`/activities/${act.id}`} className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded text-sm font-bold hover:bg-indigo-100 transition">Gerenciar</Link>
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
