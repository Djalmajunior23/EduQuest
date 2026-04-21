import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, onSnapshot, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { PlusCircle, Zap, Rocket, Cpu, Trophy, Trash2, ListTodo, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export default function MissionManager() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [missions, setMissions] = useState<any[]>([]);
  const [newMission, setNewMission] = useState({ titulo: '', type: 'DIARIA', xp: 100, aiTokens: 0 });

  useEffect(() => {
    if (!profile?.tenantId) return;
    const q = query(
      collection(db, 'missoes'),
      where('tenantId', '==', profile.tenantId),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      setMissions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setFetching(false);
    });
    return () => unsubscribe();
  }, [profile]);

  const addDefaultMissions = async () => {
    if (!profile?.tenantId) return;
    setLoading(true);
    const defaultMissions = [
      { titulo: 'Primeiros Passos no CLI', type: 'DIARIA', xp: 100, aiTokens: 2, tenantId: profile.tenantId },
      { titulo: 'Desafio de Lógica de Redes', type: 'SEMANAL', xp: 500, aiTokens: 10, tenantId: profile.tenantId },
      { titulo: 'Completar 3 laboratórios práticos sobre redes', type: 'SEMANAL', xp: 800, aiTokens: 20, tenantId: profile.tenantId },
      { titulo: 'Mestre da Documentação', type: 'ESPECIAL', xp: 1000, aiTokens: 50, tenantId: profile.tenantId },
    ];
    try {
      const colRef = collection(db, 'missoes');
      for (const mission of defaultMissions) {
        await addDoc(colRef, { ...mission, createdAt: serverTimestamp() });
      }
    } catch (e) {
      console.error(e);
      alert('Erro ao adicionar missões');
    }
    setLoading(false);
  };

  const createCustomMission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.tenantId) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'missoes'), {
        ...newMission,
        tenantId: profile.tenantId,
        createdAt: serverTimestamp()
      });
      setNewMission({ titulo: '', type: 'DIARIA', xp: 100, aiTokens: 0 });
    } catch (e) {
      console.error(e);
      alert('Erro ao criar missão');
    }
    setLoading(false);
  };

  const deleteMission = async (id: string) => {
    if (confirm('Deseja excluir esta missão?')) {
       await deleteDoc(doc(db, 'missoes', id));
    }
  }

  return (
    <div className="space-y-12 pb-20 p-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-10">
        <div>
           <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">
              <Trophy className="w-3 h-3" /> Gestão de Gamificação
           </div>
           <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">
              Quadro de <span className="text-indigo-600">Missões</span>
           </h1>
           <p className="text-slate-500 font-medium mt-1">Configure os desafios e recompensas da economia interna para seus alunos.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* Form Painel */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm sticky top-8">
               <h2 className="text-xl font-black italic uppercase tracking-tighter mb-6 flex items-center gap-3">
                 <PlusCircle className="w-6 h-6 text-indigo-600" /> Nova Missão
               </h2>
               <form onSubmit={createCustomMission} className="space-y-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black tracking-widest uppercase text-slate-400">Objetivo</label>
                   <input 
                     required
                     placeholder="Ex: Completar 3 laboratórios práticos sobre redes" 
                     className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-50 transition-all font-bold text-slate-900"
                     value={newMission.titulo}
                     onChange={(e) => setNewMission({...newMission, titulo: e.target.value})}
                   />
                 </div>
                 
                 <div className="space-y-2">
                   <label className="text-[10px] font-black tracking-widest uppercase text-slate-400">Recorrência</label>
                   <select 
                     value={newMission.type}
                     onChange={(e) => setNewMission({...newMission, type: e.target.value})}
                     className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-slate-200 transition-all text-slate-900 cursor-pointer uppercase tracking-widest"
                   >
                     <option value="DIARIA">Diária</option>
                     <option value="SEMANAL">Semanal</option>
                     <option value="ESPECIAL">Especial / Única</option>
                   </select>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black tracking-widest uppercase text-slate-400 flex items-center gap-1.5"><Zap className="w-3 h-3 text-amber-500" /> Recompensa XP</label>
                       <input 
                         type="number"
                         min="0"
                         required
                         value={newMission.xp || ''}
                         onChange={(e) => setNewMission({...newMission, xp: Number(e.target.value)})}
                         className="w-full px-4 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-black focus:bg-white focus:border-slate-200 transition-all text-slate-900"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black tracking-widest uppercase text-slate-400 flex items-center gap-1.5"><Cpu className="w-3 h-3 text-indigo-500" /> Tokens de IA</label>
                       <input 
                         type="number"
                         min="0"
                         required
                         value={newMission.aiTokens || ''}
                         onChange={(e) => setNewMission({...newMission, aiTokens: Number(e.target.value)})}
                         className="w-full px-4 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-black focus:bg-white focus:border-slate-200 transition-all text-slate-900"
                       />
                    </div>
                 </div>

                 <button 
                   type="submit" 
                   disabled={loading}
                   className="w-full bg-slate-900 text-white px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50"
                 >
                   {loading ? 'Salvando...' : 'Lançar Missão Oficial'}
                 </button>
               </form>

               <div className="mt-8 pt-8 border-t border-slate-100">
                  <button 
                    onClick={addDefaultMissions}
                    disabled={loading}
                    className="w-full bg-indigo-50 text-indigo-600 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Rocket className="w-4 h-4"/> Injetar Missões Blueprint
                  </button>
               </div>
            </div>
         </div>

         {/* Missions List */}
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 px-4 flex items-center gap-2">
               <ListTodo className="w-4 h-4" /> Caderno de Missões Ativas
            </h3>
            
            {fetching ? (
               <div className="py-20 text-center animate-pulse text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
               </div>
            ) : missions.length === 0 ? (
               <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-[3rem] bg-slate-50/50">
                  <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">Nenhuma missão configurada no banco.</p>
               </div>
            ) : (
               <div className="space-y-4">
                 <AnimatePresence>
                   {missions.map((mission) => (
                      <motion.div 
                        key={mission.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white border border-slate-200 p-6 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg transition-all group hover:border-indigo-200"
                      >
                         <div className="flex items-center gap-6">
                            <div className={cn(
                               "w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xs shadow-sm",
                               mission.type === 'DIARIA' ? "bg-blue-50 text-blue-600" :
                               mission.type === 'SEMANAL' ? "bg-purple-50 text-purple-600" : "bg-amber-50 text-amber-600"
                            )}>
                               <Trophy className="w-6 h-6" />
                            </div>
                            <div>
                               <div className="flex gap-2 items-center mb-1">
                                  <span className={cn(
                                     "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                                     mission.type === 'DIARIA' ? "bg-blue-100 text-blue-600" :
                                     mission.type === 'SEMANAL' ? "bg-purple-100 text-purple-600" : "bg-amber-100 text-amber-600"
                                  )}>{mission.type}</span>
                               </div>
                               <h4 className="font-black italic uppercase tracking-tighter text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                                  {mission.titulo}
                               </h4>
                            </div>
                         </div>
                         <div className="flex items-center gap-6 md:justify-end">
                            <div className="flex flex-col gap-1.5 border-l border-slate-100 pl-6">
                               <div className="flex items-center gap-2 text-slate-500">
                                  <Zap className="w-4 h-4 text-amber-500" />
                                  <span className="text-xs font-black italic tracking-widest">+{mission.xp} XP</span>
                               </div>
                               <div className="flex items-center gap-2 text-slate-500">
                                  <Cpu className="w-4 h-4 text-indigo-500" />
                                  <span className="text-xs font-black italic tracking-widest">+{mission.aiTokens || 0} Tokens</span>
                               </div>
                            </div>
                            <button 
                              onClick={() => deleteMission(mission.id)}
                              className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                               <Trash2 className="w-5 h-5" />
                            </button>
                         </div>
                      </motion.div>
                   ))}
                 </AnimatePresence>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
