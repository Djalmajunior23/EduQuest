import React, { useState, useEffect } from 'react';
import { 
  Dices, 
  Plus, 
  Sparkles, 
  Loader2, 
  Play, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  BrainCircuit,
  MessageSquare,
  ShieldCheck,
  Terminal,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { simulationService, Simulation } from '../../../services/simulationService';
import { useAuth } from '../../../lib/AuthContext';
import { AIService } from '../../../services/aiService';

export default function SimulationManager() {
  const { profile } = useAuth();
  const [sims, setSims] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [simType, setSimType] = useState<Simulation['tipo']>('LOGICA');

  useEffect(() => {
    if (profile?.tenantId) {
      loadSims();
    }
  }, [profile]);

  const loadSims = async () => {
    try {
      const data = await simulationService.listSimulations(profile!.tenantId);
      setSims(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!topic || aiLoading) return;
    setAiLoading(true);
    try {
      const generated = await simulationService.generateWithIA(topic, simType);
      if (generated && profile) {
        await simulationService.createSimulation({
          tenantId: profile.tenantId,
          titulo: generated.titulo!,
          tipo: simType,
          cenario: generated.cenario!,
          etapas: generated.etapas!,
          createdBy: profile.uid
        });
        setIsCreating(false);
        setTopic('');
        loadSims();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const typeIcons: any = {
    LOGICA: <BrainCircuit className="w-5 h-5" />,
    CODIGO: <Terminal className="w-5 h-5" />,
    DB: <Database className="w-5 h-5" />,
    REDES: <ShieldCheck className="w-5 h-5" />,
    DECISAO: <MessageSquare className="w-5 h-5" />
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Simuladores</h1>
          <p className="text-slate-500 font-medium">Crie cenários interativos de decisão e raciocínio técnico.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-3 shadow-lg shadow-indigo-100"
        >
          <Plus size={18} /> Novo Simulador
        </button>
      </header>

      {loading ? (
        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {sims.map((sim, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={sim.id}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  {React.cloneElement(typeIcons[sim.tipo], { size: 80 })}
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                    {typeIcons[sim.tipo]}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{sim.tipo}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{sim.titulo}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-8 leading-relaxed">
                  {sim.cenario}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    {sim.etapas.length} Etapas
                  </div>
                  <button className="flex items-center gap-2 text-xs font-black uppercase text-indigo-600 hover:gap-3 transition-all">
                    Visualizar <Play size={12} fill="currentColor" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Generation Modal */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[3rem] p-12 max-w-xl w-full shadow-2xl"
            >
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">Orquestrador de Simuladores</h2>
              <p className="text-slate-500 mb-8 font-medium">Descreva o desafio e a IA criará o roteiro de decisões.</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Tipo do Simulador</label>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.keys(typeIcons).map(t => (
                      <button 
                        key={t}
                        onClick={() => setSimType(t as any)}
                        className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${simType === t ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400'}`}
                      >
                        {typeIcons[t]}
                        <span className="text-[10px] font-black">{t}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Tema ou Problema</label>
                  <textarea 
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="Ex: Debugar uma API Node.js que está estourando latência em picos de acesso."
                    className="w-full p-5 bg-slate-50 border-none rounded-3xl text-sm font-semibold text-slate-900 focus:ring-4 focus:ring-indigo-100 transition-all h-32 resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setIsCreating(false)}
                    className="flex-1 py-4 rounded-2xl font-black uppercase text-xs tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleGenerate}
                    disabled={!topic || aiLoading}
                    className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {aiLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles size={16} />}
                    Gerar com IA
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
