import React, { useEffect, useState } from 'react';
import { normalizeArray } from '../utils/normalizeArray';
import { useAuth } from '../lib/AuthContext';
import { 
  Trophy, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  BookOpen,
  Users,
  FileText,
  TrendingUp,
  Brain,
  Target,
  Sparkles,
  Loader2,
  Star,
  Activity,
  Zap,
  ChevronRight,
  Layout,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { AdminDashboardPanel } from '../modules/admin/AdminDashboard';

export default function Dashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalAttempts: 0,
    avgScore: 0,
    recentAttempts: [] as any[],
    activeExams: 0,
    totalQuestions: 0,
    totalStudents: 0,
    competencePerformance: {} as any
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function fetchStats() {
      try {
        if (profile?.perfil === 'ALUNO') {
          // Mocking stats for a rich experience
          setStats(prev => ({
            ...prev,
            totalAttempts: 12,
            avgScore: 84,
            recentAttempts: [
              { id: 1, title: 'Cálculo I - Integrais', score: 92, date: '2024-05-01' },
              { id: 2, title: 'Física Moderna', score: 78, date: '2024-04-28' },
              { id: 3, title: 'Algoritmos Avançados', score: 88, date: '2024-04-25' }
            ]
          }));
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    }

    if (profile) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [profile]);

  if (loading) return (
     <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-6">
        <div className="relative">
           <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
           <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-ping" />
        </div>
        <div className="text-center space-y-2">
           <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">NexusInt Core</h2>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Sincronizando Heurísticas de Domínio...</p>
        </div>
     </div>
  );

  if (profile?.perfil === 'ADMIN') {
     return <AdminDashboardPanel />;
  }

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
      {/* High-Impact Cinematic Header */}
      <header className="relative bg-slate-950 rounded-[3rem] p-12 md:p-16 text-white overflow-hidden shadow-2xl border border-white/5 group">
         <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <motion.div 
               initial={{ opacity: 0, x: -20 }} 
               animate={{ opacity: 1, x: 0 }}
               className="space-y-6 max-w-2xl"
            >
               <div className="flex items-center gap-3">
                  <div className="bg-indigo-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
                     <Activity className="w-5 h-5 text-white" />
                  </div>
                  <span className="bg-white/5 text-indigo-300 text-[9px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                     Sincronização Ativa // ID: {profile?.id?.slice(0, 8)}
                  </span>
               </div>
               
               <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9]">
                  SISTEMA <span className="text-indigo-500 block md:inline">NEXUS</span>
               </h1>
               
               <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-lg">
                  Bem-vindo, <span className="text-white font-bold">{profile?.nome}</span>. 
                  Seu progresso atual está <span className="text-indigo-400 font-black">12% acima</span> da meta trimestral.
               </p>

               <div className="flex gap-4 pt-4">
                  <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
                     Retomar Última Aula
                  </button>
                  <button className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border border-white/10 active:scale-95">
                     Ver Cronograma
                  </button>
               </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="hidden lg:block lg:w-1/3"
            >
               <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden group/card shadow-2xl">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl" />
                  <div className="flex justify-between items-center relative z-10">
                     <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Eficiência Neural</h3>
                     <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
                  </div>
                  <div className="text-6xl font-black italic tracking-tighter text-white relative z-10">{stats.avgScore}%</div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative z-10">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.avgScore}%` }}
                        className="h-full bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                     />
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 relative z-10">Consistência de Domínio: ALTA</p>
               </div>
            </motion.div>
         </div>
         
         <Sparkles className="absolute -right-20 -top-20 w-96 h-96 text-indigo-500/5 rotate-12 transition-transform group-hover:scale-110 duration-700" />
         <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px]" />
      </header>

      {/* Refined Navigation Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-slate-200">
         <div className="flex gap-10">
            {[
              { id: 'overview', label: 'Visão Geral', icon: Layout },
              { id: 'performance', label: 'Desempenho', icon: TrendingUp },
              { id: 'activities', label: 'Atividades', icon: Clock }
            ].map((tab) => (
               <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative pb-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                    activeTab === tab.id ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                  )}
               >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                     <motion.div 
                        layoutId="activeTab" 
                        className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                     />
                  )}
               </button>
            ))}
         </div>

         <div className="flex items-center gap-3 pb-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Último Acesso: Hoje, 09:42</span>
            <div className="w-px h-4 bg-slate-200" />
            <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
               <Info className="w-4 h-4 text-slate-400" />
            </button>
         </div>
      </div>

      {/* Main Content Layout with Tabs */}
      <AnimatePresence mode="wait">
         <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10"
         >
            {activeTab === 'overview' && (
               <>
                  <aside className="lg:col-span-4 space-y-8">
                     <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity">
                           <Target className="w-32 h-32 text-slate-900" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Status de Licenciamento</h3>
                        
                        <div className="bg-slate-950 rounded-[2rem] p-8 text-white mb-10 shadow-2xl border border-white/5 relative group/sub">
                           <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                 <Star className="w-5 h-5 text-indigo-400 fill-indigo-400" />
                                 <h4 className="text-2xl font-black italic uppercase tracking-tighter">{profile?.plano || 'PRÉMIUM'}</h4>
                              </div>
                              <Link to="/plans" className="opacity-0 group-hover/sub:opacity-100 transition-all">
                                 <ChevronRight className="w-6 h-6 text-indigo-400" />
                              </Link>
                           </div>
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Acesso Vitalício Ativo</p>
                        </div>

                        <div className="space-y-10">
                           <StatItem label="Questões Resolvidas" value={stats.totalAttempts * 24} sub="+12" color="indigo" />
                           <StatItem label="Tempo de Foco" value="42h" sub="Nesta Semana" color="blue" />
                           <StatItem label="Tokens IA" value={profile?.saldoTokensIA || 2500} sub="Disponíveis" color="amber" />
                        </div>
                     </section>

                     <section className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                        <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:rotate-12 transition-transform">
                           <Brain className="w-60 h-60 text-white" />
                        </div>
                        <div className="relative z-10 space-y-6">
                           <div className="flex items-center gap-4">
                              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                                 <Sparkles className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                 <h3 className="text-lg font-black italic uppercase tracking-tighter leading-none">Cyber-Sensei</h3>
                                 <p className="text-[9px] font-black text-indigo-200 uppercase tracking-widest">IA Analítica Ativa</p>
                              </div>
                           </div>
                           <p className="text-sm text-indigo-100 font-medium leading-relaxed">
                              "Identificado gap em Termodinâmica II. Recomendo iniciar trilha de reforço nível III."
                           </p>
                           <Link to="/virtual-mentor" className="flex items-center justify-center w-full py-5 bg-white text-indigo-600 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">
                              Consultar Mentor
                           </Link>
                        </div>
                     </section>
                  </aside>

                  <main className="lg:col-span-8 space-y-10">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-100">
                           <div className="flex justify-between items-center mb-12">
                              <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Domínio Técnico</h3>
                              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest">Sigma Data</span>
                           </div>
                           <div className="space-y-10">
                              <CompetenceBar label="Engenharia Mecânica" progress={92} color="#6366f1" />
                              <CompetenceBar label="Gestão de Projetos" progress={78} color="#3b82f6" />
                              <CompetenceBar label="Liderança Lean" progress={64} color="#f59e0b" />
                              <CompetenceBar label="Inovação Disruptiva" progress={85} color="#10b981" />
                           </div>
                        </section>

                        <section className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
                           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-10">Ações Centrais</h3>
                           <div className="grid grid-cols-2 gap-6">
                              <QuickActionBtn icon={BookOpen} label="Exames" link="/exams" color="indigo" />
                              <QuickActionBtn icon={Target} label="Trilhas" link="/student/dossier" color="blue" />
                              <QuickActionBtn icon={Trophy} label="Elite" link="/gamification" color="amber" />
                              <QuickActionBtn icon={FileText} label="Laudos" link="/reports" color="slate" />
                           </div>
                        </section>
                     </div>

                     <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-100">
                        <div className="flex justify-between items-center mb-10">
                           <div>
                              <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 leading-none mb-1">Linha do Tempo</h3>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Atividades Sincronizadas</p>
                           </div>
                           <Link to="/reports" className="flex items-center gap-2 group px-6 py-2.5 bg-slate-50 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-900 hover:text-white transition-all">
                              Logs <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                           </Link>
                        </div>
                        <div className="space-y-6">
                           {normalizeArray(stats.recentAttempts).map((attempt) => (
                             <motion.div 
                                key={attempt.id}
                                whileHover={{ x: 10 }}
                                className="group flex items-center gap-8 p-8 bg-slate-50 rounded-[2.5rem] border-2 border-transparent hover:border-indigo-100 hover:bg-white transition-all cursor-pointer"
                             >
                                <div className="w-16 h-16 rounded-[1.5rem] bg-white shadow-xl flex items-center justify-center text-slate-300 group-hover:scale-110 group-hover:text-indigo-600 transition-all">
                                   <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                   <div className="flex items-center gap-3 mb-2">
                                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{new Date(attempt.date).toLocaleDateString('pt-BR')}</span>
                                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                                      <span className="text-[9px] font-black uppercase text-indigo-500 tracking-widest">Protocolo Concluído</span>
                                   </div>
                                   <h4 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">{attempt.title}</h4>
                                </div>
                                <div className="text-right">
                                   <span className="text-4xl font-black italic text-slate-900 tabular-nums">{attempt.score}%</span>
                                   <div className="flex items-center justify-end gap-1 mt-1">
                                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                      <p className="text-[10px] font-black text-emerald-600 uppercase">Mestre</p>
                                   </div>
                                </div>
                             </motion.div>
                           ))}
                        </div>
                     </section>
                  </main>
               </>
            )}

            {activeTab === 'performance' && (
               <div className="lg:col-span-12">
                  <div className="bg-white p-20 rounded-[4rem] text-center space-y-6 border-2 border-dashed border-slate-100">
                     <TrendingUp className="w-20 h-20 text-indigo-100 mx-auto" />
                     <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">Analytics em Deep-Learning</h2>
                     <p className="text-slate-400 max-w-sm mx-auto font-medium">Estamos processando seu mapa de calor neuro-pedagógico para fornecer insights de precisão militar.</p>
                  </div>
               </div>
            )}

            {activeTab === 'activities' && (
               <div className="lg:col-span-12">
                   <div className="bg-white p-20 rounded-[4rem] text-center space-y-6 border-2 border-dashed border-slate-100">
                     <Clock className="w-20 h-20 text-indigo-100 mx-auto" />
                     <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">Arquivo de Atividades</h2>
                     <p className="text-slate-400 max-w-sm mx-auto font-medium">Histórico completo de sua jornada será exibido aqui em breve.</p>
                  </div>
               </div>
            )}
         </motion.div>
      </AnimatePresence>
    </div>
  );
}

