import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { 
  BookOpen, 
  Clock, 
  Plus, 
  Play, 
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';

export default function ExamList() {
  const { profile } = useAuth();
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredExams = exams
    .filter(exam => 
      exam.title.toLowerCase().includes(search.toLowerCase()) &&
      (filterActive === 'all' || (filterActive === 'active' ? exam.active : !exam.active))
    )
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      if (sortBy === 'questions') return (b.question_ids?.length || 0) - (a.question_ids?.length || 0);
      return 0;
    });

  useEffect(() => {
    async function fetchExams() {
      try {
        let query = supabase.from('exams').select('*');
        
        if (profile?.role === 'student') {
          query = query.eq('active', true);
        } else {
          query = query.eq('teacher_id', profile?.id);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        setExams(data || []);
      } catch (error) {
        console.error('Error fetching exams:', error);
      } finally {
        setLoading(false);
      }
    }

    if (profile) fetchExams();
  }, [profile]);

  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1,2,3].map(i => <div key={i} className="h-48 bg-slate-200 animate-pulse rounded-2xl"></div>)}
    </div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Simulados</h1>
          <p className="text-slate-500">Explore atividades disponíveis ou gerencie as suas.</p>
        </div>
        
        {profile?.role === 'teacher' && (
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Simulado
          </button>
        )}
      </div>

      {/* Filters & Sorting */}
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar simulado..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <select 
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Status: Todos</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </select>

        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Mais Recentes</option>
          <option value="questions">Mais Questões</option>
        </select>
      </div>

      {/* Exam Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => (
          <motion.div
            key={exam.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className={cn(
                "px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider",
                exam.active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
              )}>
                {exam.active ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">{exam.title}</h3>
            <p className="text-sm text-slate-500 mb-6 line-clamp-2">{exam.description}</p>

            <div className="mt-auto space-y-4">
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {exam.time_limit} min
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {exam.question_ids?.length || 0} questões
                </div>
              </div>

              <Link
                to={`/exams/${exam.id}`}
                className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-2 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
              >
                <Play className="w-4 h-4 fill-current" />
                Começar
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {exams.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Nenhum simulado encontrado.</p>
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl relative"
            >
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 mb-6">Configurar Novo Simulado</h2>
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newExam = {
                  title: formData.get('title') as string,
                  description: formData.get('description') as string,
                  time_limit: parseInt(formData.get('timeLimit') as string),
                  num_questions: parseInt(formData.get('numQuestions') as string),
                  active: true,
                  teacher_id: profile?.id,
                  created_at: new Date().toISOString(),
                  question_ids: [] // In a real scenario, we would pick these or generate them
                };

                try {
                  setLoading(true);
                  const { data, error } = await supabase.from('exams').insert(newExam).select().single();
                  if (error) throw error;
                  setExams(prev => [data, ...prev]);
                  setIsCreateModalOpen(false);
                } catch (err) {
                  console.error(err);
                } finally {
                  setLoading(false);
                }
              }} className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Título do Simulado</label>
                  <input name="title" required className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Fundamentos de Web" />
                </div>
                
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Descrição</label>
                  <textarea name="description" required className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 min-h-[100px]" placeholder="Breve resumo para os alunos..." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Qtd. Questões</label>
                    <input name="numQuestions" type="number" required min="1" className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500" placeholder="10" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Tempo (min)</label>
                    <input name="timeLimit" type="number" required min="1" className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500" placeholder="60" />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-800"
                  >
                    Confirmar Criação
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
