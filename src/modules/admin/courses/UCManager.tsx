import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Search, Plus, Filter, MoreVertical, 
  Library, Clock, FileText, CheckCircle2, AlertCircle, Edit3, X, Save, 
  Loader2, Tags
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function UCManager() {
  const { profile } = useAuth();
  const [ucs, setUcs] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');
  
  // Side Panel State for Creating/Editing
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingUc, setEditingUc] = useState<any>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    cargaHoraria: 0,
    cursoId: '',
    status: 'ATIVO'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile?.tenantId) return;

    const fetchData = async () => {
      // Fetch UCs
      const { data: ucData } = await supabase
        .from('unidades_curriculares')
        .select('*')
        .eq('tenant_id', profile.tenantId)
        .order('created_at', { ascending: false });
      
      if (ucData) {
        setUcs(ucData.map(d => ({
          ...d,
          cursoId: d.curso_id,
          cargaHoraria: d.carga_horaria,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
          tenantId: d.tenant_id
        })));
      }

      // Fetch Courses
      const { data: courseData } = await supabase
        .from('cursos')
        .select('*')
        .eq('tenant_id', profile.tenantId)
        .order('nome', { ascending: true });
      
      if (courseData) setCourses(courseData);

      setLoading(false);
    };

    fetchData();

    // Subscribe to UCs
    const ucChannel = supabase.channel('unidades_curriculares_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'unidades_curriculares',
        filter: `tenant_id=eq.${profile.tenantId}`
      }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ucChannel);
    };
  }, [profile]);

  const handleOpenPanel = (uc: any = null) => {
    if (uc) {
      setEditingUc(uc);
      setFormData({
        nome: uc.nome,
        descricao: uc.descricao || '',
        cargaHoraria: uc.cargaHoraria || 0,
        cursoId: uc.cursoId || '',
        status: uc.status || 'ATIVO'
      });
    } else {
      setEditingUc(null);
      setFormData({
        nome: '',
        descricao: '',
        cargaHoraria: 0,
        cursoId: selectedCourseFilter !== 'ALL' && selectedCourseFilter !== 'ORPHAN' ? selectedCourseFilter : '',
        status: 'ATIVO'
      });
    }
    setIsPanelOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    setSaving(true);
    try {
      const ucData = {
        nome: formData.nome,
        descricao: formData.descricao,
        carga_horaria: Number(formData.cargaHoraria),
        curso_id: formData.cursoId || null,
        status: formData.status,
        updated_at: new Date().toISOString()
      };

      if (editingUc) {
        const { error } = await supabase
          .from('unidades_curriculares')
          .update(ucData)
          .eq('id', editingUc.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('unidades_curriculares')
          .insert({
            ...ucData,
            tenant_id: profile.tenantId,
            created_at: new Date().toISOString()
          });
        if (error) throw error;
      }
      setIsPanelOpen(false);
    } catch (error) {
      console.error('Failed to save UC:', error);
    } finally {
      setSaving(false);
    }
  };

  const filteredUcs = ucs.filter(uc => {
    const matchSearch = uc.nome?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchCourse = false;
    if (selectedCourseFilter === 'ALL') {
      matchCourse = true;
    } else if (selectedCourseFilter === 'ORPHAN') {
      matchCourse = !courses.some(c => c.id === uc.cursoId);
    } else {
      matchCourse = uc.cursoId === selectedCourseFilter;
    }

    return matchSearch && matchCourse;
  });

  const getCourseDetails = (courseId: string) => {
     if (!courseId) return { nome: 'Sem Curso Associado', isOrphan: true };
     const course = courses.find(c => c.id === courseId);
     return course ? { nome: course.nome, isOrphan: false } : { nome: 'Curso Órfão / Não Encontrado', isOrphan: true };
  };

  return (
    <div className="space-y-8 pb-12 relative flex h-[calc(100vh-6rem)] overflow-hidden">
      
      <div className="flex-1 overflow-y-auto pr-6 space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Unidades Curriculares</h1>
            <p className="text-slate-500 font-medium mt-1">Disciplinas técnicas e blocos de competência letivos.</p>
          </div>
          <div className="flex gap-3">
             <button 
               onClick={() => handleOpenPanel()}
               className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all"
             >
               <Plus className="w-4 h-4" /> Cadastrar UC
             </button>
          </div>
        </header>

        {/* Action Bar & Filters */}
        <section className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input 
               type="text" 
               placeholder="Busque por nome da disciplina..."
               className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-slate-900 transition-all"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <select 
             className="px-6 py-4 bg-slate-50 border-none rounded-xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-slate-900 transition-all"
             value={selectedCourseFilter}
             onChange={(e) => setSelectedCourseFilter(e.target.value)}
          >
             <option value="ALL">Todos os Cursos Matriciais</option>
             <option value="ORPHAN">Apenas UCs Órfãs (Sem Curso)</option>
             {courses.map(course => (
                 <option key={course.id} value={course.id}>{course.nome}</option>
             ))}
          </select>
        </section>

        {loading ? (
           <div className="p-12 text-center text-slate-400 animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p className="font-black tracking-widest text-[10px] uppercase">Carregando Banco Acadêmico...</p>
           </div>
        ) : (
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                         <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Disciplina (UC)</th>
                         <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Grade Pai (Curso)</th>
                         <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Carga Horária</th>
                         <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                         <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Ações</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      <AnimatePresence>
                        {filteredUcs.map((uc) => (
                          <motion.tr 
                            key={uc.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="hover:bg-slate-50/50 transition-colors group"
                          >
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                   <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-black italic shadow-lg",
                                     uc.status === 'ATIVO' ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-400"
                                   )}>
                                     <Library className="w-5 h-5" />
                                   </div>
                                   <div>
                                      <p className="text-sm font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors cursor-pointer">{uc.nome}</p>
                                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-0.5 line-clamp-1">{uc.descricao || 'Sem descrição'}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-2">
                                  <Building2 className={cn("w-4 h-4", getCourseDetails(uc.cursoId).isOrphan ? "text-red-400" : "text-slate-400")} />
                                  <span className={cn("text-xs font-bold line-clamp-1", getCourseDetails(uc.cursoId).isOrphan ? "text-red-500" : "text-slate-600")}>
                                    {getCourseDetails(uc.cursoId).nome}
                                  </span>
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-1.5 text-slate-500">
                                   <Clock className="w-4 h-4" />
                                   <span className="text-[10px] font-black uppercase tracking-widest">{uc.cargaHoraria}h</span>
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                <span className={cn(
                                  "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                  uc.status === 'ATIVO' ? "bg-emerald-100 text-emerald-600 border border-emerald-200" : "bg-slate-100 text-slate-500 border border-slate-200"
                                )}>
                                  {uc.status}
                                </span>
                             </td>
                             <td className="px-8 py-6 text-right">
                                <button 
                                  onClick={() => handleOpenPanel(uc)}
                                  className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"
                                  title="Editar Estrutura"
                                >
                                   <Edit3 className="w-5 h-5" />
                                </button>
                             </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                   </tbody>
                </table>
                {filteredUcs.length === 0 && (
                   <div className="py-16 text-center text-slate-400 bg-slate-50/50">
                      <Library className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                      <p className="font-black tracking-widest text-[10px] uppercase">Nenhuma UC encontrada no filtro.</p>
                   </div>
                )}
             </div>
          </div>
        )}
      </div>

      {/* Slide-over Registration Panel */}
      <AnimatePresence>
         {isPanelOpen && (
           <motion.div
             initial={{ x: '100%', opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             exit={{ x: '100%', opacity: 0 }}
             transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
             className="w-full md:w-[480px] bg-white border-l border-slate-200 shadow-2xl h-full flex flex-col fixed top-0 right-0 z-50 overflow-hidden"
           >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <h2 className="text-xl font-black italic uppercase tracking-tighter text-slate-900">
                   {editingUc ? 'Atualizar UC' : 'Registrar Nova UC'}
                 </h2>
                 <button onClick={() => setIsPanelOpen(false)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                 <form id="ucForm" onSubmit={handleSave} className="space-y-6">
                    <div className="space-y-2">
                      <label className="micro-label">Atribuição de Matriz Curricular (Curso Pai)</label>
                      <select 
                         required
                         className={cn(
                           "w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-slate-200 transition-all cursor-pointer",
                           (formData.cursoId && !courses.find(c => c.id === formData.cursoId)) ? "text-red-900 bg-red-50 ring-4 ring-red-100" : "text-slate-900"
                         )}
                         value={formData.cursoId}
                         onChange={(e) => setFormData({...formData, cursoId: e.target.value})}
                      >
                         <option value="" disabled>Selecione um curso alvo...</option>
                         {courses.map(course => (
                             <option key={course.id} value={course.id}>{course.nome}</option>
                         ))}
                         {formData.cursoId && !courses.find(c => c.id === formData.cursoId) && (
                            <option value={formData.cursoId} disabled hidden>
                               ⚠️ Curso Anterior Excluído (Órfão)
                            </option>
                         )}
                      </select>
                      {formData.cursoId && !courses.find(c => c.id === formData.cursoId) && (
                         <div className="flex items-start gap-2 mt-3 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="text-[10px] font-black uppercase tracking-[0.1em] leading-relaxed">
                               O curso vinculado a esta unidade foi deletado do sistema. Por favor, reatribua a um curso válido.
                            </p>
                         </div>
                      )}
                      
                      {courses.length === 0 && <p className="text-xs text-amber-500 font-medium mt-2">Você precisa criar ao menos um Curso primeiro.</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="micro-label">Nome Oficial da Unidade Curricular</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ex: Introdução à Lógica de Programação"
                        className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-50 transition-all"
                        value={formData.nome}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="micro-label">Ementa Curta / Descrição Ténica</label>
                      <textarea 
                        rows={4}
                        placeholder="Descreva as competências abordadas nesta trilha..."
                        className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-50 transition-all resize-none"
                        value={formData.descricao}
                        onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="micro-label">Carga Horária (Hs)</label>
                          <input 
                            type="number" 
                            required
                            min="0"
                            className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-slate-200 transition-all"
                            value={formData.cargaHoraria}
                            onChange={(e) => setFormData({...formData, cargaHoraria: Number(e.target.value)})}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="micro-label">Status Sistêmico</label>
                          <select 
                            className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-[10px] font-black uppercase tracking-widest focus:bg-white focus:border-slate-200 transition-all"
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                          >
                            <option value="ATIVO">Habilitada (Ativa)</option>
                            <option value="INATIVO">Suspensa (Inativa)</option>
                          </select>
                       </div>
                    </div>
                    
                    {editingUc && (
                       <div className="mt-8 border border-dashed border-slate-300 p-6 rounded-2xl bg-indigo-50/50 hover:bg-indigo-50 transition-colors flex items-center justify-between cursor-pointer group">
                          <div>
                             <h4 className="text-sm font-black text-indigo-900 group-hover:text-indigo-600 transition-colors">Vincular Capacidades & Conhecimentos</h4>
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Ferramenta avançada</p>
                          </div>
                          <Tags className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                       </div>
                    )}
                 </form>
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50">
                 <button 
                   type="submit"
                   form="ucForm"
                   disabled={saving || courses.length === 0}
                   className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                 >
                   {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                   {editingUc ? 'Gravar Alterações' : 'Implantar Disciplina'}
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
