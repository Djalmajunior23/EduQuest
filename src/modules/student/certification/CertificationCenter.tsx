import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Medal, Award, Star, Trophy, ChevronRight, 
  Download, Share2, ShieldCheck, Zap, Target,
  Sparkles, History, GraduationCap
} from 'lucide-react';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../lib/AuthContext';
import { cn } from '../../../lib/utils';
import confetti from 'canvas-confetti';

interface Badge {
  id: string;
  title: string;
  description: string;
  category: 'TECHNICAL' | 'SOFT_SKILL' | 'MILESTONE';
  unlocked: boolean;
  unlockedAt?: any;
}

export default function CertificationCenter() {
  const { profile } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial mock state of certificates and badges
    setBadges([]);
    setLoading(false);
  }, []);

  const celebrate = (badge: Badge) => {
    if (!badge.unlocked) return;
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4f46e5', '#f59e0b', '#10b981']
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32">
       <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex items-center gap-6">
             <div className="bg-slate-900 p-5 rounded-[2rem] shadow-2xl shadow-indigo-100 rotate-3 transition-transform hover:rotate-0 cursor-pointer">
                <Medal className="w-10 h-10 text-indigo-400" />
             </div>
             <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em]">Portfólio de Honra</span>
                  <div className="w-8 h-px bg-indigo-100" />
                </div>
                <h1 className="text-5xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Certificações</h1>
             </div>
          </div>

          <div className="flex bg-white p-3 border border-slate-200 rounded-3xl shadow-sm items-center gap-8 px-10">
             <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total badges</p>
                <p className="text-2xl font-black text-slate-900">08</p>
             </div>
             <div className="w-px h-10 bg-slate-100" />
             <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nível Inteligência Educacional Interativa</p>
                <p className="text-2xl font-black text-indigo-600 italic">PRO 4</p>
             </div>
          </div>
       </header>

       <section className="space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3 italic">
                <Medal className="w-5 h-5 text-indigo-500" /> Medalhas e Conquistas
             </h2>
             <div className="flex gap-2">
                {['TODAS', 'TECNICAS', 'COMPORTAMENTAIS'].map(f => (
                  <button key={f} className="text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest px-4 py-2 bg-white border border-slate-200 rounded-full">
                    {f}
                  </button>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map((badge) => (
                <motion.div
                  key={badge.id}
                  whileHover={{ y: -5 }}
                  onClick={() => celebrate(badge)}
                  className={cn(
                    "relative p-8 rounded-[3rem] border transition-all cursor-pointer group overflow-hidden",
                    badge.unlocked 
                      ? "bg-white border-slate-200 hover:shadow-2xl hover:shadow-indigo-100" 
                      : "bg-slate-50 border-slate-100 opacity-60 grayscale"
                  )}
                >
                   <div className="relative z-10">
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 group-hover:rotate-6",
                        badge.unlocked ? "bg-indigo-50 text-indigo-600" : "bg-slate-200 text-slate-400"
                      )}>
                         <Award className="w-8 h-8" />
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                         <span className={cn(
                           "text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full",
                           badge.category === 'TECHNICAL' ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                         )}>
                           {badge.category}
                         </span>
                      </div>

                      <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                        {badge.title}
                      </h3>
                      <p className="text-slate-500 font-medium text-xs leading-relaxed mb-6">
                        {badge.description}
                      </p>

                      {badge.unlocked && (
                        <div className="flex items-center gap-4">
                           <button className="p-2 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-colors">
                              <Download className="w-4 h-4" />
                           </button>
                           <button className="p-2 border border-slate-200 text-slate-400 rounded-xl hover:text-slate-900 transition-colors">
                              <Share2 className="w-4 h-4" />
                           </button>
                        </div>
                      )}
                   </div>

                   {badge.unlocked && (
                     <Sparkles className="absolute -bottom-4 -right-4 w-24 h-24 text-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                   )}
                </motion.div>
              ))}
          </div>
       </section>

       <section className="bg-slate-900 rounded-[4rem] p-12 text-white relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div className="space-y-8">
                <div>
                   <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-4">Certificado de Especialização</h2>
                   <p className="text-indigo-200 font-medium leading-relaxed max-w-md">
                     Você completou <strong className="text-white">85%</strong> da Unidade Curricular de "Programação em Sistemas Industriais". Faltam apenas 2 avaliações para o certificado digital.
                   </p>
                </div>
                <div className="flex gap-6">
                   <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-xl border border-white/10 flex-1">
                      <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2">Habilidades Técnicas</p>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-400 w-[92%]" />
                      </div>
                   </div>
                   <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-xl border border-white/10 flex-1">
                      <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2">Carga Horária</p>
                      <p className="text-2xl font-black italic">144/160 <span className="text-xs text-indigo-300">hrs</span></p>
                   </div>
                </div>
                <button className="flex items-center gap-3 bg-white text-slate-900 px-8 py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-2xl shadow-indigo-500/20">
                   <ShieldCheck className="w-5 h-5" /> Emitir Prévia de Certificado
                </button>
             </div>

             <div className="hidden lg:flex justify-center">
                <div className="relative">
                   <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                     className="absolute -inset-10 border-2 border-dashed border-indigo-500/30 rounded-full"
                   />
                   <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl rotate-3 relative group transition-transform hover:rotate-0">
                      <div className="border-4 border-slate-900 p-8 flex flex-col items-center text-center">
                         <GraduationCap className="w-12 h-12 text-slate-900 mb-6" />
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Diploma Provisório</p>
                         <h3 className="text-xl font-bold text-slate-900 mb-6 font-serif italic text-balance">Especialista em Robótica e IoT</h3>
                         <div className="w-12 h-0.5 bg-slate-900 mb-6" />
                         <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">INTELIGÊNCIA EDUCACIONAL INTERATIVA</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </section>
    </div>
  );
}
