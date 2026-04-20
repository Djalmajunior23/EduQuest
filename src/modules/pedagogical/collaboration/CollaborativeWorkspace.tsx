import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users2, MessageSquare, ListTodo, Award, Star, 
  Send, Paperclip, MoreVertical, CheckCircle2,
  Clock, AlertCircle, Sparkles, Brain, Plus, Users, Calendar
} from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../lib/AuthContext';
import { cn } from '../../../lib/utils';

interface GroupTask {
  id: string;
  titulo: string;
  responsavelId: string;
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA';
  deadline: any;
}

export default function CollaborativeWorkspace() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'CHAT' | 'TASKS' | 'RUBRICS'>('TASKS');
  const [myGroup, setMyGroup] = useState<any>(null);
  const [tasks, setTasks] = useState<GroupTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock simulation context
    setMyGroup(null);
    setTasks([]);
    setLoading(false);
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="bg-indigo-600 p-4 rounded-3xl shadow-2xl shadow-indigo-200">
            <Users2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
               <span className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em]">Workshop Colaborativo</span>
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
               {myGroup?.nome || 'Minha Equipe'}
            </h1>
          </div>
        </div>

        <div className="flex bg-white p-1.5 border border-slate-200 rounded-2xl shadow-sm">
           {[
             { id: 'TASKS', icon: ListTodo, label: 'Tarefas' },
             { id: 'CHAT', icon: MessageSquare, label: 'Discussão' },
             { id: 'RUBRICS', icon: Award, label: 'Avaliação' }
           ].map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={cn(
                 "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                 activeTab === tab.id 
                  ? "bg-slate-900 text-white shadow-lg" 
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
               )}
             >
               <tab.icon className="w-4 h-4" />
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: Group Members */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Membros do Grupo</h3>
            <div className="space-y-4">
               {myGroup?.membros.map((membro: any) => (
                 <div key={membro.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border-2 border-slate-100 overflow-hidden">
                        <img src={membro.avatar} alt={membro.nome} referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{membro.nome}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Estudante</p>
                      </div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
               ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group">
            <div className="relative z-10">
              <Brain className="w-8 h-8 text-indigo-300 mb-4" />
              <h3 className="font-black text-lg leading-tight mb-2 italic tracking-tight">Análise Holística do Grupo</h3>
              <p className="text-indigo-100 text-xs font-medium leading-relaxed opacity-80">
                A IA detectou que seu grupo tem forte harmonia técnica, mas precisa focar na divisão de tarefas práticas para o prazo final.
              </p>
            </div>
            <Sparkles className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 group-hover:rotate-12 transition-transform" />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
             {activeTab === 'TASKS' && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="space-y-6"
               >
                 <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Fluxo de Entregas</h2>
                    <button className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 px-4 py-2 rounded-xl transition-all">
                      <Plus className="w-4 h-4" /> Nova Tarefa
                    </button>
                 </div>

                 <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                   <div className="divide-y divide-slate-100">
                      {tasks.map((task) => (
                        <div key={task.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
                          <div className="flex items-center gap-5">
                             <div className={cn(
                               "w-12 h-12 rounded-2xl flex items-center justify-center",
                               task.status === 'CONCLUIDA' ? "bg-emerald-50 text-emerald-600" :
                               task.status === 'EM_ANDAMENTO' ? "bg-blue-50 text-blue-600" :
                               "bg-slate-50 text-slate-400"
                             )}>
                               {task.status === 'CONCLUIDA' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                             </div>
                             <div>
                               <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{task.titulo}</h4>
                               <div className="flex items-center gap-4 mt-1">
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                   <Users className="w-3 h-3" /> {myGroup?.membros.find((m: any) => m.id === task.responsavelId)?.nome}
                                 </span>
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> 14 Out
                                 </span>
                               </div>
                             </div>
                          </div>
                          
                          <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-200 rounded-xl transition-all text-slate-400">
                             <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                   </div>
                 </div>
               </motion.div>
             )}

             {activeTab === 'CHAT' && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="bg-white border border-slate-200 rounded-3xl h-[600px] flex flex-col overflow-hidden"
               >
                 <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30">
                    <div className="flex justify-center">
                       <span className="bg-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Hoje</span>
                    </div>

                    <div className="flex items-start gap-3">
                       <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden">
                          <img src="https://i.pravatar.cc/150?u=2" alt="Avatar" referrerPolicy="no-referrer" />
                       </div>
                       <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[80%]">
                          <p className="text-xs font-bold text-indigo-600 mb-1">Maria Oliveira</p>
                          <p className="text-sm text-slate-800">Pessoal, já finalizei a pesquisa de hardware. Alguém pode revisar os specs?</p>
                       </div>
                    </div>

                    <div className="flex items-start gap-3 flex-row-reverse">
                       <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden">
                          <img src="https://i.pravatar.cc/150?u=1" alt="Avatar" referrerPolicy="no-referrer" />
                       </div>
                       <div className="bg-slate-900 text-white p-3 rounded-2xl rounded-tr-none shadow-sm max-w-[80%]">
                          <p className="text-sm">Vou olhar agora mesmo! Focando na integração com o PLC.</p>
                       </div>
                    </div>
                 </div>

                 <div className="p-4 border-t border-slate-100 flex items-center gap-3">
                    <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                       <Paperclip className="w-5 h-5" />
                    </button>
                    <input 
                      type="text" 
                      placeholder="Mande uma mensagem para o grupo..."
                      className="flex-1 bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                    />
                    <button className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-slate-900 transition-all shadow-lg shadow-indigo-100">
                       <Send className="w-5 h-5" />
                    </button>
                 </div>
               </motion.div>
             )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
