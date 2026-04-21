import React, { useEffect, useState } from 'react';
import { laboratorioService, Laboratorio } from '../../../services/laboratorioService';
import { useAuth } from '../../../lib/AuthContext';
import { useTenant } from '../../../lib/TenantContext';
import { Loader2, Plus, FlaskConical, Tags } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import LabCategoriasManager from './LabCategoriasManager';

export default function LabDashboard() {
  const { profile } = useAuth();
  const { tenant } = useTenant();
  const [labs, setLabs] = useState<Laboratorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'labs' | 'categorias'>('labs');
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
    <div className="p-8 space-y-8">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Laboratórios Práticos</h1>
           <p className="text-slate-500 font-medium mt-2">Plataforma de execução de práticas supervisionadas.</p>
        </div>
      </div>

      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-max">
        <button 
          onClick={() => setActiveTab('labs')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all",
            activeTab === 'labs' ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
          )}
        >
          <FlaskConical className="w-4 h-4" /> Laboratórios
        </button>
        <button 
          onClick={() => setActiveTab('categorias')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all",
            activeTab === 'categorias' ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
          )}
        >
          <Tags className="w-4 h-4" /> Categorias
        </button>
      </div>

      {activeTab === 'labs' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button 
              onClick={() => navigate('/professor/laboratorios/novo')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-indigo-700 transition"
            >
              <Plus className="w-5 h-5"/> Novo Laboratório
            </button>
          </div>
          
          {labs.length === 0 ? (
             <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-3xl text-slate-500 font-medium">
                Nenhum laboratório cadastrado. Crie o seu primeiro laboratório prático.
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {labs.map(lab => (
                <div key={lab.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col hover:border-indigo-200 transition">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                        <FlaskConical className="w-6 h-6" />
                     </div>
                     <div className={cn(
                       "px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest",
                       lab.status === 'PUBLISHED' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                     )}>
                       {lab.status}
                     </div>
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-2">{lab.titulo}</h3>
                  <p className="text-slate-500 text-sm mt-2 flex-1">{lab.versaoAluno.substring(0, 100)}...</p>
                  
                  <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end">
                     <button onClick={() => navigate(`/professor/laboratorios/${lab.id}`)} className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors">Gerenciar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'categorias' && (
        <LabCategoriasManager />
      )}
    </div>
  );
}
