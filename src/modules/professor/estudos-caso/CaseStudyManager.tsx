import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Sparkles, 
  Loader2, 
  FileText, 
  Target,
  ArrowRight,
  ClipboardCheck,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { caseStudyService, CaseStudy } from '../../../services/caseStudyService';
import { useAuth } from '../../../lib/AuthContext';

export default function CaseStudyManager() {
  const { profile, user } = useAuth();
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [topic, setTopic] = useState('');

  useEffect(() => {
    if (profile?.tenantId) {
      loadCases();
    }
  }, [profile]);

  const loadCases = async () => {
    try {
      const data = await caseStudyService.listCaseStudies(profile!.tenantId);
      setCases(data);
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
      const generated = await caseStudyService.generateWithIA(topic);
      if (generated && user && profile) {
        await caseStudyService.createCaseStudy({
          tenantId: profile.tenantId,
          titulo: generated.titulo!,
          descricao: generated.descricao!,
          cenario: generated.cenario!,
          questoesDiscursivas: generated.questoesDiscursivas!,
          createdBy: user.id
        });
        setIsCreating(false);
        setTopic('');
        loadCases();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Estudos de Caso</h1>
          <p className="text-slate-500 font-medium">Aplique a Aprendizagem Baseada em Problemas (PBL) com cenários reais.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all flex items-center gap-3 shadow-xl shadow-slate-200"
        >
          <Plus size={18} /> Novo Caso PBL
        </button>
      </header>

      {loading ? (
        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence>
            {cases.map((cs, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={cs.id}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-8 items-start group"
              >
                <div className="w-16 h-16 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <BookOpen size={28} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">PBL</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Criado em {new Date(cs.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{cs.titulo}</h3>
                  <p className="text-slate-500 mb-6 line-clamp-2 leading-relaxed max-w-3xl font-medium">{cs.descricao}</p>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <Target size={14} className="text-indigo-500" /> {cs.questoesDiscursivas?.length} Desafios
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <ClipboardCheck size={14} className="text-emerald-500" /> Rubricas Geradas
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0 md:justify-center h-full">
                  <button className="px-6 py-3 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                    Editar Caso
                  </button>
                  <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100">
                    Atribuir <ArrowRight size={14} />
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
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Gerador de Estudos de Caso</h2>
                    <p className="text-slate-500 font-medium">Defina o tema e a IA criará um cenário de problema real.</p>
                 </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Tema ou Domínio Técnico</label>
                  <div className="relative">
                    <Search className="absolute left-5 top-5 text-slate-400" size={18} />
                    <input 
                      type="text"
                      value={topic}
                      onChange={e => setTopic(e.target.value)}
                      placeholder="Ex: Arquitetura de Microserviços e Escalabilidade"
                      className="w-full p-5 pl-14 bg-slate-50 border-none rounded-3xl text-sm font-semibold text-slate-900 focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                  <div className="flex gap-3 text-indigo-800 mb-2">
                    <Sparkles size={18} className="shrink-0" />
                    <p className="text-xs font-bold uppercase tracking-wider">Metodologia PBL Ativa</p>
                  </div>
                  <p className="text-xs text-indigo-600/80 leading-relaxed font-medium">
                    A IA gerará um contexto narrativo, especificações técnicas falhas que o aluno deve identificar e propostas de solução com critérios de avaliação por rubrica.
                  </p>
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
                    {aiLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Plus size={16} />}
                    Gerar Estudo de Caso
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
