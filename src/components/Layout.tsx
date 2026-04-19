import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Users, 
  BarChart3, 
  LogOut,
  GraduationCap,
  Menu,
  X,
  Trophy,
  Bot,
  Brain
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import LevelUpCelebration from './LevelUpCelebration';

export function Layout({ children }: { children: React.ReactNode }) {
  const { profile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', roles: ['ALUNO', 'PROFESSOR', 'ADMIN'] },
    { icon: BookOpen, label: 'Simulados', path: '/exams', roles: ['ALUNO', 'PROFESSOR', 'ADMIN'] },
    { icon: Trophy, label: 'Gamificação', path: '/gamification', roles: ['ALUNO', 'ADMIN'] },
    { icon: Bot, label: 'Tutor IA', path: '/tutor-ia', roles: ['ALUNO', 'ADMIN'] },
    { icon: Brain, label: 'Cérebro IA', path: '/ai-hub', roles: ['PROFESSOR', 'ADMIN'] },
    { icon: BookOpen, label: 'Produção de SA', path: '/sa', roles: ['PROFESSOR', 'ADMIN'] },
    { icon: FileText, label: 'Questões', path: '/questions', roles: ['PROFESSOR', 'ADMIN'] },
    { icon: Users, label: 'Turmas', path: '/classes', roles: ['PROFESSOR', 'ADMIN'] },
    { icon: BarChart3, label: 'Relatórios', path: '/reports', roles: ['ALUNO', 'PROFESSOR', 'ADMIN'] },
  ];

  const adminMenuItems = [
    { icon: Users, label: 'Usuários', path: '/admin/users' },
    { icon: FileText, label: 'Configurações', path: '/admin/settings' },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(profile?.perfil) || profile?.perfil === 'ADMIN'
  );

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <LevelUpCelebration />
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200">
        <div className="p-8 flex items-center gap-4 border-b border-slate-100">
          <div className="bg-slate-900 p-3 rounded-2xl shadow-xl shadow-slate-200">
            <GraduationCap className="w-6 h-6 text-indigo-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">EduQuest</span>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Portal SENAI</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Navegação Principal</p>
          {filteredMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group",
                location.pathname === item.path
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform group-hover:scale-110",
                location.pathname === item.path ? "text-indigo-400" : "text-slate-400"
              )} />
              <span className="text-[11px] font-black uppercase tracking-wider">{item.label}</span>
              {location.pathname === item.path && (
                <motion.div layoutId="activeDot" className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
              )}
            </Link>
          ))}

          {profile?.perfil === 'ADMIN' && (
            <>
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-8 mb-4">Administração</p>
              {adminMenuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group",
                    location.pathname === item.path
                      ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 transition-transform group-hover:scale-110",
                    location.pathname === item.path ? "text-indigo-400" : "text-slate-400"
                  )} />
                  <span className="text-[11px] font-black uppercase tracking-wider">{item.label}</span>
                </Link>
              ))}
            </>
          )}
        </nav>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <Link 
            to="/profile"
            className="flex items-center gap-4 p-4 mb-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-indigo-400 font-black italic uppercase text-lg shadow-lg group-hover:scale-105 transition-all">
              {profile?.nome?.[0]}
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-xs font-black text-slate-900 uppercase tracking-tight truncate">{profile?.nome}</p>
               <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{profile?.perfil}</p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 w-full py-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all font-black uppercase text-[10px] tracking-widest"
          >
            <LogOut className="w-4 h-4" />
            Finalizar Sessão
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            <span className="text-lg font-bold text-slate-900">EduQuest</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                className="fixed inset-y-0 left-0 w-64 bg-white z-50 md:hidden flex flex-col"
              >
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                    <span className="text-lg font-bold text-slate-900">EduQuest</span>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="w-6 h-6 text-slate-600" />
                  </button>
                </div>
                <nav className="flex-1 px-4 space-y-1">
                  {filteredMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        location.pathname === item.path
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="p-4 border-t border-slate-200">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Sair
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
