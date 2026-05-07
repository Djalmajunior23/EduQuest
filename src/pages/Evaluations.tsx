import { api } from '../lib/api';


import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import {   FileCheck, 
  Plus, 
  Calendar, 
  Target, 
  Clock, 
  Users, 
  BarChart2, 
  MoreVertical, 
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';export default function Evaluations() {
  const { profile } = useAuth();
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const fetchEvaluations = async () => {
    if (!profile) return;
    try {
      const { data, error } = await api
        .from('avaliacoes')
        .select('*')
        .eq('created_by', profile.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setEvaluations(data || []);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!profile) return;
    fetchEvaluations();

    const channel = api.channel('avaliacoes_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'avaliacoes',
        filter: `created_by=eq.${profile.id}`
      }, () => {
        fetchEvaluations();
      })
      .subscribe();

    return () => {
      api.removeChannel(channel);
    };
  }, [profile]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-emerald-100 text-emerald-700';
      case 'CLOSED': return 'bg-slate-100 text-slate-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Avaliações Completas</h1>
          <p className="text-slate-500 font-medium">Gerencie provas diagnósticas, formativas e somativas com gabarito comentado.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
          Criar Nova Avaliação
        </button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Eficácia Média', value: '78%', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Participação', value: '92%', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Ativas', value: '04', icon: FileCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'BI Insights', value: 'Risco ↑', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={cn("p-4 rounded-2xl", stat.bg, stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-2xl font-black text-slate-900">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {['all', 'DIAGNOSTICA', 'FORMATIVA', 'SOMATIVA'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-black uppercase transition-all",
                  activeTab === tab ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {tab === 'all' ? 'Todas' : tab}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar avaliação..." 
              className="bg-white border-slate-200 rounded-2xl py-3 pl-12 pr-6 text-sm w-80 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            />
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Evaluation List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-slate-400 font-bold">Carregando avaliações...</p>
          </div>
        ) : (evaluations || []).length === 0 ? (
          <div className="col-span-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-20 text-center">
            <FileCheck className="w-16 h-16 text-slate-200 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Nenhuma avaliação encontrada</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Comece criando sua primeira avaliação diagnóstica ou formativa.</p>
          </div>
        ) : (
          (evaluations || []).map(evalItem => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={evalItem.id} 
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase", getStatusColor(evalItem.status))}>
                    {evalItem.status}
                  </span>
                  <button className="text-slate-300 hover:text-slate-600 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-all">{evalItem.titulo}</h3>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-6">
                  <Users className="w-3.5 h-3.5" />
                  Turmas: {evalItem.turma_ids?.length || 0}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Tipo</p>
                    <p className="text-sm font-bold text-slate-700">{evalItem.tipo}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Questões</p>
                    <p className="text-sm font-bold text-slate-700">{evalItem.question_ids?.length || 0}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                   <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                     <Calendar className="w-4 h-4 text-indigo-500" />
                     Expira em {new Date(evalItem.data_fim).toLocaleDateString()}
                   </div>
                   <button className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                     <BarChart2 className="w-5 h-5" />
                   </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal - Simplified version for layout */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[3rem] w-full max-w-2xl p-12 relative shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8">
                <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-10">
                <div className="p-4 bg-indigo-50 rounded-[1.5rem] text-indigo-600">
                  <Plus className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Configurar Avaliação</h2>
                  <p className="text-slate-500">Defina o tipo, público e configurações de feedback.</p>
                </div>
              </div>

              <div className="space-y-8">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Título da Avaliação</label>
                    <input type="text" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 placeholder:text-slate-300 font-medium" placeholder="Ex: Avaliação Formativa UC1" />
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                   <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Tipo</label>
                      <select className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 font-medium appearance-none">
                        <option>DIAGNOSTICA</option>
                        <option>FORMATIVA</option>
                        <option>SOMATIVA</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Prazo</label>
                      <input type="date" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 font-medium" />
                   </div>
                 </div>

                 <div className="space-y-4">
                   <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-indigo-900 flex items-center gap-2 text-sm">
                          <Sparkles className="w-4 h-4" />
                          Gabarito Comentado IA
                        </h4>
                        <p className="text-[10px] text-indigo-600 mt-1 max-w-[200px]">Liberar justificativas pedagógicas automaticamente após a entrega?</p>
                      </div>
                      <button className="w-12 h-6 bg-indigo-600 rounded-full relative p-1">
                        <div className="w-4 h-4 bg-white rounded-full translate-x-6 shadow-sm" />
                      </button>
                   </div>

                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                          <Target className="w-4 h-4" />
                          Avaliação por Rubricas
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-1 max-w-[200px]">Utilizar critérios multidimensionais (técnico, socioemocional, prático).</p>
                      </div>
                      <button className="w-12 h-6 bg-slate-200 rounded-full relative p-1">
                        <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                      </button>
                   </div>
                 </div>

                 <button className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-bold text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95">
                    Prosseguir para Questões
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
