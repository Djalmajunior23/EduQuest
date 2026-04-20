import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where, getDocs, doc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../lib/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BrainCircuit, Compass, Target, Trophy, Flame, Loader2, ArrowRight
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '../../../lib/utils';

export default function StudentAdaptiveJourney() {
  const { user } = useAuth();
  const [perfil, setPerfil] = useState<any>(null);
  const [plano, setPlano] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const radarData = [
    { subject: 'Lógica', A: 80, fullMark: 100 },
    { subject: 'Redes', A: 50, fullMark: 100 },
    { subject: 'Sistemas', A: 70, fullMark: 100 },
    { subject: 'Banco', A: 90, fullMark: 100 },
    { subject: 'UI/UX', A: 30, fullMark: 100 },
  ];

  useEffect(() => {
    if (!user) return;

    // Conecta no Motor Inteligente para pegar Perfil Atual
    const unsubscribeProfile = onSnapshot(doc(db, 'perfil_aluno', user.uid), (docSnap) => {
        if(docSnap.exists()) {
            setPerfil(docSnap.data());
        } else {
            // MOCK Fallback 
            setPerfil({
               classificacaoAtual: 'ALUNO_EM_EVOLUCAO',
               taxaAcertoGeral: 68.5,
               pontosFortes: ['Banco de Dados MySQL'],
               pontosFracos: ['Conceitos de Redes / IP'],
               xpMotor: 1450
            });
        }
    });

    const qPlan = query(
      collection(db, 'planos_estudo'),
      where('studentId', '==', user.uid),
      where('status', '==', 'ATIVO')
    );

    const unsubscribePlan = onSnapshot(qPlan, (snap) => {
       if(!snap.empty) {
           setPlano(snap.docs[0].data());
       } else {
           // MOCK Fallback de Plano
           setPlano({
              semana: 4,
              focoPrincipal: 'Fundamentos de Redes (Sua maior dificuldade nas UCs base)',
              tarefasRecomendadas: [
                 { tipo: 'REVISAO', title: 'Leitura Rápida: Modelo OSI', status: 'PENDING', tempoInfo: '15 Min' },
                 { tipo: 'SIMULADO', title: 'Quiz Diagnóstico de TCP/IP', status: 'PENDING', tempoInfo: '20 Min' }
              ]
           });
       }
       setLoading(false);
    });

    return () => {
        unsubscribeProfile();
        unsubscribePlan();
    };
  }, [user]);

  if(loading) {
      return (
         <div className="flex justify-center p-12 text-indigo-400">
             <Loader2 className="w-8 h-8 animate-spin" />
         </div>
      );
  }

  const parseClassification = (str: string) => {
      return str.replace(/_/g, ' ').toUpperCase();
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 border border-indigo-100">
             <Compass className="w-3 h-3" />
             Seu Hub de Adaptação
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
            Jornada Dinâmica
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Baseado no seu desempenho dos simulados recentes, nós ajustamos a próxima etapa dos seus estudos.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PROFILE CARD */}
          <div className="bg-slate-900 rounded-[2rem] p-8 shadow-xl text-white relative overflow-hidden group col-span-1">
             <div className="absolute -right-8 -top-8 bg-indigo-500/20 w-40 h-40 rounded-full blur-3xl" />
             <div className="relative z-10 flex flex-col h-full justify-between">
                 <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-6 flex items-center gap-2">
                       <BrainCircuit className="w-4 h-4" /> Assessment do Motor
                    </h3>
                    <p className="text-sm font-medium text-slate-300 uppercase tracking-widest mb-1">Status Atual</p>
                    <p className="text-3xl font-black italic tracking-tighter text-emerald-400 mb-8">
                        "{parseClassification(perfil?.classificacaoAtual || '')}"
                    </p>

                    <div className="space-y-4">
                        <div>
                           <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Seus Pontos Fortes</p>
                           <div className="flex flex-wrap gap-2">
                              {(perfil?.pontosFortes || []).map((f: string, i: number) => (
                                 <span key={i} className="px-3 py-1 bg-white/10 rounded-lg text-xs font-bold">{f}</span>
                              ))}
                           </div>
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Focos de Melhoria</p>
                           <div className="flex flex-wrap gap-2">
                              {(perfil?.pontosFracos || []).map((f: string, i: number) => (
                                 <span key={i} className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg text-xs font-bold">{f}</span>
                              ))}
                           </div>
                        </div>
                    </div>
                 </div>

                 <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                         <Flame className="w-5 h-5 text-amber-500" />
                         <span className="font-black italic text-xl tracking-tighter">{perfil?.taxaAcertoGeral}% GERAL</span>
                     </div>
                 </div>
             </div>
          </div>

          {/* NEXT BEST ACTIONS (O Plano Mutante) */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-6">
                  <div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-1">Ação Sugerida (Semana {plano?.semana})</h3>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight">{plano?.focoPrincipal}</h4>
                  </div>
                  <Target className="w-8 h-8 text-slate-200" />
              </div>

              <div className="space-y-3 flex-1 flex flex-col justify-center">
                  {(plano?.tarefasRecomendadas || []).map((t: any, i: number) => (
                      <div key={i} className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors cursor-pointer group">
                         <div className="flex items-center gap-4">
                             <div className={cn(
                                 "w-10 h-10 rounded-xl flex items-center justify-center font-black",
                                 t.tipo === 'REVISAO' ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                             )}>
                                {t.tipo === 'REVISAO' ? 'R' : 'S'}
                             </div>
                             <div>
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400">{t.tipo} • {t.tempoInfo}</p>
                                <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{t.title}</p>
                             </div>
                         </div>
                         <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                            <ArrowRight className="w-4 h-4" />
                         </div>
                      </div>
                  ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-100">
                  <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-200">
                      Iniciar Trilha Adaptada
                  </button>
              </div>
          </div>
      </div>

       {/* RADAR DE COMPETÊNCIAS */}
       <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm mt-8">
           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 text-center">Auditoria de Capacidades Técnicas</h3>
           <div className="max-w-2xl mx-auto h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="Seu Domínio" dataKey="A" stroke="#4f46e5" strokeWidth={3} fill="#4f46e5" fillOpacity={0.4} />
                        <Tooltip />
                    </RadarChart>
                </ResponsiveContainer>
           </div>
       </div>

    </div>
  );
}
