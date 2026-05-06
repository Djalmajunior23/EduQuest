import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, Plus, Search, Filter, ChevronRight, 
  Target, Calendar, Users, CheckCircle2, AlertCircle,
  MoreVertical, Edit, Trash2, Brain
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/AuthContext';
import { cn } from '../../../lib/utils';

interface ABPProject {
  id: string;
  titulo: string;
  tema: string;
  descricao: string;
  objetivos: string[];
  turmaId: string;
  status: 'PLANEJAMENTO' | 'EM_CURSO' | 'FINALIZADO';
  createdAt: any;
}

export default function ABPManager() {
  const { profile, user } = useAuth();
  const [projects, setProjects] = useState<ABPProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!profile) return;

    const fetchProjects = async () => {
      let query = supabase.from('abp_projetos').select('*');
      
      if (profile.perfil === 'PROFESSOR') {
        query = query.eq('professor_responsavel_id', user?.id);
      } else {
        query = query.eq('turma_id', profile.turmaId || '');
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching ABP projects:', error);
      } else {
        setProjects((data || []).map(p => ({
          ...p,
          turmaId: p.turma_id,
          professorResponsavelId: p.professor_responsavel_id,
          createdAt: p.created_at
        } as ABPProject)));
      }
      setLoading(false);
    };

    fetchProjects();

    // Subscribe to changes
    const channel = supabase
      .channel('abp_projetos_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'abp_projetos' 
      }, () => {
        fetchProjects();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile]);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Aprendizagem ABP</h1>
          <p className="text-slate-500 font-medium mt-2">Gestão de Aprendizagem Baseada em Projetos e Desafios Reais.</p>
        </div>

        {profile?.perfil !== 'ALUNO' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            <Plus className="w-5 h-5" />
            Novo Projeto
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar projetos pelo título ou tema..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none appearance-none font-medium">
            <option>Todos os Status</option>
            <option>Planejamento</option>
            <option>Em Curso</option>
            <option>Finalizado</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
          <Brain className="w-12 h-12 animate-pulse text-slate-400 mb-4" />
          <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Carregando Ecossistema ABP...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {projects.filter(p => p.titulo.toLowerCase().includes(searchTerm.toLowerCase())).map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-2xl hover:shadow-slate-200 transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    project.status === 'EM_CURSO' ? "bg-emerald-100 text-emerald-700" :
                    project.status === 'PLANEJAMENTO' ? "bg-amber-100 text-amber-700" :
                    "bg-blue-100 text-blue-700"
                  )}>
                    {project.status.replace('_', ' ')}
                  </div>
                  <button className="text-slate-400 hover:text-slate-900 p-2 rounded-xl border border-transparent hover:border-slate-100">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                  {project.titulo}
                </h3>
                <p className="text-slate-500 font-medium text-sm line-clamp-2 mb-6">
                  {project.descricao}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 text-slate-500">
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <Target className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-tight">{project.objetivos.length} Objetivos</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500">
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-tight">Equipes Formadas</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                        <img src={`https://i.pravatar.cc/150?u=${project.id}${i}`} alt="Membro" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-900 text-[10px] font-bold text-white flex items-center justify-center">
                      +12
                    </div>
                  </div>

                  <button className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-widest hover:gap-3 transition-all">
                    Ver Detalhes
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
