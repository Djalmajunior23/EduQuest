import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { 
  Trophy, 
  Flame, 
  Zap, 
  Star, 
  Target, 
  Award, 
  Rocket, 
  Loader2, 
  Sparkles,
  Map,
  ListTodo,
  Swords,
  Medal,
  BarChart3,
  Gift,
  History as HistoryIcon,
  LayoutDashboard,
  CalendarDays,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  Gem,
  BrainCircuit,
  Bot
} from 'lucide-react';
import { ALL_BADGES, GamificationItem } from '../../gamification/libraries';
import { BOSS_CHALLENGES, BossChallenge } from '../../gamification/bossChallenges';
import { PRACTICAL_CHALLENGES } from '../../gamification/challengesLibrary';

const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.Award;
  return <IconComponent className={className} />;
};
import { useAuth } from '../../../lib/AuthContext';
import { useTenant } from '../../../lib/TenantContext';
import { supabase } from '../../../lib/supabase';
import { missionService } from '../../../services/missionService';
import { adaptiveMissionService, AdaptiveMission, StudentProfileType } from '../../../services/adaptiveMissionService';
import { cn } from '../../../lib/utils';

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

type TabType = 'dashboard' | 'trilhas' | 'missoes' | 'desafios' | 'boss' | 'conquistas' | 'ranking' | 'recompensas' | 'metas' | 'historico';

