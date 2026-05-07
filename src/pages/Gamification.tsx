import { api } from '../lib/api';


import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { Loader2, Trophy, Rocket, Target, Sparkles } from 'lucide-react';
import { StudentGamificationHeader, MissionList, RankingBoard } from '../modules/gamification/GamificationUI';
import { motion } from 'motion/react';export default function Gamification() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [gamificationData, setGamificationData] = useState<any>(null);
  const [rankings, setRankings] = useState<any[]>([]);
  const [activeMissions, setActiveMissions] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!profile) return;
      try {
        // 1. Perfil de Gamificação (from profile)
        const currentXp = profile.xp || 0;
        const level = Math.floor(currentXp / 1000) + 1; // 1 level per 1000 xp
        const max_xp = level * 1000;
        
        setGamificationData({
          level: level,
          current_xp: currentXp,
          max_xp: max_xp,
          points: profile.ai_tokens || 0,
          streak: profile.streak || 0,
          rank: 0, // calculated from ranking below
        });

        // 2. Ranking Top 10
        const { data: rankData, error: rankError } = await api
          .from('usuarios')
          .select('uid, nome, xp')
          .order('xp', { ascending: false })
          .limit(10);

        if (rankData && rankData.length > 0 && !rankError) {
          const userRankIndex = rankData.findIndex(r => r.uid === profile.id);
          
          if (userRankIndex !== -1) {
             setGamificationData((prev: any) => prev ? { ...prev, rank: userRankIndex + 1 } : prev);
          } else {
             setGamificationData((prev: any) => prev ? { ...prev, rank: '+10' } : prev);
          }

          setRankings(rankData.map(r => ({
            aluno_id: r.uid,
            nome: r.nome || 'Usuário Anônimo',
            level: Math.floor((r.xp || 0) / 1000) + 1,
            xp_total: r.xp || 0
          })));
        } else {
          // Mock rankings
          setRankings([
            { aluno_id: '1', nome: 'Djalma B.', level: 15, xp_total: 15000 },
            { aluno_id: '2', nome: 'Ana Silva', level: 14, xp_total: 14200 },
            { aluno_id: '3', nome: 'Carlos Tech', level: 12, xp_total: 12800 },
            { aluno_id: '4', nome: 'Beatriz DEV', level: 10, xp_total: 10500 },
            { aluno_id: '5', nome: 'Erik Cyber', level: 9, xp_total: 9200 },
          ]);
        }

        // 3. Missões Ativas
        const { data: missionData, error: missionError } = await api
          .from('progresso_missao')
          .select('*')
          .eq('aluno_id', profile.id)
          .eq('status', 'ATIVA');

        if (missionData && !missionError) {
           setActiveMissions(missionData);
        } else {
          setActiveMissions([
            { id: 'm1', title: 'Comandos Básicos de CLI', type: 'DIARIA', xp: 150, completed: false },
            { id: 'm2', title: 'Topologia Estrela em Redes', type: 'DIARIA', xp: 150, completed: true },
            { id: 'm3', title: 'Desafio Semanal: Setup de Router', type: 'SEMANAL', xp: 800, completed: false },
          ]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching gamification data:', error);
        setLoading(false);
      }
    }

    fetchData();
  }, [profile]);

  if (loading) return (
    <div className="p-12 text-slate-400 font-mono animate-pulse uppercase tracking-[0.2em] flex items-center gap-4">
      <Loader2 className="w-5 h-5 animate-spin text-indigo-600" /> Sincronizando Perfil de Elite...
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      {/* Header Info */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 flex items-center gap-4">
            <Trophy className="w-10 h-10 text-amber-500" /> Arena de Gamificação
          </h1>
          <p className="text-slate-500 font-medium">Gerencie seu progresso técnico e conquiste prêmios reais.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white border border-slate-200 px-6 py-3 rounded-2xl shadow-sm text-center">
            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Posição Geral</span>
            <span className="text-2xl font-black italic text-indigo-600">#{gamificationData?.rank || '--'}</span>
          </div>
        </div>
      </div>

      <StudentGamificationHeader stats={gamificationData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Missions and Progress */}
        <div className="lg:col-span-2 space-y-12">
          <section className="bg-indigo-600 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="bg-white/10 p-6 rounded-[2rem] backdrop-blur-md border border-white/20">
                   <Rocket className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                   <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Próxima Fase Desbloqueada</h2>
                   <p className="text-indigo-100 font-medium text-sm leading-relaxed max-w-md">
                      Sua trilha de "Infraestrutura de Redes" está em 78%. Complete a missão semanal para destravar o Boss Challenge.
                   </p>
                </div>
                <button className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all">
                   Acessar Trilha
                </button>
             </div>
             <div className="absolute top-0 right-0 p-4">
                <Sparkles className="w-24 h-24 text-white/10 -rotate-12" />
             </div>
          </section>

          <MissionList missions={activeMissions} />

          <section className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-200">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
              <Target className="w-4 h-4" /> Recomendação Tática (IA)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm group hover:border-blue-400 transition-all">
                  <h4 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600">Reforço em Subetização IP</h4>
                  <p className="text-sm text-slate-500 mb-4 leading-relaxed">Detectamos que você teve dúvidas no último quiz. Complete este mini-laboratório para ganhar bônus de 200 XP.</p>
                  <button className="text-[10px] font-black uppercase text-blue-600 tracking-widest flex items-center gap-2">Iniciar Recalibração &rarr;</button>
               </div>
               <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm group hover:border-amber-400 transition-all">
                  <h4 className="font-bold text-slate-900 mb-2 group-hover:text-amber-600">Torne-se Referência</h4>
                  <p className="text-sm text-slate-500 mb-4 leading-relaxed">Ajude 2 colegas no fórum de "Linux Admin" e desbloqueie a Badge "Community Pillar".</p>
                  <button className="text-[10px] font-black uppercase text-amber-600 tracking-widest flex items-center gap-2">Ir ao Fórum &rarr;</button>
               </div>
            </div>
          </section>
        </div>

        {/* Leaderboard Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <RankingBoard rankings={rankings} />
          
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-6">Próximos Desbloqueios</h3>
            <div className="space-y-6">
              {[
                { label: 'Level 10', reward: 'Custom Avatar Frame', progress: 45 },
                { label: 'Top 5 Weekly', reward: 'Special Discord Role', progress: 20 },
                { label: '30 Day Streak', reward: 'Golden Badge', progress: 85 },
              ].map((lock, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-white">{lock.label}</span>
                    <span className="text-indigo-400">{lock.reward}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${lock.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
