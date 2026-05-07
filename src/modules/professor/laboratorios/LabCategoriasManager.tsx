import { api } from '../../../lib/api';


import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import {   Building2, Search, Plus, Filter, Library,
  Edit3, X, Save, Loader2, Tags, Trash2, FlaskConical
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { LaboratorioCategoria, laboratorioService } from '../../../services/laboratorioService';export default function LabCategoriasManager() {
  const { profile } = useAuth();
  const [categorias, setCategorias] = useState<LaboratorioCategoria[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [ucs, setUcs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Side Panel State for Creating/Editing
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<LaboratorioCategoria | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    cursoId: '',
    unidadeCurricularId: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile?.tenantId) return;

    const fetchData = async () => {
      // Fetch Categorias
      const { data: catData } = await api
        .from('laboratorio_categorias')
        .select('*')
        .eq('tenant_id', profile.tenantId)
        .order('created_at', { ascending: false });
      
      if (catData) {
        setCategorias(catData.map(d => ({
          ...d,
          tenantId: d.tenant_id,
          cursoId: d.curso_id,
          unidadeCurricularId: d.unidade_curricular_id,
          createdAt: d.created_at
        } as LaboratorioCategoria)));
      }

      // Fetch Courses
      const { data: courseData } = await api
        .from('cursos')
        .select('*')
        .eq('tenant_id', profile.tenantId);
      
      if (courseData) setCourses(courseData);

      // Fetch UCs
      const { data: ucData } = await api
        .from('unidades_curriculares')
        .select('*')
        .eq('tenant_id', profile.tenantId);
      
      if (ucData) {
        setUcs(ucData.map(u => ({ ...u, cursoId: u.curso_id })));
      }

      setLoading(false);
    };

    fetchData();

    // Subscribe to categories
    const catChannel = api.channel('laboratorio_categorias_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'laboratorio_categorias',
        filter: `tenant_id=eq.${profile.tenantId}`
      }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      api.removeChannel(catChannel);
    };
  }, [profile]);

  const handleOpenPanel = (categoria: LaboratorioCategoria | null = null) => {
    if (categoria) {
      setEditingCategoria(categoria);
      setFormData({
        nome: categoria.nome,
        descricao: categoria.descricao || '',
        cursoId: categoria.cursoId || '',
        unidadeCurricularId: categoria.unidadeCurricularId || ''
      });
    } else {
      setEditingCategoria(null);
      setFormData({
        nome: '',
        descricao: '',
        cursoId: '',
        unidadeCurricularId: ''
      });
    }
    setIsPanelOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.tenantId) return;
    
    setSaving(true);
    try {
      if (editingCategoria && editingCategoria.id) {
        await laboratorioService.updateCategoria(editingCategoria.id, {
          ...formData
        });
      } else {
        await laboratorioService.createCategoria({
          ...formData,
          tenantId: profile.tenantId
        });
      }
      setIsPanelOpen(false);
    } catch (error) {
      console.error('Failed to save categoria:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
     if(window.confirm('Tem certeza que deseja excluir esta Categoria? Isso pode afetar laboratórios vinculados.')) {
         await laboratorioService.deleteCategoria(id);
     }
  };

  const filteredCategorias = categorias.filter(c => 
    c.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCourseName = (courseId?: string) => {
     if (!courseId) return 'Geral / Sem Vínculo';
     const course = courses.find(c => c.id === courseId);
     return course ? course.nome : 'Curso Bloqueado/Excluído';
  };

  const getUcName = (ucId?: string) => {
     if (!ucId) return 'Geral / Sem Vínculo';
     const uc = ucs.find(u => u.id === ucId);
     return uc ? uc.nome : 'UC Bloqueada/Excluída';
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
         <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
               <Tags className="w-6 h-6" />
             </div>
             <div>
                <h2 className="text-xl font-black uppercase text-slate-900 tracking-tighter">Categorias de Lab</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Organização Prática</p>
             </div>
         </div>
         <button 
           onClick={() => handleOpenPanel()}
           className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-indigo-700 transition"
         >
           <Plus className="w-4 h-4"/> Nova Categoria
         </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {(filteredCategorias || []).map((cat) => (
              <motion.div 
                key={cat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col group relative"
              >
                 <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-black uppercase leading-tight text-slate-900 pr-8">{cat.nome}</h3>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-6 top-6">
                       <button onClick={() => handleOpenPanel(cat)} className="p-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-400 transition">
                         <Edit3 className="w-4 h-4" />
                       </button>
                       <button onClick={() => handleDelete(cat.id!)} className="p-2 bg-slate-50 hover:bg-red-50 hover:text-red-500 rounded-lg text-slate-400 transition">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                 </div>

                 <p className="text-sm text-slate-500 mb-6 flex-1">{cat.descricao || 'Sem descrição.'}</p>
                 
                 <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                       <Building2 className="w-4 h-4 text-slate-400" />
                       <span className="text-xs font-bold text-slate-600">{getCourseName(cat.cursoId)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Library className="w-4 h-4 text-slate-400" />
                       <span className="text-xs font-bold text-slate-600">{getUcName(cat.unidadeCurricularId)}</span>
                    </div>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {(filteredCategorias || []).length === 0 && (
            <div className="col-span-full p-10 text-center border-2 border-dashed border-slate-200 rounded-3xl text-slate-500">
               Nenhuma categoria cadastrada.
            </div>
          )}
        </div>
      )}

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
                   {editingCategoria ? 'Editar Categoria' : 'Nova Categoria'}
                 </h2>
                 <button onClick={() => setIsPanelOpen(false)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                 <form id="catForm" onSubmit={handleSave} className="space-y-6">
                    <div className="space-y-2">
                      <label className="micro-label">Nome da Categoria</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ex: Laboratórios de Redes"
                        className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-50 transition-all"
                        value={formData.nome}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="micro-label">Descrição</label>
                      <textarea 
                        rows={4}
                        placeholder="Informações sobre o escopo destes laboratórios..."
                        className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-50 transition-all resize-none"
                        value={formData.descricao}
                        onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="micro-label">Vincular Curso (Opcional)</label>
                      <select 
                         className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-slate-200 transition-all text-slate-900 cursor-pointer"
                         value={formData.cursoId}
                         onChange={(e) => setFormData({...formData, cursoId: e.target.value})}
                      >
                         <option value="">Geral / Sem Vínculo</option>
                         {courses.map(course => (
                             <option key={course.id} value={course.id}>{course.nome}</option>
                         ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="micro-label">Vincular Unidade Curricular (Opcional)</label>
                      <select 
                         className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-slate-200 transition-all text-slate-900 cursor-pointer"
                         value={formData.unidadeCurricularId}
                         onChange={(e) => setFormData({...formData, unidadeCurricularId: e.target.value})}
                      >
                         <option value="">Geral / Sem Vínculo</option>
                         {ucs
                            .filter(uc => !formData.cursoId || uc.cursoId === formData.cursoId)
                            .map(uc => (
                             <option key={uc.id} value={uc.id}>{uc.nome}</option>
                         ))}
                      </select>
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
                   form="catForm"
                   disabled={saving}
                   className="flex-[2] flex items-center justify-center gap-3 px-8 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                 >
                   {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                   {editingCategoria ? 'Salvar Edição' : 'Criar Categoria'}
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
