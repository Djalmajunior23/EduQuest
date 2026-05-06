import React from 'react';
import { motion } from 'motion/react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="relative w-24 h-24 mb-8">
          {/* Main Logo Sphere */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 90, 0] 
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-indigo-600 rounded-[2rem] shadow-2xl shadow-indigo-200"
          />
          
          {/* Orbital Ring 1 */}
          <motion.div
            animate={{ 
              rotate: [0, 360],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-10px] border-2 border-indigo-100 rounded-[2.5rem] border-t-indigo-400"
          />
          
          {/* Orbital Ring 2 */}
          <motion.div
            animate={{ 
              rotate: [360, 0],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-20px] border-2 border-slate-50 rounded-[3rem] border-r-indigo-200"
          />
        </div>

        <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
          EduQuest <span className="text-indigo-600">Hub</span>
        </h1>
        
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 h-1.5 bg-indigo-400 rounded-full"
            />
          ))}
        </div>
      </motion.div>
      
      <div className="absolute bottom-12 text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">
        Preparando seu ambiente
      </div>
    </div>
  );
}
