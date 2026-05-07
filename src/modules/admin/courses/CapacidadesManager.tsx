import { api } from '../../../lib/api';


import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import {   Building2, Search, Plus, Filter, Library, Target, Key, GitCommit, Trash2, Edit3, X, Save, 
  Loader2, Network
} from 'lucide-react';
import { cn } from '../../../lib/utils';export default function CapacidadesManager() {
  const { profile } = useAuth();
  const [ucs, setUcs] = useState<any[]>([]);
  const [capacidades, setCapacidades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUcFilter, setSelectedUcFilter] = useState('ALL');
  
  // Side Panel State for Creating/Editing
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingCapacidade, setEditingCapacidade] = useState<any>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    nivel: 'INTERMEDIARIO',
    unidadeCurricularId: '',
    status: 'ATIVO'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile?.tenantId) return;

    const fetchData = async () => {
      // Fetch Capacidades
      const { data: capData } = await api
        .from('capacidades_tecnicas')
        .select('*')
        .eq('tenant_id', profile.tenantId)
        .order('created_at', { ascending: false });
      
      if (capData) {
        setCapacidades(capData.map(d => ({
          ...d,
          unidadeCurricularId: d.unidade_curricular_id,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
          tenantId: d.tenant_id
        })));
      }

      // Fetch UCs
      const { data: ucData } = await api
        .from('unidades_curriculares')
        .select('*')
        .eq('tenant_id', profile.tenantId)
        .order('nome', { ascending: true });
      
      if (ucData) setUcs(ucData);

      setLoading(false);
    };

    fetchData();

    // Subscribe to Capacidades
    const capChannel = api.channel('capacidades_tecnicas_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'capacidades_tecnicas',
        filter: `tenant_id=eq.${profile.tenantId}`
      }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      api.removeChannel(capChannel);
    };
  }, [profile]);

  const handleOpenPanel = (capacidade: any = null) => {
    if (capacidade) {
      setEditingCapacidade(capacidade);
      setFormData({
        nome: capacidade.nome,
        descricao: capacidade.descricao || '',
        nivel: capacidade.nivel || 'INTERMEDIARIO',
        unidadeCurricularId: capacidade.unidadeCurricularId || '',
        status: capacidade.status || 'ATIVO'
      });
    } else {
      setEditingCapacidade(null);
      setFormData({
        nome: '',
        descricao: '',
        nivel: 'INTERMEDIARIO',
        unidadeCurricularId: selectedUcFilter !== 'ALL' ? selectedUcFilter : ucs[0]?.id || '',
        status: 'ATIVO'
      });
    }
    setIsPanelOpen(true);
  };

  const handleDelete = async (id: string) => {
     if(window.confirm('Excluir esta Capacidade Técnica? Essa ação pode quebrar trilhas ou dashboards de alunos que já aprenderam isso!')) {
         const { error } = await api
           .from('capacidades_tecnicas')
           .delete()
           .eq('id', id);
         if (error) console.error('Error deleting capacity:', error);
     }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    setSaving(true);
    try {
      const capData = {
        nome: formData.nome,
        descricao: formData.descricao,
        nivel: formData.nivel,
        unidade_curricular_id: formData.unidadeCurricularId,
        status: formData.status,
        updated_at: new Date().toISOString()
      };

      if (editingCapacidade) {
        const { error } = await api
          .from('capacidades_tecnicas')
          .update(capData)
          .eq('id', editingCapacidade.id);
        if (error) throw error;
      } else {
        const { error } = await api
          .from('capacidades_tecnicas')
          .insert({
            ...capData,
            tenant_id: profile.tenantId,
            created_at: new Date().toISOString()
          });
        if (error) throw error;
      }
      setIsPanelOpen(false);
    } catch (error) {
      console.error('Failed to save Capacidade:', error);
    } finally {
      setSaving(false);
    }
  };

  const filteredCaps = capacidades.filter(cap => {
    const matchSearch = cap.nome?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchUc = selectedUcFilter === 'ALL' || cap.unidadeCurricularId === selectedUcFilter;
    return matchSearch && matchUc;
  });

  const getUcName = (ucId: string) => {
     const uc = ucs.find(u => u.id === ucId);
     return uc ? uc.nome : 'Matriz Órfã';
  };

  const getNivelStyle = (nivel: string) => {
      switch(nivel) {
          case 'BASICO': return 'bg-blue-100 text-blue-700 border-blue-200';
          case 'INTERMEDIARIO': return 'bg-amber-100 text-amber-700 border-amber-200';
          case 'AVANCADO': return 'bg-orange-100 text-orange-700 border-orange-200';
          case 'ESPECIALISTA': return 'bg-rose-100 text-rose-700 border-rose-200';
          default: return 'bg-slate-100 text-slate-700 border-slate-200';
      }
  };

  return (
    <div className="space-y-8 pb-12 relative flex h-[calc(100vh-6rem)] overflow-hidden">
      
      <div className="flex-1 overflow-y-auto pr-6 space-y-8 custom-scrollbar">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Capacidades Técnicas</h1>
            <p className="text-slate-500 font-medium mt-1">Matriz de Habilidades Práticas para Motor Avaliativo.</p>
          </div>
          <div className="flex gap-3">
             <button 
               onClick={() => handleOpenPanel()}
               className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all"
             >
               <Plus className="w-4 h-4" /> Mapear Habilidade
             </button>
          </div>
        </header>

        {/* Action Bar & Filters */}
        <section className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input 
               type="text" 
               placeholder="Buscar por verbo ou nome da habilidade..."
               className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-slate-900 transition-all"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <select 
             className="px-6 py-4 bg-slate-50 border-none rounded-xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer min-w-[250px]"
             value={selectedUcFilter}
             onChange={(e) => setSelectedUcFilter(e.target.value)}
          >
             <option value="ALL">Qualquer Unidade Curricular</option>
             {ucs.map(uc => (
                 <option key={uc.id} value={uc.id}>{uc.nome}</option>
             ))}
          </select>
        </section>

        {loading ? (
           <div className="p-12 text-center text-slate-400 animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p className="font-black tracking-widest text-[10px] uppercase">Cruzando nós de conhecimento...</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
             <AnimatePresence>
               {(filteredCaps || []).map(cap => (
                 <motion.div 
                   key={cap.id}
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className={cn(
                     "bg-white rounded-[2rem] border p-6 shadow-sm group hover:shadow-xl transition-all flex flex-col relative overflow-hidden",
                     cap.status === 'INATIVO' ? "border-slate-200 bg-slate-50/50 opacity-70" : "border-slate-200 hover:border-slate-300"
                   )}
                 >
                   {/* Background watermark icon */}
                   <Key className="absolute -right-8 -bottom-8 w-40 h-40 text-slate-50 opacity-50 group-hover:scale-110 transition-transform pointer-events-none" />

                   <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className="flex items-center gap-3">
                         <div className={cn(
                           "p-2.5 rounded-xl text-white shadow-md",
                           cap.status === 'INATIVO' ? "bg-slate-400 shadow-slate-200" : "bg-slate-900 shadow-slate-300"
                         )}>
                            <Network className="w-5 h-5" />
                         </div>
                         <div className="flex flex-col">
                           <span className={cn(
                               "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border w-max mb-1",
                               getNivelStyle(cap.nivel)
                            )}>{cap.nivel}</span>
                         </div>
                      </div>
                      
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenPanel(cap)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-all"
                        >
                           <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(cap.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                           <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                   </div>
                   
                   <h3 className="text-lg font-black italic uppercase tracking-tighter text-slate-900 leading-tight mb-2 relative z-10 pr-4">
                      {cap.nome}
                   </h3>
                   <p className="text-xs font-medium text-slate-500 mb-6 line-clamp-3 leading-relaxed flex-1 relative z-10">
                      {cap.descricao || "Descrição técnica não elaborada para esta competência."}
                   </p>
                   
                   <div className="pt-4 border-t border-slate-100 relative z-10">
                      <div className="flex items-center gap-2">
                          <Library className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest truncate">{getUcName(cap.unidadeCurricularId)}</span>
                      </div>
                   </div>
                 </motion.div>
               ))}
             </AnimatePresence>
             {(filteredCaps || []).length === 0 && (
                <div className="col-span-full py-16 text-center bg-slate-50 border border-dashed border-slate-200 rounded-[3rem]">
                   <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                   <p className="text-slate-500 font-medium">Nenhum nó de Habilidade Mapeado para o filtro atual.</p>
                </div>
             )}
          </div>
        )}
      </div>

      {/* Slide-over Form Panel */}
      <AnimatePresence>
         {isPanelOpen && (
           <motion.div
             initial={{ x: '100%', opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             exit={{ x: '100%', opacity: 0 }}
             transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
             className="w-full md:w-[500px] bg-white border-l border-slate-200 shadow-2xl h-full flex flex-col fixed top-0 right-0 z-50 overflow-hidden"
           >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <h2 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 flex items-center gap-2">
                   <Target className="w-6 h-6 text-indigo-500" />
                   {editingCapacidade ? 'Ajuste de Capacidade' : 'Mapear Capacidade'}
                 </h2>
                 <button onClick={() => setIsPanelOpen(false)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                 <form id="capForm" onSubmit={handleSave} className="space-y-6">
                    <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl mb-6 flex items-start gap-4">
                       <GitCommit className="w-6 h-6 text-indigo-400 shrink-0 mt-0.5" />
                       <p className="text-xs text-indigo-900/80 font-medium leading-relaxed">
                         Capacidades referem-se as entregas práticas ("Programar XYZ", "Desmontar Motor"). Use para construir o arcabouço de simulados.
                       </p>
                    </div>

                    <div className="space-y-2">
                      <label className="micro-label">Amarrar a uma Unidade Curricular</label>
                      <select 
                         required
                         className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-slate-200 transition-all text-slate-900 cursor-pointer"
                         value={formData.unidadeCurricularId}
                         onChange={(e) => setFormData({...formData, unidadeCurricularId: e.target.value})}
                      >
                         <option value="" disabled>Escolha a disciplina raiz...</option>
                         {ucs.map(uc => (
                             <option key={uc.id} value={uc.id}>{uc.nome}</option>
                         ))}
                      </select>
                      {ucs.length === 0 && <p className="text-xs text-red-500 font-medium mt-2">Crie uma Disciplina primeiro para que ela abrigue esta capacidade.</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="micro-label">Verbo de Ação / Título (Aptidão)</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ex: Refatorar Código Assíncrono"
                        className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-50 transition-all"
                        value={formData.nome}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="micro-label">Rubrica de Avaliação (Descrição)</label>
                      <textarea 
                        rows={4}
                        placeholder="Especifique os critérios que comprovam que o aluno obteve essa aptidão..."
                        className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-50 transition-all resize-none"
                        value={formData.descricao}
                        onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="micro-label">Nível Cognitivo/Técnico</label>
                          <select 
                            className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-[10px] font-black uppercase tracking-widest focus:bg-white focus:border-slate-200 transition-all outline-none"
                            value={formData.nivel}
                            onChange={(e) => setFormData({...formData, nivel: e.target.value})}
                          >
                            <option value="BASICO">Básico / Fundamento</option>
                            <option value="INTERMEDIARIO">Intermediário</option>
                            <option value="AVANCADO">Avançado / Sênior</option>
                            <option value="ESPECIALISTA">Arquiteto / Liderança</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="micro-label">Operabilidade</label>
                          <select 
                            className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-[10px] font-black uppercase tracking-widest focus:bg-white focus:border-slate-200 transition-all outline-none"
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                          >
                            <option value="ATIVO">Exigido (Ativo)</option>
                            <option value="INATIVO">Obsoleto (Inativo)</option>
                          </select>
                       </div>
                    </div>
                 </form>
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50 flex gap-4">
                 <button 
                    type="button"
                    onClick={() => setIsPanelOpen(false)}
                    className="px-6 py-5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all flex-1"
                 >
                    Cancelar
                 </button>
                 <button 
                   type="submit"
                   form="capForm"
                   disabled={saving || !formData.unidadeCurricularId}
                   className="flex-[2] flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                 >
                   {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                   {editingCapacidade ? 'Atualizar Conexão' : 'Injetar na Matriz'}
                 </button>
              </div>
           </motion.div>
         )}
      </AnimatePresence>

      <AnimatePresence>
        {isPanelOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setIsPanelOpen(false)}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40" 
          />
        )}
      </AnimatePresence>

    </div>
  );
}
