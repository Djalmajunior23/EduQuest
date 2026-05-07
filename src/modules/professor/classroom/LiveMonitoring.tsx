import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  Clock,
  ChevronRight,
  Loader2,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sessionService, ClassSession } from '../../../services/sessionService';

export default function LiveMonitoring({ sessionId }: { sessionId: string }) {
  const [session, setSession] = useState<ClassSession | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'HELP' | 'FINISHED'>('ALL');

  useEffect(() => {
    const unsubscribe = sessionService.subscribeToSession(sessionId, (data) => {
      setSession(data);
    });
    return () => unsubscribe();
  }, [sessionId]);

  if (!session) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" /></div>;

  const students = Object.entries(session.studentsProgress).map(([id, data]) => ({ id, ...data }));
  const helpNeeded = students.filter(s => s.status === 'HELP_NEEDED');
  const finished = students.filter(s => s.status === 'FINISHED');

  const filteredStudents = 
    activeTab === 'HELP' ? helpNeeded :
    activeTab === 'FINISHED' ? finished :
    students;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2">
              <span className="w-2 h-2 bg-rose-600 rounded-full animate-pulse" /> Live Now
            </span>
            <span className="text-slate-400 font-bold text-xs">Sessão: {session.atividadeId}</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Monitoramento em Tempo Real</h1>
        </div>

        <div className="flex gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 flex items-center gap-4">
             <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase">Presentes</p>
                <p className="text-xl font-black text-slate-900">{(students || []).length}</p>
             </div>
             <div className="w-px h-8 bg-slate-100" />
             <div className="text-center">
                <p className="text-[10px] font-black text-rose-500 uppercase">Dificuldade</p>
                <p className="text-xl font-black text-rose-600">{helpNeeded.length}</p>
             </div>
          </div>
          <button 
             onClick={() => sessionService.finishSession(sessionId)}
             className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all"
          >
            Encerrar Aula
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-4">
          <button 
            onClick={() => setActiveTab('ALL')}
            className={`w-full p-6 rounded-3xl border transition-all text-left flex items-center justify-between ${activeTab === 'ALL' ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200'}`}
          >
            <div className="flex items-center gap-3 font-bold">
              <Users size={20} /> Todos os Alunos
            </div>
            <span className="text-lg font-black">{(students || []).length}</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('HELP')}
            className={`w-full p-6 rounded-3xl border transition-all text-left flex items-center justify-between ${activeTab === 'HELP' ? 'bg-rose-600 border-rose-600 text-white shadow-xl shadow-rose-100' : 'bg-white border-slate-100 text-slate-500 hover:border-rose-200'}`}
          >
            <div className="flex items-center gap-3 font-bold">
              <AlertCircle size={20} /> Pedidos de Suporte
            </div>
            <span className="text-lg font-black">{helpNeeded.length}</span>
          </button>

          <button 
            onClick={() => setActiveTab('FINISHED')}
            className={`w-full p-6 rounded-3xl border transition-all text-left flex items-center justify-between ${activeTab === 'FINISHED' ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-100' : 'bg-white border-slate-100 text-slate-500 hover:border-emerald-200'}`}
          >
            <div className="flex items-center gap-3 font-bold">
              <CheckCircle2 size={20} /> Concluídos
            </div>
            <span className="text-lg font-black">{finished.length}</span>
          </button>
        </div>

        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {(filteredStudents || []).length === 0 ? (
                <div className="col-span-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] h-64 flex flex-col items-center justify-center text-slate-400">
                   <Activity size={48} className="mb-4 opacity-20" />
                   <p className="font-bold uppercase tracking-widest text-xs">Nenhuma atividade detectada nesta categoria</p>
                </div>
              ) : (
                (filteredStudents || []).map((s, i) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={s.id}
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg shrink-0 uppercase">
                      {s.nome.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">{s.nome}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                        Etapa: {s.currentStep || 'Iniciando...'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                       {s.status === 'HELP_NEEDED' && (
                         <div className="w-3 h-3 bg-rose-600 rounded-full animate-ping" />
                       )}
                       {s.status === 'FINISHED' && (
                         <CheckCircle2 className="text-emerald-500" size={20} />
                       )}
                       <ChevronRight className="text-slate-200 group-hover:text-indigo-300 transition-colors" />
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
