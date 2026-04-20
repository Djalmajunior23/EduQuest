import React, { useEffect, useState } from 'react';
import { laboratorioService, Laboratorio } from '../../../services/laboratorioService';
import { useAuth } from '../../../lib/AuthContext';
import { useTenant } from '../../../lib/TenantContext';
import { Loader2, Plus, FlaskConical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LabDashboard() {
  const { profile } = useAuth();
  const { tenant } = useTenant();
  const [labs, setLabs] = useState<Laboratorio[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (tenant?.id) {
      laboratorioService.getLaboratorios(tenant.id).then(data => {
        setLabs(data);
        setLoading(false);
      });
    }
  }, [tenant]);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-10 h-10" /></div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black italic uppercase"> Laboratórios Práticos</h1>
        <button 
          onClick={() => navigate('/professor/laboratorios/novo')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black uppercase flex items-center gap-2"
        >
          <Plus className="w-5 h-5"/> Novo Laboratório
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {labs.map(lab => (
          <div key={lab.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <FlaskConical className="w-8 h-8 text-indigo-500 mb-4" />
            <h3 className="text-lg font-black uppercase">{lab.titulo}</h3>
            <p className="text-slate-500 text-sm mt-2">{lab.versaoAluno.substring(0, 100)}...</p>
            <div className="mt-4 text-xs font-bold uppercase text-slate-400">{lab.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
