import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Flame, Zap, Star, Target, Award, Rocket, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../../../lib/AuthContext';
import { collection, query, orderBy, limit, onSnapshot, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { missionService } from '../../../services/missionService';

interface MissionWithProgress {
  id: string;
  title: string;
  description: string;
  type: string;
  threshold: number;
  xpReward: number;
  tokenReward: number;
  progress: number;
  completed: boolean;
}

export default function StudentGamification() {
  const { profile, user } = useAuth();
  const [missions, setMissions] = useState<MissionWithProgress[]>([]);
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Real-time ranking fetch
    const q = query(collection(db, 'usuarios'), orderBy('xp', 'desc'), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRanking(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Initial missions load
    const loadMissions = async () => {
      const data = await missionService.getMissionsWithProgress(user.uid);
      
      // If no missions exist, seed some for demo
      if (data.length === 0 && profile?.perfil === 'ADMIN') {
        await seedMissions();
        const freshData = await missionService.getMissionsWithProgress(user.uid);
        setMissions(freshData as MissionWithProgress[]);
      } else {
        setMissions(data as MissionWithProgress[]);
      }
      setLoading(false);
    };

    loadMissions();
    return () => unsubscribe();
  }, [user, profile]);

  const seedMissions = async () => {
    const missionsRef = collection(db, 'metas');
    const demoMissions = [
      {
        title: 'Explorador de Dados',
        description: 'Conclua seu primeiro simulado com nota acima de 70%.',
        type: 'SCORE_ABOVE',
        threshold: 70,
        xpReward: 500,
        tokenReward: 10,
        active: true
      },
      {
        title: 'Maratonista SENAI',
        description: 'Finalize 3 simulados de qualquer unidade curricular.',
        type: 'COMPLETE_EXAM',
        threshold: 3,
        xpReward: 1000,
        tokenReward: 25,
        active: true
      }
    ];

    for (const m of demoMissions) {
      await addDoc(missionsRef, m);
    }
  };

  if (loading) {
     return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
           <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
           <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Carregando Meta-Verso...</p>
        </div>
     );
  }

  const currentXp = profile?.xp || 0;
  const level = Math.floor(currentXp / 1000) + 1;
  const nextLevelXp = level * 1000;
  const xpInCurrentLevel = currentXp % 1000;
  const xpPercentage = (xpInCurrentLevel / 1000) * 100;

  return (
    <div className="p-6 md:p-10 space-y-12 bg-slate-1050 min-h-screen text-slate-100 font-sans" id="gamification-dashboard">
      {/* Hero Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-stretch gap-8 bg-gradient-to-br from-slate-900 to-indigo-950/20 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden ring-1 ring-white/5"
      >
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
           <Trophy className="w-80 h-80" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl bg-indigo-600 flex items-center justify-center text-5xl font-black shadow-[0_0_40px_rgba(79,70,229,0.3)] rotate-6 group-hover:rotate-0 transition-all duration-500">
              {level}
            </div>
            <div className="absolute -bottom-4 -right-4 bg-amber-500 p-3 rounded-2xl shadow-xl border-4 border-slate-900">
               <Trophy className="w-6 h-6 text-slate-950" />
            </div>
          </div>
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">
              Operador Nível {level}
            </h1>
            <p className="text-indigo-400 font-bold text-lg tracking-widest">{xpInCurrentLevel} / 1000 XP para o Nível {level + 1}</p>
            <div className="mt-6 w-full md:w-80 h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-1">
               <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${xpPercentage}%` }}
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.6)]"
               />
            </div>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-950/50 backdrop-blur-md p-6 rounded-3xl border border-white/5 flex items-center gap-4 hover:border-orange-500/30 transition-all group">
             <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500 group-hover:scale-110 transition-transform">
                <Flame className="w-8 h-8" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Streak</p>
                <p className="text-2xl font-black">5 Dias</p>
             </div>
          </div>
          <div className="bg-slate-950/50 backdrop-blur-md p-6 rounded-3xl border border-white/5 flex items-center gap-4 hover:border-indigo-500/30 transition-all group">
             <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Saldo IA</p>
                <p className="text-2xl font-black">{profile?.saldoTokensIA || 0} Tokens</p>
             </div>
          </div>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Missões Dinâmicas */}
        <div className="xl:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
                <Target className="w-8 h-8 text-indigo-500" />
                <h2 className="text-2xl font-black uppercase tracking-tighter italic">Missões da Frota</h2>
             </div>
             <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">Reinicia em 3 dias</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {missions.map((mission, idx) => {
                const percentage = Math.min((mission.progress / mission.threshold) * 100, 100);
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={mission.id}
                    className={`group relative bg-slate-900 border ${mission.completed ? 'border-indigo-500/50' : 'border-slate-800'} p-8 rounded-[2rem] hover:shadow-2xl hover:shadow-indigo-500/5 transition-all overflow-hidden`}
                  >
                     {mission.completed && (
                        <div className="absolute top-0 right-0 p-4">
                           <Award className="w-8 h-8 text-indigo-500 animate-bounce" />
                        </div>
                     )}
                     <div className="flex justify-between items-start mb-6">
                        <div className={`p-3 rounded-2xl ${mission.completed ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                           {mission.type === 'SCORE_ABOVE' ? <Rocket className="w-6 h-6" /> : <Award className="w-6 h-6" />}
                        </div>
                        <div className="flex flex-col items-end">
                           <span className="text-xs font-black text-indigo-400">+{mission.xpReward} XP</span>
                           <span className="text-[10px] font-black text-slate-500">+{mission.tokenReward} TOKENS IA</span>
                        </div>
                     </div>
                     <h3 className="font-black text-xl mb-2 group-hover:text-indigo-400 transition-colors tracking-tight">{mission.title}</h3>
                     <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">{mission.description}</p>
                     
                     <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 uppercase tracking-widest">
                           <span>Progresso</span>
                           <span>{mission.completed ? 'CONCLUÍDO' : `${mission.progress} / ${mission.threshold}`}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${percentage}%` }}
                             className={`h-full ${mission.completed ? 'bg-indigo-400' : 'bg-indigo-600'} rounded-full`} 
                           />
                        </div>
                     </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Global Ranking Wrapper */}
        <aside className="space-y-8">
           <div className="flex items-center gap-4">
              <Star className="w-8 h-8 text-yellow-500" />
              <h2 className="text-2xl font-black uppercase tracking-tighter italic">Top Operadores</h2>
           </div>
           
           <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative">
              <div className="space-y-6">
                 {ranking.map((player, pos) => (
                   <motion.div 
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: pos * 0.1 }}
                     key={player.id} 
                     className={`flex items-center gap-5 p-4 rounded-3xl transition-all ${player.id === user?.uid ? 'bg-indigo-600 shadow-2xl shadow-indigo-600/30 ring-2 ring-white/20' : 'hover:bg-slate-800/50'}`}
                   >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${player.id === user?.uid ? 'bg-white text-indigo-600' : 'bg-slate-800 text-slate-500'}`}>
                         {pos + 1}
                      </div>
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full bg-slate-800 overflow-hidden border-2 border-slate-700 shadow-inner">
                           <img src={`https://picsum.photos/seed/${player.id}/100/100`} alt="user" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </div>
                        {pos === 0 && <Award className="absolute -top-1 -right-1 w-6 h-6 text-yellow-500 bg-slate-900 rounded-full p-1" />}
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="text-sm font-black tracking-tight truncate">{player.id === user?.uid ? 'Você (Mestre)' : (player.nome || 'Novato')}</p>
                         <p className={`text-[10px] font-bold uppercase tracking-widest ${player.id === user?.uid ? 'text-indigo-200' : 'text-slate-500'}`}>{player.xp || 0} XP</p>
                      </div>
                   </motion.div>
                 ))}
                 
                 {ranking.length === 0 && (
                   <div className="text-center py-10 opacity-30">
                      <Zap className="w-10 h-10 mx-auto mb-2" />
                      <p className="text-xs font-bold uppercase tracking-widest">Iniciando Ranking...</p>
                   </div>
                 )}
              </div>

              <button className="w-full mt-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all">Ver Ranking Global</button>
           </div>
           
           {/* Achievement Teaser */}
           <div className="bg-gradient-to-r from-amber-600 to-amber-500 p-8 rounded-[2rem] shadow-xl text-slate-950 group cursor-pointer hover:scale-[1.02] transition-all">
              <div className="flex items-center gap-4 mb-4">
                 <Award className="w-8 h-8" />
                 <h3 className="font-black text-xl tracking-tight italic uppercase">Coleção de Insígnias</h3>
              </div>
              <p className="text-amber-900/80 text-sm font-bold leading-tight">Você coletou 4 de 12 medalhas lendárias. Ganhe mais 2 para desbloquear o avatar Cyber-Sensei.</p>
           </div>
        </aside>
      </div>
    </div>
  );
}
