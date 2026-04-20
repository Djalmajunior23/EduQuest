import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
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
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
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

  useEffect(() => {
    async function fetchStats() {
      try {
        if (profile?.perfil === 'ALUNO') {
          // Mocking stats for first turn
          setStats(prev => ({
            ...prev,
            totalAttempts: 5,
            avgScore: 78,
            recentAttempts: []
          }));
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    }

    if (profile) fetchStats();
  }, [profile]);

  if (loading) return (
     <div className="p-12 text-slate-400 font-mono animate-pulse uppercase tracking-widest text-[10px] flex items-center gap-4">
        <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> Iniciando Sistemas de Análise...
     </div>
  );

  // --- Dynamic Dashboard Routing based on Profile Role ---
  if (profile?.perfil === 'ADMIN') {
     return <AdminDashboardPanel />;
  }

  // Fallback / Student Dashboard
  return (
    <div className="space-y-12">
      {/* Dynamic Header */}
      <header className="relative bg-slate-900 rounded-[3rem] p-12 text-white overflow-hidden shadow-2xl">
         <div className="relative z-10 space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
               <span className="bg-blue-600 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full shadow-lg shadow-blue-500/20">
                  Acesso Autorizado // {profile?.perfil}
               </span>
               <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mt-6 leading-none">
                  Bem-vindo, <span className="text-indigo-400">{profile?.nome}</span>
               </h1>
               <p className="max-w-xl text-slate-400 font-medium text-lg mt-4 leading-relaxed">
                  {profile?.perfil === 'ALUNO' 
                    ? 'Sua jornada épica rumo à maestria tecnológica continua aqui.' 
                    : 'Aumente sua produtividade pedagógica com inteligência artificial de ponta.'}
               </p>
            </motion.div>
         </div>
         <Sparkles className="absolute -right-16 -top-16 w-64 h-64 text-white/5 rotate-12" />
         <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent pointer-events-none" />
      </header>

      {/* Operation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Sidebar Controls */}
         <aside className="lg:col-span-1 space-y-6">
            <section className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Status da Missão</h3>
               <div className="space-y-8">
                  <StatItem label="Nível Acadêmico" value="08" sub="Sênior" color="blue" />
                  <StatItem label="Conquistas" value="32" sub="+04 hoje" color="indigo" />
                  <StatItem label="Racha de XP" value="1.2k" sub="Semanas" color="amber" />
               </div>
            </section>

            <section className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100">
               <div className="flex items-center gap-3 mb-6">
                  <Brain className="w-6 h-6 text-indigo-300" />
                  <h3 className="font-black italic uppercase tracking-tighter text-xl">IA Ativa</h3>
               </div>
               <p className="text-xs text-indigo-100 font-medium leading-relaxed mb-8">
                  Analise sua trilha atual e receba sugestões táticas imediatas do Cyber-Sensei.
               </p>
               <Link to="/tutor-ia" className="block w-full py-4 bg-white text-indigo-600 rounded-2xl text-center font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all">
                  Acionar TutorIA
               </Link>
            </section>
         </aside>

         {/* Central Content */}
         <main className="lg:col-span-3 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Activity Monitor */}
               <section className="industrial-card p-10 flex flex-col h-full bg-white border border-slate-200 rounded-[2rem]">
                  <div className="flex justify-between items-center mb-10">
                     <h3 className="text-lg font-black italic uppercase tracking-tighter flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-blue-600" /> Monitor de Domínio
                     </h3>
                     <span className="text-[10px] font-black text-blue-600 uppercase">Real-time</span>
                  </div>
                  <div className="space-y-8 flex-1">
                     <CompetenceBar label="Lógica de Máquinas" progress={85} />
                     <CompetenceBar label="Infraestrutura" progress={62} />
                     <CompetenceBar label="Desenvolvimento" progress={94} />
                     <CompetenceBar label="Ética Digital" progress={70} />
                  </div>
               </section>

               {/* Quick Actions Panel */}
               <section className="industrial-card p-10 bg-slate-50/50 border border-slate-200 rounded-[2rem]">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Operações Rápidas</h3>
                  <div className="grid grid-cols-2 gap-4">
                     <QuickActionBtn icon={BookOpen} label="Simulados" link="/exams" color="blue" />
                     <QuickActionBtn icon={Target} label="Trilhas" link="/sa" color="indigo" />
                     <QuickActionBtn icon={Trophy} label="Ranking" link="/gamification" color="amber" />
                     <QuickActionBtn icon={FileText} label="Relatórios" link="/reports" color="slate" />
                  </div>
               </section>
            </div>

            {/* Recent Timeline */}
            <section className="industrial-card p-10 bg-white border border-slate-200 rounded-[2rem]">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Fluxo Recente de Atividades</h3>
                  <Link to="/reports" className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 group">
                     Ver Log Completo <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
               </div>
               <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="group flex items-center gap-6 p-6 bg-slate-50 rounded-[1.5rem] border border-transparent hover:border-slate-200 hover:bg-white transition-all cursor-pointer">
                       <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:shadow-md transition-all">
                          <CheckCircle2 className="w-6 h-6" />
                       </div>
                       <div className="flex-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Simulado Concluído</p>
                          <h4 className="text-sm font-black italic uppercase tracking-tight text-slate-900 leading-none">Fundamentos de Redes IP v{i}.0</h4>
                       </div>
                       <div className="text-right">
                          <span className="text-2xl font-black italic text-slate-900">8{i}%</span>
                          <p className="text-[10px] font-black text-emerald-500 uppercase">Superior</p>
                       </div>
                    </div>
                  ))}
               </div>
            </section>
         </main>
      </div>
    </div>
  );
}

function StatItem({ label, value, sub, color }: any) {
  const colors: any = {
    blue: "text-blue-600",
    indigo: "text-indigo-600",
    amber: "text-amber-600"
  };
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className={cn("text-3xl font-black italic uppercase tracking-tighter", colors[color])}>{value}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase">{sub}</span>
      </div>
    </div>
  );
}

function CompetenceBar({ label, progress }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{label}</span>
        <span className="text-sm font-black italic text-slate-900">{progress}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-slate-900 rounded-full"
        />
      </div>
    </div>
  );
}

function QuickActionBtn({ icon: Icon, label, link, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white",
    indigo: "bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white",
    amber: "bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white",
    slate: "bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white",
  };
  return (
    <Link to={link} className={cn("flex flex-col items-center justify-center gap-3 p-6 rounded-[2rem] transition-all active:scale-95 shadow-sm hover:shadow-xl", colors[color])}>
      <Icon className="w-6 h-6" />
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </Link>
  );
}