export default function StudentGamification() {
  const { profile, user } = useAuth();
  const { tenant } = useTenant();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [techProfile, setTechProfile] = useState<StudentProfileType>('INICIANTE_INSEGURO');
  const [missions, setMissions] = useState<MissionWithProgress[]>([]);
  const [adaptiveMissions, setAdaptiveMissions] = useState<AdaptiveMission[]>([]);
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [history, setHistory] = useState<any[]>([
    { id: 'h1', type: 'EXAM', desc: 'Quiz: Redes II', xp: 200, date: '2024-03-20 14:30' },
    { id: 'h2', type: 'MISSION', desc: 'Missão Diária Concluída', xp: 150, date: '2024-03-20 09:12' },
    { id: 'h3', type: 'BONUS', desc: 'Consistency Bonus', xp: 50, date: '2024-03-19 22:00' },
    { id: 'h4', type: 'EXAM', desc: 'Simulado Global', xp: 1200, date: '2024-03-18 16:45' },
  ]);

  const [goals, setGoals] = useState<any[]>([
    { id: 'g1', title: 'Mestre em Linux', progress: 65, total: 100, reward: 'Badge Ouro' },
    { id: 'g2', title: 'Top 3 Semanal', progress: 1, total: 3, reward: '50 Tokens IA' },
    { id: 'g3', title: 'Consistência de 7 Dias', progress: 5, total: 7, reward: 'Double XP (24h)' },
  ]);

  async function loadGamificationData() {
    console.log("[Gamificação] Iniciando carregamento (Protocolo Blindado)...");

    setLoading(true);
    setError(null);

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Tempo limite ao carregar protocolo de gamificação. Verifique sua conexão.")), 10000)
    );

    try {
      if (!user || !tenant) {
        console.warn("[Gamificação] User ou Tenant ausentes.");
        return;
      }

      if (!supabase) {
        throw new Error("Cliente Supabase não inicializado.");
      }

      const fetchAll = async () => {
        const missionsData = await missionService.getMissionsWithProgress(user.uid, tenant.id).catch((e: any) => {
          console.error("Erro missões:", e);
          return [];
        });

        const adaptiveData = await adaptiveMissionService.getActiveAdaptiveMissions(user.uid, tenant.id).catch((e: any) => {
          console.error("Erro missões adaptativas:", e);
          return [];
        });

        const { data: rankData, error: rankError } = await supabase
          .from('ranking')
          .select('*')
          .eq('tenantId', tenant.id)
          .order('xp', { ascending: false })
          .limit(10);

        if (rankError) {
          console.error("Erro ranking:", rankError);
        }

        return { 
          missionsData, 
          adaptiveData, 
          rankData: rankData || [] 
        };
      };

      const result = await Promise.race([fetchAll(), timeout]);

      console.log("[Gamificação] Resultado carregado com sucesso:", result);

      setMissions(Array.isArray(result.missionsData) ? result.missionsData : []);
      setAdaptiveMissions(Array.isArray(result.adaptiveData) ? result.adaptiveData : []);
      setRanking(Array.isArray(result.rankData) ? result.rankData : []);

    } catch (err: any) {
      console.error("[Gamificação] Erro:", err);
      setError(
        err?.message ||
        "Não foi possível carregar o módulo de gamificação devido a uma falha de sincronização."
      );
    } finally {
      console.log("[Gamificação] Finalizando loading...");
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGamificationData();
  }, [user?.uid, tenant?.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <p className="text-sm font-bold tracking-widest text-slate-300">
            INICIANDO PROTOCOLO DE GAMIFICAÇÃO...
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Carregando dados do módulo...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#020617] p-8 text-white flex items-center justify-center">
        <div className="rounded-2xl border border-red-500/40 bg-red-950/30 p-10 max-w-lg text-center">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-6 opacity-80" />
          <h2 className="text-2xl font-bold">Erro ao carregar Gamificação</h2>
          <p className="mt-3 text-red-200">{error}</p>

          <button
            onClick={loadGamificationData}
            className="mt-8 rounded-xl bg-red-600 px-8 py-3 font-bold text-white hover:bg-red-700 transition-all uppercase text-xs tracking-widest"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const currentXp = profile?.xp || 0;
  const level = Math.floor(currentXp / 1000) + 1;
  const xpInCurrentLevel = currentXp % 1000;
  const xpPercentage = (xpInCurrentLevel / 1000) * 100;

  const tabs = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'trilhas', label: 'Trilhas', icon: Map },
    { id: 'missoes', label: 'Missões', icon: ListTodo },
    { id: 'desafios', label: 'Desafios', icon: Swords },
    { id: 'boss', label: 'Boss', icon: Flame },
    { id: 'metas', label: 'Metas', icon: Target },
    { id: 'conquistas', label: 'Conquistas', icon: Award },
    { id: 'ranking', label: 'Ranking', icon: BarChart3 },
    { id: 'recompensas', label: 'Prêmios', icon: Gift },
    { id: 'historico', label: 'Histórico', icon: HistoryIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-1050 text-slate-100 pb-20">
      {/* Dynamic Nav Bar */}
      <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap",
                activeTab === tab.id 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 md:p-10">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Profile Overview */}
              <header className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-indigo-950/20 border border-slate-800 p-10 rounded-[2.5rem] relative overflow-hidden ring-1 ring-white/5 flex flex-col md:flex-row items-center gap-10">
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
                         {profile?.nome || 'Operador'} <span className="text-indigo-500">Lvl {level}</span>
                       </h1>
                       <p className="text-indigo-400 font-bold text-lg tracking-widest">{xpInCurrentLevel} / 1000 XP para elevar nível</p>
                       <div className="mt-6 w-full md:w-80 h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-1">
                          <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${xpPercentage}%` }}
                           className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.6)]"
                          />
                       </div>
                       
                       {/* Insight de Perfil IA */}
                       <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-4 max-w-xl">
                          <div className="p-3 bg-indigo-500/20 rounded-2xl">
                             <BrainCircuit className="w-8 h-8 text-indigo-400" />
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1">Perfil Nexus IA</p>
                             <p className="text-sm font-bold text-slate-200">
                                Análise: <span className="text-white italic uppercase tracking-tight">{techProfile.replace(/_/g, ' ')}</span>. 
                                O motor Nexus está adaptando sua trilha para maximizar seu potencial.
                             </p>
                          </div>
                       </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-slate-950 p-8 rounded-[2rem] border border-white/5 flex items-center gap-6 group hover:border-orange-500/30 transition-all">
                     <div className="p-4 bg-orange-500/10 rounded-2xl text-orange-500 group-hover:scale-110 transition-transform">
                        <Flame className="w-10 h-10" />
                     </div>
                     <div>
                        <p className="text-xs font-black uppercase text-slate-500 tracking-widest">Streak Atual</p>
                        <p className="text-3xl font-black tracking-tighter">05 DIAS</p>
                     </div>
                  </div>
                  <div className="bg-slate-950 p-8 rounded-[2rem] border border-white/5 flex items-center gap-6 group hover:border-indigo-500/30 transition-all">
                     <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-500 group-hover:scale-110 transition-transform">
                        <Gem className="w-10 h-10" />
                     </div>
                     <div>
                        <p className="text-xs font-black uppercase text-slate-500 tracking-widest">Saldo de Tokens</p>
                        <p className="text-3xl font-black tracking-tighter">{profile?.saldoTokensIA || 0} TIA</p>
                     </div>
                  </div>
                </div>
              </header>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                {/* Highlights */}
                <div className="xl:col-span-2 space-y-8">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h2 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-3">
                      <Target className="w-6 h-6 text-indigo-500" />
                      Objetivos de Campo
                    </h2>
                    <button onClick={() => setActiveTab('missoes')} className="text-indigo-400 text-xs font-bold hover:underline">Ver todas</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(missions || []).slice(0, 4).map((mission) => {
                      const percentage = Math.min(((mission?.progress || 0) / (mission?.threshold || 1)) * 100, 100);
                      return (
                        <div key={mission.id} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:border-indigo-500/30 transition-all">
                           <div className="flex justify-between mb-4 text-xs font-black uppercase text-indigo-400">
                             <span>{mission?.title || 'Missão Desconhecida'}</span>
                             <span>+{mission?.xpReward || 0} XP</span>
                           </div>
                           <p className="text-slate-400 text-sm mb-6 line-clamp-2">{mission?.description || 'Carregando detalhes...'}</p>
                           <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                             <div className="h-full bg-indigo-500" style={{ width: `${percentage}%` }} />
                           </div>
                        </div>
                      );
                    })}
                    {missions.length === 0 && (
                      <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                        <Target className="w-10 h-10 text-slate-800 mx-auto mb-4" />
                        <p className="text-slate-600 font-black uppercase text-[10px] tracking-widest">Nenhuma missão ativa no momento</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vertical Ranking */}
                <aside className="space-y-8">
                  <h2 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-3">
                    <Star className="w-6 h-6 text-yellow-500" />
                    Top Operadores
                  </h2>
                  <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 space-y-4">
                    {(ranking || []).slice(0, 5).map((player, idx) => (
                      <div key={player?.id || idx} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all">
                        <span className="text-slate-500 font-black text-xs w-4">{idx + 1}</span>
                        <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                           <img src={`https://picsum.photos/seed/${player?.id || idx}/100/100`} alt="p" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-sm font-bold truncate">{player?.id === user?.uid ? 'VOCÊ' : (player?.nome || 'Operador')}</p>
                           <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{player?.xp || 0} XP</p>
                        </div>
                      </div>
                    ))}
                    {ranking.length === 0 && (
                      <p className="text-center py-4 text-[10px] font-black uppercase text-slate-700 tracking-widest">Ranking Indisponível</p>
                    )}
                  </div>
                </aside>
              </div>
            </motion.div>
          )}

          {activeTab === 'trilhas' && (
            <motion.div
              key="trilhas"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <header className="text-center space-y-4 py-10">
                <h1 className="text-5xl font-black italic uppercase tracking-tighter">O Mapa da Jornada</h1>
                <p className="text-slate-400 max-w-2xl mx-auto">Siga a trilha técnica do seu curso e desbloqueie o Boss Challenge final para certificação.</p>
              </header>

              <div className="relative flex flex-col items-center">
                 {/* Visual Path (SVG Background) */}
                 <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-indigo-600 via-purple-600 to-transparent opacity-20" />

                 <div className="space-y-20 relative w-full max-w-2xl">
                    {[
                      { title: 'Fundamentos Dev Academy', status: 'COMPLETED', xp: 200, icon: ShieldAlert, progress: 100 },
                      { title: 'Módulo Web Builder', status: 'ACTIVE', xp: 500, icon: Zap, progress: 65 },
                      { title: 'Cyber Defender: Ops', status: 'LOCKED', xp: 800, icon: Swords, progress: 0 },
                      { title: 'BOSS: Inteligência Educacional Interativa', status: 'LOCKED', xp: 2500, icon: Trophy, isBoss: true, progress: 0 },
                    ].map((node, i) => (
                      <div key={i} className={cn(
                        "flex items-center gap-8 group",
                        i % 2 === 0 ? "flex-row" : "flex-row-reverse"
                      )}>
                        <div className={cn(
                          "flex-1 p-8 rounded-3xl border transition-all",
                          node.status === 'COMPLETED' ? "border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40" :
                          node.status === 'ACTIVE' ? "border-indigo-500/40 bg-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:border-indigo-500/60" :
                          "border-slate-800 bg-slate-900/40 opacity-40 grayscale"
                        )}>
                           <div className="flex items-center gap-4 mb-2">
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node 0{i + 1}</span>
                              {node.isBoss && <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">Boss</span>}
                           </div>
                           <h3 className="text-xl font-black italic">{node.title}</h3>
                           <p className="text-xs font-bold text-slate-500 mt-2">Recompensa: +{node.xp} XP</p>
                           
                           {/* PROGRESS BAR */}
                           <div className="mt-6 space-y-2">
                              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                                 <span>Tarefas Concluídas</span>
                                 <span className={cn(
                                    node.status === 'COMPLETED' ? "text-emerald-400" :
                                    node.status === 'ACTIVE' ? "text-indigo-400" : "text-slate-500"
                                 )}>{node.progress}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-950/50 rounded-full overflow-hidden border border-white/5">
                                 <motion.div 
                                   initial={{ width: 0 }}
                                   whileInView={{ width: `${node.progress}%` }}
                                   viewport={{ once: true }}
                                   transition={{ duration: 1, ease: "easeOut" }}
                                   className={cn(
                                     "h-full rounded-full shadow-lg",
                                     node.status === 'COMPLETED' ? "bg-emerald-500 shadow-emerald-500/50" : 
                                     node.status === 'ACTIVE' ? "bg-indigo-500 shadow-indigo-500/50" : "bg-slate-700"
                                   )}
                                 />
                              </div>
                           </div>
                        </div>
                        <div className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center border-4 border-slate-950 z-10 transition-all",
                          node.status === 'COMPLETED' ? "bg-emerald-500 text-slate-950" :
                          node.status === 'ACTIVE' ? "bg-indigo-600 text-white animate-pulse" :
                          "bg-slate-800 text-slate-600"
                        )}>
                           <node.icon className="w-8 h-8" />
                        </div>
                        <div className="flex-1" />
                      </div>
                    ))}
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'missoes' && (
            <motion.div
              key="missoes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
               <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8">
                  <div>
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter">Mural de Operações</h1>
                    <p className="text-slate-400 mt-2">Objetivos dinâmicos para acelerar seu Level Up.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={async () => {
                         if (!tenant) return;
                         await adaptiveMissionService.generateAdaptiveMissions(user!.uid, 'DEV_ACADEMY', tenant.id);
                         const fresh = await adaptiveMissionService.getActiveAdaptiveMissions(user!.uid, tenant.id);
                         setAdaptiveMissions(fresh);
                      }}
                      className="bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Sincronizar Missões IA
                    </button>
                  <div className="flex bg-slate-900 p-1 rounded-2xl">
                    {['Todas', 'Diárias', 'Semanais', 'Especiais'].map(cat => (
                      <button key={cat} className="px-6 py-2 rounded-xl text-xs font-black uppercase text-slate-500 hover:text-slate-200 transition-all">{cat}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Adaptive Missions Section */}
              {(adaptiveMissions || []).length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-3 text-indigo-400">
                    <Sparkles className="w-6 h-6" />
                    Missões Sugeridas pela IA (Adaptativas)
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {adaptiveMissions.map(am => (
                      <div key={am.id} className="bg-indigo-950/20 border border-indigo-500/30 p-8 rounded-[2.5rem] flex flex-col group relative overflow-hidden backdrop-blur-sm">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                          <Sparkles className="w-20 h-20 text-indigo-500" />
                        </div>
                        <div className="flex justify-between items-start mb-6">
                          <div className="p-4 bg-indigo-600 text-white rounded-2xl">
                            <BrainCircuit className="w-6 h-6" />
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black text-indigo-400 uppercase">{am?.difficulty || 'PADRÃO'}</p>
                            <p className="text-xs font-black text-white">+{am?.xpReward || 0} XP</p>
                          </div>
                        </div>
                        <h3 className="text-xl font-black mb-2">{am?.title || 'Missão IA'}</h3>
                        <p className="text-slate-400 text-sm mb-6 flex-1 leading-relaxed">{am?.description || 'Carregando diretrizes...'}</p>
                        <div className="pt-6 border-t border-indigo-500/20 flex flex-col gap-3">
                          <div className="flex items-center gap-2 text-[10px] font-black text-indigo-300 uppercase tracking-widest">
                            <Bot className="w-4 h-4" />
                            Motivo: {am?.technicalSkill || 'Análise comportamental'}
                          </div>
                          <button className="w-full py-4 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all">Iniciar Missão</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-8 space-y-6">
                <h2 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-3">
                  <ListTodo className="w-6 h-6 text-slate-500" />
                  Objetivos Gerais da Trilha
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(missions || []).map(mission => (
                    <div key={mission?.id || Math.random()} className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col group hover:border-indigo-500/20 transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-slate-800 rounded-2xl text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <Zap className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-black text-indigo-400">+{mission?.xpReward || 0} XP</span>
                          <span className="text-xs font-black text-slate-500 cursor-default">#{mission?.id?.slice(-4).toUpperCase() || '####'}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-black mb-3">{mission?.title || 'Missão Indefinida'}</h3>
                      <p className="text-slate-400 text-sm mb-8 flex-1 leading-relaxed">{mission?.description || 'O objetivo desta missão ainda está sendo processado pelo sistema.'}</p>
                      
                      <div className="space-y-4 pt-6 border-t border-white/5">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                          <span>Progresso</span>
                          <span>{Math.min(mission?.progress || 0, mission?.threshold || 1)} / {mission?.threshold || 1}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            className={cn(
                              "h-full transition-colors duration-500",
                              (mission?.progress || 0) >= (mission?.threshold || 1) ? "bg-emerald-500" : "bg-indigo-500"
                            )}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(((mission?.progress || 0) / (mission?.threshold || 1)) * 100, 100)}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {(missions || []).length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                      <ListTodo className="w-10 h-10 text-slate-800 mx-auto mb-4" />
                      <p className="text-slate-600 font-black uppercase text-[10px] tracking-widest">Nenhuma missão listada no banco de dados</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'desafios' && (
            <motion.div
              key="desafios"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-12"
            >
               <header className="bg-red-500/10 border border-red-500/20 p-12 rounded-[3.5rem] flex flex-col md:flex-row items-center gap-10">
                  <div className="w-32 h-32 bg-red-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.4)]">
                     <Swords className="w-16 h-16 text-white" />
                  </div>
                  <div className="flex-1 space-y-4">
                     <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">Arena de Desafios</h1>
                     <p className="text-red-200/60 font-bold max-w-xl">Enfrente simulações críticas de sistemas e cyber-ataques para provar seu valor técnico. Risco Alto, Recompensa Lendária.</p>
                  </div>
                  <div className="flex flex-col items-center p-6 bg-slate-900 rounded-3xl border border-white/5 min-w-[180px]">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status Global</p>
                     <p className="text-xs font-black text-emerald-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        84 OFENSIVAS HOJE
                     </p>
                  </div>
               </header>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {PRACTICAL_CHALLENGES.map((challenge) => (
                    <div key={challenge.id} className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] group hover:bg-slate-800 hover:border-red-500/30 transition-all flex flex-col gap-6 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                          <DynamicIcon name={challenge.iconName} className="w-20 h-20" />
                       </div>
                       <div className="flex justify-between items-start relative z-10">
                          <div className="p-4 bg-slate-800 rounded-2xl text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all">
                             <DynamicIcon name={challenge.iconName} className="w-8 h-8" />
                          </div>
                          <span className={cn(
                            "text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded",
                            challenge.dificuldade === 'AVANCADO' ? "bg-amber-500/10 text-amber-500" :
                            challenge.dificuldade === 'INTERMEDIARIO' ? "bg-slate-500/10 text-slate-300" :
                            challenge.dificuldade === 'CORRETIVO' ? "bg-purple-500/10 text-purple-400" :
                            challenge.dificuldade === 'BONUS' ? "bg-cyan-500/10 text-cyan-400" : "bg-slate-500/10 text-slate-500"
                          )}>
                             {challenge.dificuldade}
                          </span>
                       </div>
                       <div className="flex-1 space-y-3 relative z-10">
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">{challenge.curso}</span>
                             <span className="text-[10px] font-bold text-slate-500 uppercase">• Fase {challenge.fase}</span>
                          </div>
                          <h3 className="text-xl font-black italic tracking-tight leading-tight">{challenge.titulo}</h3>
                          <p className="text-slate-400 text-xs font-medium line-clamp-3 leading-relaxed">{challenge.descricao}</p>
                          <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 pt-2">
                             <span className="text-indigo-400 flex items-center gap-1">
                                <Zap className="w-3 h-3 fill-indigo-400" />
                                +{challenge.xpReward} XP
                             </span>
                             <span className="text-emerald-400 flex items-center gap-1">
                                <Bot className="w-3 h-3" />
                                +{challenge.tokenReward} TIA
                             </span>
                          </div>
                       </div>
                       <button className="w-full bg-slate-800 text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest group-hover:bg-red-600 transition-all border border-white/5 relative z-10">
                          Engajar Operação
                       </button>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'boss' && (
            <motion.div
              key="boss"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-12"
            >
               <header className="relative bg-slate-900 border border-white/5 p-16 rounded-[4rem] overflow-hidden group">
                  <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-red-600/10 via-transparent to-transparent" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
                     <div className="w-40 h-40 bg-red-600 rounded-[3rem] flex items-center justify-center shadow-[0_0_80px_rgba(220,38,38,0.3)] animate-pulse">
                        <Flame className="w-20 h-20 text-white" />
                     </div>
                     <div className="flex-1 space-y-4">
                        <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none">Desafios de Chefe</h1>
                        <p className="text-slate-400 font-bold max-w-2xl text-lg">A Prova de Fogo. Onde a teoria morre e a competência pura reina. Vencer aqui significa maestria absoluta na trilha.</p>
                     </div>
                  </div>
                  <div className="absolute -bottom-10 -right-10 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                     <Trophy className="w-96 h-96" />
                  </div>
               </header>

               <div className="grid grid-cols-1 gap-10">
                  {BOSS_CHALLENGES.map((boss) => {
                     const isUnlocked = profile?.xp ? profile.xp > 2000 : false;
                     return (
                       <div 
                         key={boss.id} 
                         className={cn(
                           "bg-slate-900/50 border rounded-[3.5rem] p-12 transition-all group overflow-hidden relative",
                           isUnlocked ? "border-white/10 hover:border-red-500/30 hover:bg-slate-900" : "border-white/5 opacity-50 grayscale contrast-75 bg-slate-1050/50"
                         )}
                       >
                          {!isUnlocked && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 z-20">
                               <div className="flex flex-col items-center gap-2">
                                  <LucideIcons.Lock className="w-12 h-12 text-slate-400" />
                                  <p className="text-[10px] font-black uppercase text-slate-500">{boss.criteriosDesbloqueio}</p>
                               </div>
                            </div>
                          )}
                          
                          <div className="flex flex-col lg:flex-row gap-12 relative z-10">
                             <aside className="lg:w-1/3 space-y-8">
                                <div className={cn(
                                  "w-24 h-24 rounded-3xl flex items-center justify-center p-6",
                                  boss.corTema === 'indigo' ? "bg-indigo-600" :
                                  boss.corTema === 'red' ? "bg-red-600" :
                                  boss.corTema === 'emerald' ? "bg-emerald-600" : "bg-slate-700"
                                )}>
                                   <DynamicIcon name={boss.iconName} className="w-full h-full text-white" />
                                </div>
                                <div className="space-y-4">
                                   <h3 className="text-3xl font-black italic uppercase tracking-tighter">{boss.titulo}</h3>
                                   <div className="flex items-center gap-4">
                                      <span className={cn(
                                        "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                                        boss.dificuldade === 'LENDARIA' ? "bg-amber-500 text-slate-950" : "bg-red-500 text-white"
                                      )}>
                                         {boss.dificuldade}
                                      </span>
                                      <span className="text-[10px] font-bold text-slate-500 uppercase">{boss.tempoSugerido}</span>
                                   </div>
                                   <p className="text-slate-400 text-sm font-bold border-l-2 border-slate-700 pl-4">{boss.contexto}</p>
                                </div>
                             </aside>

                             <div className="flex-1 space-y-8">
                                <section className="space-y-4">
                                   <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-widest flex items-center gap-2">
                                      <Star className="w-4 h-4" /> Missão Crítica
                                   </h4>
                                   <p className="text-xl font-medium leading-relaxed">{boss.missaoPrincipal}</p>
                                </section>

                                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                   <div className="space-y-4">
                                      <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Protocolos de Execução</h4>
                                      <div className="space-y-2">
                                         {boss.etapas.map((step, i) => (
                                           <div key={i} className="flex gap-3 text-xs font-bold text-slate-400">
                                              <span className="text-indigo-500">0{i+1}.</span>
                                              {step}
                                           </div>
                                         ))}
                                      </div>
                                   </div>
                                   <div className="space-y-4">
                                      <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Recompensas de Vitória</h4>
                                      <div className="grid grid-cols-2 gap-4">
                                         <div className="bg-slate-800 p-4 rounded-2xl">
                                            <p className="text-[8px] font-black text-slate-500 uppercase">Experiência</p>
                                            <p className="text-xl font-black italic text-white">+{boss.xpRecompensa} XP</p>
                                         </div>
                                         <div className="bg-slate-800 p-4 rounded-2xl">
                                            <p className="text-[8px] font-black text-slate-500 uppercase">Tokens IA</p>
                                            <p className="text-xl font-black italic text-amber-500">+{boss.tokensIARecompensa}</p>
                                         </div>
                                      </div>
                                   </div>
                                </section>

                                <div className="pt-8 flex flex-col sm:flex-row gap-6">
                                   <button 
                                     className={cn(
                                       "px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl",
                                       isUnlocked ? "bg-white text-slate-950 hover:bg-red-600 hover:text-white" : "bg-slate-800 text-slate-500 cursor-not-allowed"
                                     )}
                                     disabled={!isUnlocked}
                                   >
                                      Iniciar Combate Técnico
                                   </button>
                                   <button className="px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400 border border-white/5 hover:bg-white/5 transition-all">Ver Critérios de Avaliação</button>
                                </div>
                             </div>
                          </div>
                       </div>
                     )
                  })}
               </div>
            </motion.div>
          )}

          {activeTab === 'metas' && (
            <motion.div
              key="metas"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
               <div className="text-center space-y-4">
                  <h1 className="text-5xl font-black italic uppercase tracking-tighter">Metas Inteligentes</h1>
                  <p className="text-slate-400">Objetivos de longo prazo desenhados pela IA para sua evolução técnica.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {(goals || []).map(goal => (
                    <div key={goal.id} className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] space-y-6">
                       <div className="flex justify-between items-start">
                          <h3 className="text-2xl font-black italic tracking-tight">{goal.title}</h3>
                          <div className="bg-amber-500/10 text-amber-500 p-3 rounded-2xl">
                             <Award className="w-6 h-6" />
                          </div>
                       </div>
                       <p className="text-slate-400 font-bold text-sm">Recompensa: <span className="text-indigo-400">{goal.reward}</span></p>
                       <div className="space-y-4">
                          <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500">
                             <span>Progresso Geral</span>
                             <span>{goal.progress} / {goal.total}</span>
                          </div>
                          <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden p-1 border border-white/5">
                             <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full" style={{ width: `${(goal.progress/goal.total)*100}%` }} />
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'historico' && (
            <motion.div
              key="historico"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
               <header className="flex justify-between items-end">
                  <div>
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter">Registro de Operações</h1>
                    <p className="text-slate-400 mt-2">Log detalhado de todas as atividades e recompensas.</p>
                  </div>
                  <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl text-center min-w-[150px]">
                     <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">XP Acumulada</span>
                     <span className="text-2xl font-black italic text-indigo-400">+{profile?.xp || 0} XP</span>
                  </div>
               </header>

               <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-slate-950/50 border-b border-white/5">
                           <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Atividade</th>
                           <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-widest text-center">Tipo</th>
                           <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">XP</th>
                           <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Data/Hora</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {(history || []).map(item => (
                          <tr key={item.id} className="hover:bg-white/5 transition-all group">
                             <td className="p-6">
                                <p className="font-black italic uppercase tracking-tight text-white group-hover:text-indigo-400 transition-colors">{item?.desc || 'Atividade Operacional'}</p>
                             </td>
                             <td className="p-6 text-center">
                                <span className={cn(
                                   "text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest",
                                   item?.type === 'EXAM' ? "bg-red-500/10 text-red-500" :
                                   item?.type === 'MISSION' ? "bg-emerald-500/10 text-emerald-500" :
                                   "bg-indigo-500/10 text-indigo-500"
                                )}>
                                   {item?.type || 'LOG'}
                                </span>
                             </td>
                             <td className="p-6 text-right">
                                <span className="font-black italic text-indigo-400 text-lg">+{item?.xp || 0}</span>
                             </td>
                             <td className="p-6 text-right text-xs font-bold text-slate-500">
                                {item?.date || '--/--/----'}
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </motion.div>
          )}

          {activeTab === 'conquistas' && (
            <motion.div
              key="conquistas"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
               <div className="text-center space-y-4">
                  <h1 className="text-5xl font-black italic uppercase tracking-tighter">Hall de Conquistas</h1>
                  <p className="text-slate-400">Sua galeria de troféus e insígnias conquistadas na plataforma.</p>
               </div>

               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {(ALL_BADGES || []).map((badge) => {
                    const isUnlocked = profile?.badgesIds?.includes(badge?.id);
                    return (
                      <div key={badge.id} className={cn(
                        "p-6 rounded-[2rem] border flex flex-col items-center justify-center text-center gap-4 group transition-all cursor-pointer relative overflow-hidden",
                        isUnlocked 
                          ? "bg-slate-900 border-indigo-500/20 hover:scale-105 hover:bg-slate-800" 
                          : "bg-slate-950 border-white/5 opacity-40 grayscale"
                      )}>
                         <div className={cn(
                           "w-20 h-20 rounded-full flex items-center justify-center p-4 z-10",
                           isUnlocked ? "bg-indigo-600/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl" : "bg-slate-800 text-slate-600"
                         )}>
                            <DynamicIcon name={badge.iconName} className="w-full h-full" />
                         </div>
                         <div className="z-10">
                            <p className="text-xs font-black tracking-tight uppercase leading-tight">{badge.nome}</p>
                            <span className={cn(
                              "text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest mt-2 inline-block",
                              badge.raridade === 'LENDARIA' ? "bg-amber-500 text-slate-950" :
                              badge.raridade === 'EPICA' ? "bg-indigo-500 text-white" :
                              badge.raridade === 'RARA' ? "bg-amber-500/10 text-amber-500" :
                              "bg-slate-800 text-slate-400"
                            )}>
                              {badge.raridade}
                            </span>
                         </div>
                         {!isUnlocked && (
                           <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 opaicty-0 group-hover:opacity-100 transition-opacity">
                              <LucideIcons.Lock className="w-8 h-8 text-slate-700" />
                           </div>
                         )}
                         {isUnlocked && (
                           <motion.div 
                             initial={{ scale: 0 }}
                             animate={{ scale: 1 }}
                             className="absolute top-2 right-2 text-emerald-500"
                           >
                             <LucideIcons.CheckCircle2 className="w-4 h-4" />
                           </motion.div>
                         )}
                      </div>
                    );
                  })}
               </div>
            </motion.div>
          )}

          {activeTab === 'ranking' && (
            <motion.div
              key="ranking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-12"
            >
               <div className="lg:col-span-2 space-y-10">
                  <header className="flex items-center justify-between">
                     <h1 className="text-4xl font-black italic uppercase tracking-tighter">Arena Global</h1>
                     <div className="flex items-center gap-4 bg-slate-900 p-2 rounded-2xl">
                        <button className="px-4 py-2 rounded-xl bg-indigo-600 text-[10px] font-black uppercase tracking-widest">Geral</button>
                        <button className="px-4 py-2 rounded-xl text-slate-500 text-[10px] font-black uppercase tracking-widest">Semanal</button>
                        <button className="px-4 py-2 rounded-xl text-slate-500 text-[10px] font-black uppercase tracking-widest">Mensal</button>
                     </div>
                  </header>

                  <div className="space-y-4">
                     {(ranking || []).map((user_rank, idx) => (
                       <div key={user_rank?.id || idx} className={cn(
                         "flex items-center gap-6 p-6 rounded-[2rem] border transition-all",
                         user_rank?.id === user?.uid ? "bg-indigo-600 border-white/20 shadow-2xl" : "bg-slate-900 border-white/5 hover:bg-slate-800"
                       )}>
                          <span className="text-2xl font-black italic w-10 text-slate-500">{idx + 1}</span>
                          <div className="w-16 h-16 rounded-2xl bg-slate-800 overflow-hidden border border-white/10">
                             <img src={`https://picsum.photos/seed/${user_rank?.id || idx}/100/100`} alt="profile" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                             <h4 className="text-xl font-black tracking-tight truncate">{user_rank?.id === user?.uid ? 'VOCÊ (Soberano)' : (user_rank?.nome || 'Novato')}</h4>
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Operador Nível {Math.floor((user_rank?.xp || 0) / 1000) + 1}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-2xl font-black italic tracking-tighter">{user_rank?.xp || 0}</p>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">XP Total</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               <aside className="space-y-8">
                  <h3 className="text-xl font-black italic uppercase tracking-tighter">Resumo de Temporada</h3>
                  <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] space-y-8">
                     <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Sua Evolução</p>
                        <div className="flex items-end gap-2 text-4xl font-black italic text-emerald-400">
                           <TrendingUp className="w-10 h-10" />
                           +145%
                        </div>
                        <p className="text-xs font-medium text-slate-400 mt-2">Você subiu 12 posições nesta semana.</p>
                     </div>
                     
                     <div className="pt-8 border-t border-white/5 space-y-4">
                        <header className="flex justify-between items-center">
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Meta de Elenco</p>
                           <span className="text-[10px] font-black text-indigo-400">92%</span>
                        </header>
                        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-500" style={{ width: '92%' }} />
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed font-bold">A turma está próxima de atingir o objetivo global de 10 mil XP coletivas.</p>
                     </div>
                  </div>

                  <div className="p-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[2rem] shadow-2xl space-y-4 relative overflow-hidden group">
                     <Zap className="absolute top-0 right-0 w-32 h-32 opacity-20 -rotate-12 translate-x-8 -translate-y-8 group-hover:rotate-0 transition-all duration-700" />
                     <h4 className="text-xl font-black italic uppercase tracking-tight">Evento: Cyber-War</h4>
                     <p className="text-sm font-black text-white/80 leading-relaxed">Multiplicador de XP x2 ativo para todos os simulados de Redes até amanhã.</p>
                     <button className="bg-white text-indigo-600 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Participar Agora</button>
                  </div>
               </aside>
            </motion.div>
          )}

          {activeTab === 'recompensas' && (
            <motion.div
              key="recompensas"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-12"
            >
               <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-900 border border-slate-800 p-12 rounded-[3.5rem] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-white">
                     <Gem className="w-64 h-64" />
                  </div>
                  <div className="flex items-center gap-10">
                     <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center p-6 shadow-2xl">
                        <Gem className="w-full h-full text-white" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Saldo Disponível</p>
                        <h1 className="text-6xl font-black italic tracking-tighter">{profile?.saldoTokensIA || 0} <span className="text-slate-500 text-3xl">TIA</span></h1>
                     </div>
                  </div>
                  <button className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl">Histórico de Resgates</button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    { title: 'IA: Consultoria Master', cost: 10, desc: 'Acesso por 24h a um assistente de IA focado em arquitetura limpa.', icon: Sparkles },
                    { title: 'XP Booster x2 (1h)', cost: 25, desc: 'Dobre a experiência ganha em qualquer atividade técnica por 60 minutos.', icon: Rocket },
                    { title: 'Personalização Épica', cost: 50, desc: 'Desbloqueia os temas "Cyber-Vapor" e "Deep-Tech" para seu perfil.', icon: LayoutDashboard },
                    { title: 'Skip: Desafio Semanal', cost: 100, desc: 'Pula a necessidade de conclusão de um desafio para desbloqueio de fase.', icon: Zap },
                  ].map((reward, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] flex flex-col group hover:border-indigo-500/40 transition-all">
                       <div className="flex justify-between items-start mb-8">
                          <div className="p-5 bg-slate-800 rounded-3xl text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                             <reward.icon className="w-8 h-8" />
                          </div>
                          <div className="flex flex-col items-end">
                             <span className="text-xl font-black italic tracking-tighter group-hover:text-amber-400 transition-colors">{reward.cost} TIA</span>
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Custo de Operação</span>
                          </div>
                       </div>
                       <h3 className="text-xl font-black mb-3 tracking-tight italic">{reward.title}</h3>
                       <p className="text-slate-400 text-sm mb-10 flex-1 leading-relaxed">{reward.desc}</p>
                       <button className="w-full py-4 bg-slate-800 group-hover:bg-indigo-600 text-slate-300 group-hover:text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all border border-white/5">Ativar Módulo</button>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
