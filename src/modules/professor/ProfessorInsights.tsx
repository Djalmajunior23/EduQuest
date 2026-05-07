import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingDown, TrendingUp, AlertTriangle, Brain, 
  Target, Users, Zap, Search, Filter, ChevronRight,
  MessageSquare, Lightbulb, Activity, BarChart3
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { cn } from '../../lib/utils';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';

export default function ProfessorInsights() {
  const { profile } = useAuth();
  const [studentsAtRisk, setStudentsAtRisk] = useState<any[]>([]);
  const [classMetrics, setClassMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Prediction & Early Warning Simulation
    setStudentsAtRisk([]);
    setClassMetrics({
      mediaEvolucao: 0,
      eficienciaProfessor: 0,
      engajamentoGlobal: 0
    });
    setLoading(false);
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-32">
       <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Pedagogical Intelligence</h1>
            <p className="text-slate-500 font-medium mt-2">Insights preditivos e ações preventivas cruciais.</p>
          </div>
          <div className="flex gap-4">
             <div className="bg-white border border-slate-200 px-6 py-3 rounded-2xl flex items-center gap-3">
                <Users className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-black text-slate-900 uppercase">Turma TI-2024</span>
             </div>
          </div>
       </header>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Alerts & Critical Action */}
          <div className="lg:col-span-2 space-y-6">
             <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic flex items-center gap-2">
                   <AlertTriangle className="w-5 h-5 text-amber-500" /> Alertas de Risco Precoce
                </h2>
                <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                   {studentsAtRisk.length} Críticos
                </div>
             </div>

             <div className="grid gap-4">
                {studentsAtRisk.map((student) => (
                  <motion.div 
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl hover:shadow-red-50 group"
                  >
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                           <img src={`https://i.pravatar.cc/150?u=${student.id}`} alt={student.nome} referrerPolicy="no-referrer" />
                        </div>
                        <div>
                           <h4 className="font-bold text-slate-900 text-lg group-hover:text-red-600 transition-colors">{student.nome}</h4>
                           <p className="text-xs font-medium text-slate-400">{student.motivo}</p>
                        </div>
                     </div>

                     <div className="flex flex-col md:items-end">
                        <div className={cn(
                          "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-1",
                          student.risco === 'CRÍTICO' ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                        )}>
                           {student.risco}
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 italic uppercase italic">{student.predicao}</p>
                     </div>

                     <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors flex items-center gap-2">
                        Intervir Agora <MessageSquare className="w-4 h-4" />
                     </button>
                  </motion.div>
                ))}
             </div>

             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Evolução Técnica da Turma</h3>
                   <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="h-[300px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { name: 'Sem 1', val: 40 },
                        { name: 'Sem 2', val: 55 },
                        { name: 'Sem 3', val: 52 },
                        { name: 'Sem 4', val: 68 },
                        { name: 'Sem 5', val: 75 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                        />
                        <Line type="monotone" dataKey="val" stroke="#8b5cf6" strokeWidth={4} dot={{ r: 6, fill: '#8b5cf6' }} />
                      </LineChart>
                   </ResponsiveContainer>
                </div>
             </div>
          </div>

          {/* Right Sidebar: Predictions & AI Suggest */}
          <div className="space-y-6">
             <div className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-100 transition-transform hover:scale-[1.02] cursor-pointer">
                <div className="relative z-10">
                   <Brain className="w-10 h-10 text-indigo-400 mb-6" />
                   <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-none mb-4">Predição Semanal</h3>
                   <div className="space-y-4">
                      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                         <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Capacidade Crítica</p>
                         <p className="text-sm font-bold">Resolução de Conflitos em Equipe</p>
                      </div>
                      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                         <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Taxonomia Alvo</p>
                         <p className="text-sm font-bold">Avaliação (Nível 5 - Bloom)</p>
                      </div>
                   </div>
                   <p className="text-indigo-200 text-xs font-medium mt-6 leading-relaxed">
                      A IA sugere aplicar um <strong className="text-white">Debate Socrático</strong> na próxima terça-feira para elevar o nível de abstração técnica de 14 alunos atrasados.
                   </p>
                </div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 blur-[60px]" />
             </div>

             <div className="bg-white border border-slate-200 rounded-[3rem] p-8 space-y-8">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Efetividade Pedagógica</h3>
                <div className="space-y-6">
                   {[
                     { label: 'Feedback Ágil', val: 92, color: 'text-emerald-500' },
                     { label: 'Clareza Objetiva', val: 85, color: 'text-blue-500' },
                     { label: 'Engajamento Ativo', val: 74, color: 'text-amber-500' }
                   ].map(metric => (
                     <div key={metric.label} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-indigo-500 transition-colors" />
                           <span className="text-xs font-bold text-slate-600">{metric.label}</span>
                        </div>
                        <span className={cn("text-lg font-black italic", metric.color)}>{metric.val}%</span>
                     </div>
                   ))}
                </div>

                <div className="pt-8 border-t border-slate-100">
                   <button className="w-full flex items-center justify-between bg-slate-50 p-4 rounded-2xl hover:bg-slate-100 transition-all font-bold text-xs uppercase tracking-widest text-slate-900 group">
                      Dossiê de Intervenções
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