function StatItem({ label, value, sub, color }: any) {
  const colors: any = {
    blue: "text-blue-600 shadow-blue-100",
    indigo: "text-indigo-600 shadow-indigo-100",
    amber: "text-amber-600 shadow-amber-100"
  };
  return (
    <div className="group">
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 group-hover:text-indigo-600 transition-colors">{label}</p>
      <div className="flex items-baseline gap-3">
        <span className={cn("text-5xl font-black italic uppercase tracking-tighter leading-none transition-transform group-hover:scale-105", colors[color].split(' ')[0])}>{value}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sub}</span>
      </div>
    </div>
  );
}

function CompetenceBar({ label, progress, color }: any) {
  return (
    <div className="space-y-4 group">
      <div className="flex justify-between items-end">
        <div>
           <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.1em] mb-1 block group-hover:text-indigo-600 transition-colors">{label}</span>
           <div className="h-0.5 w-12 bg-slate-100" />
        </div>
        <span className="text-3xl font-black italic text-slate-900 tabular-nums">{progress}%</span>
      </div>
      <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${progress}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ backgroundColor: color }}
          className="h-full rounded-full shadow-lg relative"
        >
           <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
        </motion.div>
      </div>
    </div>
  );
}

function QuickActionBtn({ icon: Icon, label, link, color }: any) {
  const colors: any = {
    indigo: "bg-indigo-50 text-indigo-600 hover:bg-slate-900 hover:text-white border-indigo-100",
    blue: "bg-blue-50 text-blue-600 hover:bg-slate-900 hover:text-white border-blue-100",
    amber: "bg-amber-50 text-amber-600 hover:bg-slate-900 hover:text-white border-amber-100",
    slate: "bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white border-slate-200",
  };
  return (
    <Link 
       to={link} 
       className={cn(
         "flex flex-col items-center justify-center gap-4 p-8 rounded-[2.5rem] border transition-all active:scale-95 shadow-sm hover:shadow-2xl hover:-translate-y-2", 
         colors[color]
       )}
    >
      <div className="p-4 bg-white rounded-2xl shadow-sm">
         <Icon className="w-6 h-6" />
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
    </Link>
  );
}
