import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Sparkles, Rocket, Zap, Award } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import confetti from 'canvas-confetti';

export default function LevelUpCelebration() {
  const { profile } = useAuth();
  const [show, setShow] = useState(false);
  const [lastLevel, setLastLevel] = useState<number | null>(null);

  useEffect(() => {
    if (profile?.xp !== undefined) {
      const currentLevel = Math.floor((profile.xp || 0) / 1000) + 1;
      
      if (lastLevel !== null && currentLevel > lastLevel) {
        setShow(true);
        triggerConfetti();
        // Auto-close after 6 seconds
        setTimeout(() => setShow(false), 6000);
      }
      
      setLastLevel(currentLevel);
    }
  }, [profile?.xp, lastLevel]);

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#6366f1', '#a855f7', '#fbbf24']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#6366f1', '#a855f7', '#fbbf24']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 1.5, opacity: 0, filter: 'blur(10px)' }}
            className="relative max-w-lg w-full bg-slate-900 border-4 border-indigo-500 rounded-[3rem] p-12 text-center shadow-[0_0_100px_rgba(99,102,241,0.4)] overflow-hidden"
          >
            {/* Background elements */}
            <div className="absolute inset-0 opacity-10">
               <Zap className="absolute top-10 left-10 w-20 h-20 text-indigo-400 rotate-12" />
               <Sparkles className="absolute bottom-10 right-10 w-24 h-24 text-amber-400 -rotate-12" />
               <Rocket className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 text-white opacity-5" />
            </div>

            <div className="relative z-10 space-y-8">
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', bounce: 0.6 }}
                className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl relative"
              >
                <Trophy className="w-16 h-16 text-white" />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-4 -right-4 bg-amber-500 p-3 rounded-2xl shadow-xl"
                >
                  <Star className="w-6 h-6 text-slate-950 fill-current" />
                </motion.div>
              </motion.div>

              <div>
                <motion.h2 
                  initial={{ letterSpacing: '0.2em', opacity: 0 }}
                  animate={{ letterSpacing: '0.05em', opacity: 1 }}
                  className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter"
                >
                  Evolução Detectada!
                </motion.h2>
                <p className="text-indigo-400 font-bold text-lg tracking-widest mt-2">Você atingiu o Nível {lastLevel}</p>
              </div>

              <div className="flex justify-center gap-6">
                <div className="flex flex-col items-center">
                   <div className="p-4 bg-slate-800 rounded-2xl mb-2 text-indigo-400 border border-indigo-500/30">
                      <Zap className="w-8 h-8" />
                   </div>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">+15 TOKENS IA</span>
                </div>
                <div className="flex flex-col items-center">
                   <div className="p-4 bg-slate-800 rounded-2xl mb-2 text-amber-400 border border-amber-500/30">
                      <Award className="w-8 h-8" />
                   </div>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">RANK UP</span>
                </div>
              </div>

              <button
                onClick={() => setShow(false)}
                className="w-full py-5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-black text-xl uppercase tracking-widest rounded-2xl transition-all shadow-[0_10px_40px_rgba(79,70,229,0.4)] active:scale-95"
              >
                Confirmar Upload
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
