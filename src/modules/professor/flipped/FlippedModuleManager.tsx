import React, { useState } from 'react';
import { 
  RotateCcw, 
  Plus, 
  Youtube, 
  FileText, 
  Link as LinkIcon, 
  CheckCircle2, 
  ArrowRight,
  MonitorPlay,
  ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FlippedModuleManager() {
  const [stages, setStages] = useState([
    { id: 1, type: 'VIDEO', title: 'Introdução ao Tema', status: 'READY' },
    { id: 2, type: 'QUIZ', title: 'Validação de Pré-requisitos', status: 'DRAFT' },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Aula Invertida</h1>
          <p className="text-slate-500 font-medium">Prepare materiais pré-aula e valide o conhecimento prévio dos alunos.</p>
        </div>
        <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-3 shadow-lg shadow-indigo-100">
          <Plus size={18} /> Novo Módulo Pré-Aula
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            {stages.map((stage, i) => (
              <div key={stage.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:border-indigo-200 transition-all">
                 <div className="w-16 h-16 rounded-3xl bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-all">
                    {stage.type === 'VIDEO' ? <MonitorPlay size={24} /> : <ClipboardList size={24} />}
                 </div>
                 <div className="flex-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Etapa {i + 1}</span>
                    <h3 className="text-xl font-bold text-slate-900">{stage.title}</h3>
                 </div>
                 <div className="flex items-center gap-4">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${stage.status === 'READY' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                       {stage.status}
                    </span>
                    <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors">
                       <ArrowRight size={18} />
                    </button>
                 </div>
              </div>
            ))}

            <button className="w-full py-8 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-slate-400 font-black uppercase text-xs tracking-widest hover:border-indigo-300 hover:text-indigo-600 transition-all flex flex-col items-center gap-3">
               <Plus size={24} /> Adicionar Etapa Adicional
            </button>
         </div>

         <div className="space-y-6">
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl">
               <RotateCcw className="text-indigo-400 mb-6" size={32} />
               <h3 className="text-xl font-black uppercase tracking-tight mb-4">Fluxo de Inversão</h3>
               <div className="space-y-6">
                  <div className="flex gap-4">
                     <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black shrink-0">1</div>
                     <div>
                        <p className="text-sm font-bold">Consumo Prévia</p>
                        <p className="text-xs text-white/50">Aluno assiste/lê o material em casa.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black shrink-0">2</div>
                     <div>
                        <p className="text-sm font-bold">Validação de Gate</p>
                        <p className="text-xs text-white/50">Avaliação rápida para liberar a aula prática.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black shrink-0">3</div>
                     <div>
                        <p className="text-sm font-bold">Aplicação Ativa</p>
                        <p className="text-xs text-white/50">O tempo de aula é usado para Laboratórios e Casos.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
