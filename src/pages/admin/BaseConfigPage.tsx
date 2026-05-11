import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PageHeader } from '@/components/common/PageHeader';
import { MetricCard } from '@/components/common/MetricCard';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { 
  Building, BookOpen, Users, GraduationCap, Target, 
  Settings, Upload, Bot, CheckCircle2, AlertTriangle, HelpCircle, Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EduJarvisSettings } from '@/components/admin/EduJarvisSettings';
import { UsersConfigTab } from '@/components/admin/UsersConfigTab';
import { CommunicationSettings } from '@/components/admin/CommunicationSettings';
import { InstitutionConfig } from '@/components/admin/InstitutionConfig';
import { CourseConfig } from '@/components/admin/CourseConfig';
import { UCConfig } from '@/components/admin/UCConfig';

const navItems = [
  { id: 'instituicao', label: 'Instituição', icon: Building, description: 'Dados da escola, unidades e endereços.' },
  { id: 'cursos', label: 'Cursos', icon: BookOpen, description: 'Catálogo de cursos técnicos e superiores.' },
  { id: 'turmas', label: 'Turmas', icon: Users, description: 'Gestão de turmas, semestres e períodos.' },
  { id: 'unidades', label: 'Unidades Curriculares', icon: GraduationCap, description: 'Módulos, UCs e componentes curriculares.' },
  { id: 'competencias', label: 'Competências', icon: Target, description: 'Mapeamento de competências e habilidades.' },
  { id: 'usuarios', label: 'Usuários', icon: Users, description: 'Gestão manual e importação de usuários.' },
  { id: 'edujarvis', label: 'EduJarvis', icon: Bot, description: 'Parâmetros de IA, limites e comportamento.' },
  { id: 'importacao', label: 'Importação', icon: Upload, description: 'Batch import de dados legados via CSV.' },
  { id: 'pedagogicas', label: 'Configurações Pedagógicas', icon: Settings, description: 'Parâmetros educacionais e de avaliação.' },
  { id: 'comunicacao', label: 'Comunicação e E-mails', icon: Mail, description: 'Configuração de provedores, templates e notificações.' },
];

export default function BaseConfigPage() {
  const [activeTab, setActiveTab] = useState('instituicao');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="p-8 bg-slate-50 rounded-3xl animate-pulse h-48" />
          ))}
        </div>
      );
    }

    switch (activeTab) {
        case 'instituicao':
            return <InstitutionConfig />;
        case 'cursos':
            return <CourseConfig />;
        case 'unidades':
            return <UCConfig />;
        case 'edujarvis':
            return <EduJarvisSettings />;
        case 'usuarios':
            return <UsersConfigTab />;
        case 'comunicacao':
            return <CommunicationSettings />;
        default:
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                    <div className="p-8 border border-slate-100 rounded-[2.5rem] bg-slate-50/50 flex flex-col justify-center items-center text-center">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                            <Settings className="w-8 h-8 text-indigo-500 animate-pulse" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Módulo em Desenvolvimento</h3>
                        <p className="text-sm text-slate-500 max-w-xs mx-auto">
                            Estamos refinando a experiência de gestão para {navItems.find(i => i.id === activeTab)?.label.toLowerCase()}.
                        </p>
                    </div>
                    
                    <div className="p-8 bg-indigo-50/30 rounded-[2.5rem] flex flex-col justify-center border border-indigo-100/50">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 text-indigo-600">
                            <HelpCircle className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2">O que esperar?</h4>
                        <ul className="text-sm text-slate-600 space-y-3 font-medium">
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                Interface simplificada drag-and-drop
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                Validação inteligente com EduJarvis
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                Histórico de alterações e auditoria
                            </li>
                        </ul>
                    </div>
                </div>
            );
    }
  };

  const currentItem = navItems.find(i => i.id === activeTab);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-[1600px] mx-auto p-4 md:p-8">
        
        {/* Header Compacto */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/admin')} 
              className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-all text-slate-600"
            >
              <Building className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                Base <span className="text-indigo-600">Config</span>
              </h1>
              <nav className="flex items-center gap-2 mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <span>Admin</span>
                <span className="text-slate-200">/</span>
                <span className="text-indigo-500">Configurações de Base</span>
              </nav>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm mr-4">
                  <div className="text-right">
                      <p className="text-[10px] font-black uppercase text-slate-400 leading-none">Status</p>
                      <p className="text-xs font-bold text-emerald-500 mt-1 uppercase">Sincronizado</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                      <CheckCircle2 className="w-4 h-4" />
                  </div>
              </div>
              <button 
                  onClick={() => navigate(-1)} 
                  className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all"
              >
                  Sair do Dashboard
              </button>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar de Navegação */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden sticky top-8">
              <div className="p-8 border-b border-slate-50">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                   <Target className="w-3 h-3" /> Categorias
                </h4>
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={cn(
                          "w-full group relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300",
                          isActive 
                            ? "bg-indigo-50 text-indigo-900" 
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        {isActive && (
                          <motion.div 
                            layoutId="active-pill"
                            className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-full"
                          />
                        )}
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                          isActive 
                            ? "bg-white shadow-md text-indigo-600" 
                            : "bg-slate-50 text-slate-400 group-hover:bg-white group-hover:shadow-sm group-hover:text-slate-600"
                        )}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider">{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
              
              {/* Footer da Sidebar */}
              <div className="p-8 bg-slate-50/50">
                  <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                          <Bot className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div>
                          <p className="text-[10px] font-black uppercase text-slate-400 mb-0.5">EduJarvis Sync</p>
                          <p className="text-xs font-bold text-slate-700">Verificado com IA</p>
                      </div>
                  </div>
              </div>
            </div>
          </aside>

          {/* Área de Conteúdo Principal */}
          <main className="flex-1 min-w-0">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[700px] flex flex-col"
            >
              {/* Header do Conteúdo */}
              <div className="px-10 py-10 border-b border-slate-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">
                      {currentItem?.label}
                    </h2>
                    <p className="text-slate-500 font-medium mt-2 max-w-2xl">{currentItem?.description}</p>
                  </div>
                  
                  {/* Action Bar Local */}
                  <div className="flex gap-2">
                      <button className="px-6 py-3 rounded-2xl border border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
                        <Upload className="w-3.5 h-3.5" /> Importar
                      </button>
                      <button className="px-6 py-3 rounded-2xl bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2">
                        Adicionar Novo
                      </button>
                  </div>
                </div>
              </div>

              {/* Corpo do Conteúdo */}
              <div className="p-10 flex-1 bg-[#fcfcfc]/50">
                {renderContent()}
              </div>

              {/* Rodapé Interno */}
              <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Sistema Online
                      </span>
                      <span className="text-slate-200">|</span>
                      <span>v1.2.4-Nexus</span>
                  </div>
                  <div className="flex gap-6">
                      <a href="#" className="hover:text-indigo-500 transition-colors">Termos</a>
                      <a href="#" className="hover:text-indigo-500 transition-colors">Ajuda</a>
                  </div>
              </div>
            </motion.div>
          </main>

        </div>
      </div>
    </div>
  );
}

