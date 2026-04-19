import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { saService, LearningSituation } from '../../../services/saService';
import { useAuth } from '../../../lib/AuthContext';
import { 
  ChevronLeft, 
  Printer, 
  Share2, 
  Download, 
  GraduationCap, 
  Briefcase,
  Layers,
  Clock,
  CheckSquare,
  FileText,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../../lib/utils';

export default function SAView() {
  const { id } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [sa, setSA] = useState<LearningSituation | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'student' | 'teacher'>(profile?.perfil === 'ALUNO' ? 'student' : 'teacher');

  useEffect(() => {
    if (id) {
      saService.getSA(id).then(data => {
        setSA(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Consolidando Conhecimento...</div>;
  if (!sa) return <div className="min-h-screen flex items-center justify-center">Situação não localizada.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-10 space-y-12 bg-white min-h-screen shadow-2xl shadow-slate-200 print:shadow-none print:p-0">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-10">
        <div className="flex items-center gap-6">
           <button onClick={() => navigate('/sa')} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors print:hidden">
              <ChevronLeft className="w-6 h-6 text-slate-400" />
           </button>
           <div>
              <div className="flex items-center gap-3 mb-2">
                 <span className="text-[10px] font-black uppercase bg-blue-600 text-white px-3 py-1 rounded-full tracking-widest italic">SA #{sa.id?.slice(-4)}</span>
                 <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">UC: {sa.ucId}</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">{sa.titulo}</h1>
           </div>
        </div>

        <div className="flex gap-4 print:hidden">
          <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-slate-900 transition-all"><Printer className="w-5 h-5" /></button>
          <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-slate-900 transition-all"><Download className="w-5 h-5" /></button>
          {profile?.perfil !== 'ALUNO' && (
            <button 
              onClick={() => setViewMode(prev => prev === 'teacher' ? 'student' : 'teacher')}
              className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-all"
            >
              Ver como {viewMode === 'teacher' ? 'Aluno' : 'Professor'}
            </button>
          )}
        </div>
      </header>

      <main className="space-y-16">
        {/* Sessão: Contexto & Desafio (Sempre visível) */}
        <section className="space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                 <h3 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
                   <Layers className="w-4 h-4" /> Contexto do Projeto
                 </h3>
                 <p className="text-slate-700 font-medium leading-relaxed italic text-lg opacity-80">{sa.contexto}</p>
              </div>
              <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white space-y-6 relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                    <AlertCircle className="w-40 h-40" />
                 </div>
                 <h3 className="text-sm font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2 relative z-10">
                   <Briefcase className="w-4 h-4" /> O Problema
                 </h3>
                 <p className="text-indigo-100 font-bold leading-relaxed relative z-10">{sa.problema_desafio}</p>
              </div>
           </div>
        </section>

        {/* Sessão: Metas e Entrega (Foco Aluno) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
           <div className="md:col-span-2 space-y-10">
              <div className="space-y-8">
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-4">Entregas do Projeto</h3>
                 <div className="grid grid-cols-1 gap-4">
                    {sa.entregas?.map((entrega, i) => (
                      <div key={i} className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-blue-200 transition-all">
                         <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-blue-600 shadow-sm border border-slate-100 shrink-0">0{i+1}</div>
                         <div className="flex-1">
                            <p className="font-black text-slate-900 text-lg tracking-tight leading-none mb-1">{entrega.descricao}</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{entrega.prazo || 'A definir'}</p>
                         </div>
                         <CheckSquare className="w-6 h-6 text-slate-200 group-hover:text-blue-500 transition-colors" />
                      </div>
                    ))}
                    {(!sa.entregas || sa.entregas.length === 0) && (
                       <p className="text-slate-400 font-medium italic">Nenhuma entrega definida para esta SA.</p>
                    )}
                 </div>
              </div>

              <div className="space-y-8">
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-indigo-600 pl-4">Objetivos de Aprendizagem</h3>
                 <ul className="space-y-4">
                    {sa.objetivos_especificos?.map((obj, i) => (
                      <li key={i} className="flex items-start gap-4 text-slate-600 font-medium leading-relaxed">
                         <div className="w-2 h-2 rounded-full bg-indigo-400 mt-2 shrink-0"></div>
                         {obj}
                      </li>
                    ))}
                 </ul>
              </div>
           </div>

           {/* Sidebar: Infos Rápidas */}
           <aside className="space-y-8">
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-6">
                 <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Recursos Necessários</h4>
                    <ul className="space-y-2">
                       {sa.recursos_necessarios?.map((r, i) => (
                         <li key={i} className="text-xs font-bold text-slate-600 flex items-center gap-2">
                            <Layers className="w-3 h-3 text-blue-500" /> {r}
                         </li>
                       ))}
                    </ul>
                 </div>
                 <div className="pt-6 border-t border-slate-200">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Cronograma Previsto</h4>
                    <p className="text-xs font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                       <Clock className="w-4 h-4 text-indigo-600" /> {sa.cronograma || 'Ver detalhes com o professor'}
                    </p>
                 </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-8 rounded-[2rem] text-white shadow-xl">
                 <GraduationCap className="w-8 h-8 mb-4 opacity-50" />
                 <h4 className="font-black text-lg uppercase italic tracking-tighter mb-2">Dica Operacional</h4>
                 <p className="text-indigo-100 text-sm font-bold leading-tight line-clamp-3">{sa.orientacoes_aluno || 'Siga as orientações específicas da UC para completar este desafio.'}</p>
                 <button className="mt-6 text-[10px] font-black uppercase underline tracking-widest opacity-80 hover:opacity-100">Ver mais orientações</button>
              </div>
           </aside>
        </section>

        {/* Sessão exclusiva Professor */}
        {viewMode === 'teacher' && (
          <section className="bg-blue-50/50 p-12 rounded-[3.5rem] border border-blue-100 space-y-10">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl text-white">
                   <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Guia do Professor</h3>
             </div>
             
             <div className="grid grid-cols-1 gap-10">
                <div>
                   <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3">Orientações de Aplicação</h4>
                   <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">{sa.orientacoes_professor || 'Nenhuma orientação cadastrada para este módulo.'}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div>
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Conhecimentos Técnicos (KT)</h4>
                      <div className="flex flex-wrap gap-2">
                         {sa.conhecimentoTecnicoIds?.map(id => (
                           <span key={id} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 uppercase tracking-wider">{id}</span>
                         ))}
                      </div>
                   </div>
                   <div>
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Capacidades Técnicas (CT)</h4>
                      <div className="flex flex-wrap gap-2">
                         {sa.capacidadeTecnicaIds?.map(id => (
                           <span key={id} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 uppercase tracking-wider">{id}</span>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </section>
        )}
      </main>

      <footer className="pt-10 border-t border-slate-100 opacity-30 text-[10px] font-black uppercase tracking-[0.3em] flex justify-between">
         <span>© 2026 SENAI EduQuest Ecosystem</span>
         <span>Gerado via IA Assistida por Especialista</span>
      </footer>
    </div>
  );
}
