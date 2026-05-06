import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Search, Plus, Filter, MoreVertical, 
  Settings2, Activity, Archive, Edit3, X, Save, 
  Loader2, GraduationCap, Clock, Layers
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Link } from 'react-router-dom';

export default function CourseManager() {
  const { profile } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Side Panel State for Creating/Editing
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    cargaHoraria: 0,
    modalidade: 'PRESENCIAL',
    nivel: 'TECNICO',
    status: 'ATIVO'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile?.tenantId) return;

    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from('cursos')
        .select('*')
        .eq('tenant_id', profile.tenantId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching courses:', error);
      } else {
        setCourses((data || []).map(d => ({
          ...d,
          cargaHoraria: d.carga_horaria,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
          tenantId: d.tenant_id
        })));
      }
      setLoading(false);
    };

    fetchCourses();

    // Subscribe to courses
    const channel = supabase.channel('cursos_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'cursos',
        filter: `tenant_id=eq.${profile.tenantId}`
      }, () => {
        fetchCourses();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile]);

  const handleOpenPanel = (course: any = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        nome: course.nome,
        descricao: course.descricao || '',
        cargaHoraria: course.cargaHoraria || 0,
        modalidade: course.modalidade || 'PRESENCIAL',
        nivel: course.nivel || 'TECNICO',
        status: course.status || 'ATIVO'
      });
    } else {
      setEditingCourse(null);
      setFormData({
        nome: '',
        descricao: '',
        cargaHoraria: 0,
        modalidade: 'PRESENCIAL',
        nivel: 'TECNICO',
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
      const courseData = {
        nome: formData.nome,
        descricao: formData.descricao,
        carga_horaria: Number(formData.cargaHoraria),
        modalidade: formData.modalidade,
        nivel: formData.nivel,
        status: formData.status,
        updated_at: new Date().toISOString()
      };

      if (editingCourse) {
        const { error } = await supabase
          .from('cursos')
          .update(courseData)
          .eq('id', editingCourse.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cursos')
          .insert({
            ...courseData,
            tenant_id: profile.tenantId,
            created_at: new Date().toISOString()
          });
        if (error) throw error;
      }
      setIsPanelOpen(false);
    } catch (error) {
      console.error('Failed to save course:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusToggle = async (courseId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ATIVO' ? 'INATIVO' : 'ATIVO';
    try {
      const { error } = await supabase
        .from('cursos')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', courseId);
      if (error) throw error;
    } catch (error) {
      console.error('Failed to toggle status', error);
    }
  };

  const filteredCourses = courses.filter(c => 
    c.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 relative flex h-[calc(100vh-6rem)] overflow-hidden">
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pr-6 space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Matriz Curricular</h1>
            <p className="text-slate-500 font-medium mt-1">Gestão de Grades, Níveis e Status Educacional.</p>
          </div>
          <div className="flex gap-3">
             <button 
               onClick={() => handleOpenPanel()}
               className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all"
             >
               <Plus className="w-4 h-4" /> Nova Matriz
             </button>
          </div>
        </header>

        {/* Filters */}
        <section className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input 
               type="text" 
               placeholder="Pesquisar catálogo de ensino..."
               className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-slate-900 transition-all"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <button className="flex items-center gap-2 px-6 py-4 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-200">
             <Filter className="w-4 h-4" /> Relatórios
          </button>
        </section>

        {/* Grid List */}
        {loading ? (
           <div className="p-12 text-center text-slate-400 animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p className="font-black tracking-widest text-[10px] uppercase">Lendo Base de Conhecimento...</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <AnimatePresence>
               {filteredCourses.map(course => (
                 <motion.div 
                   key={course.id}
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className={cn(
                     "bg-white rounded-[2rem] border p-8 shadow-sm group hover:shadow-xl transition-all flex flex-col",
                     course.status === 'INATIVO' ? "border-slate-200 opacity-60" : "border-slate-200 hover:border-indigo-200"
                   )}
                 >
                   <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                         <div className={cn(
                           "p-3 rounded-2xl",
                           course.status === 'INATIVO' ? "bg-slate-100 text-slate-400" : "bg-indigo-50 text-indigo-600"
                         )}>
                            <BookOpen className="w-6 h-6" />
                         </div>
                         <div>
                            <span className={cn(
                               "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                               course.status === 'ATIVO' ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-500"
                            )}>{course.status}</span>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">{course.nivel} • {course.modalidade}</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => handleOpenPanel(course)}
                        className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                      >
                         <Edit3 className="w-5 h-5" />
                      </button>
                   </div>
                   
                   <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                      {course.nome}
                   </h3>
                   <p className="text-sm font-medium text-slate-500 mb-8 line-clamp-2 leading-relaxed flex-1">
                      {course.descricao || "Sem descrição disponível para esta estrutura."}
                   </p>
                   
                   <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                      <div className="flex gap-4">
                         <div className="flex items-center gap-2 text-slate-500">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{course.cargaHoraria}h</span>
                         </div>
                      </div>
                      <div className="flex gap-2">
                         {/* This will act as link into the specific detail dashboard in future phase */}
                         <button className="text-[10px] font-black bg-slate-900 text-white px-4 py-2 rounded-xl uppercase tracking-widest hover:bg-indigo-600 transition-colors">
                            Abrir Grade
                         </button>
                      </div>
                   </div>
                 </motion.div>
               ))}
             </AnimatePresence>
             {filteredCourses.length === 0 && (
                <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 rounded-[3rem]">
                   <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                   <p className="text-slate-500 font-medium">Nenhuma matriz curricular localizada com os filtros atuais.</p>
                </div>
             )}
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
                   {editingCourse ? 'Edição Estrutural' : 'Nova Matriz Pedagógica'}
                 </h2>
                 <button onClick={() => setIsPanelOpen(false)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                 <form id="courseForm" onSubmit={handleSave} className="space-y-6">
                    <div className="space-y-2">
                      <label className="micro-label">Nome Oficial do Curso</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ex: Téc. Eletroeletrônica"
                        className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-50 transition-all"
                        value={formData.nome}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="micro-label">Ementa Curta / Descrição</label>
                      <textarea 
                        rows={4}
                        placeholder="Forneça uma sinopse do escopo de ensino deste modelo..."
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
                          <label className="micro-label">Status Operacional</label>
                          <select 
                            className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-[10px] font-black uppercase tracking-widest focus:bg-white focus:border-slate-200 transition-all"
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                          >
                            <option value="ATIVO">Liberado (Ativo)</option>
                            <option value="INATIVO">Arquivado (Inativo)</option>
                          </select>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="micro-label">Modalidade</label>
                          <select 
                            className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-[10px] font-black uppercase tracking-widest focus:bg-white focus:border-slate-200 transition-all"
                            value={formData.modalidade}
                            onChange={(e) => setFormData({...formData, modalidade: e.target.value})}
                          >
                            <option value="PRESENCIAL">Presencial</option>
                            <option value="EAD">Remoto (EAD)</option>
                            <option value="HIBRIDO">Híbrido</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="micro-label">Nível Instrucional</label>
                          <select 
                            className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-[10px] font-black uppercase tracking-widest focus:bg-white focus:border-slate-200 transition-all"
                            value={formData.nivel}
                            onChange={(e) => setFormData({...formData, nivel: e.target.value})}
                          >
                            <option value="BASICO">Básico / Curto</option>
                            <option value="QUALIFICACAO">Qualificação</option>
                            <option value="TECNICO">Formação Técnica</option>
                            <option value="AVANCADO">Pós / Avançado</option>
                          </select>
                       </div>
                    </div>
                 </form>
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50">
                 <button 
                   type="submit"
                   form="courseForm"
                   disabled={saving}
                   className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                 >
                   {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                   {editingCourse ? 'Gravar Alterações' : 'Implantar Estrutura'}
                 </button>
              </div>
           </motion.div>
         )}
      </AnimatePresence>

      {/* Backdrop for Slide-over */}
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
