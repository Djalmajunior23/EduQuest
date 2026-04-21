import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { saService, LearningSituation } from '../../../services/saService';
import { useAuth } from '../../../lib/AuthContext';
import { 
  Save, 
  Sparkles, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  CheckCircle,
  HelpCircle,
  Wand2,
  ListTodo,
  Library,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../../lib/utils';

export default function SAEditor() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isIAMode = searchParams.get('ia') === 'true';
  const { profile } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showIAPrompt, setShowIAPrompt] = useState(isIAMode && !id);
  const [iaPrompt, setIAPrompt] = useState('');
  
  const [sa, setSA] = useState<Partial<LearningSituation>>({
    titulo: '',
    contexto: '',
    problema_desafio: '',
    objetivo_geral: '',
    objetivos_especificos: [],
    entregas: [],
    criterios_avaliacao: [],
    evidencias: [],
    ucId: '',
    conhecimentoTecnicoIds: [],
    capacidadeTecnicaIds: [],
    recursos_necessarios: [],
    cronograma: '',
    orientacoes_aluno: '',
    orientacoes_professor: '',
    status: 'DRAFT',
    isTemplate: false
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      saService.getSA(id).then(data => {
        if (data) setSA(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (id) {
        await saService.updateSA(id, sa);
      } else {
        await saService.createSA({ ...sa, createdBy: profile.uid } as any);
      }
      navigate('/sa');
    } catch (error) {
      console.error("Erro ao salvar SA:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleIAGenerate = async () => {
    setLoading(true);
    setShowIAPrompt(false);
    try {
      const generated = await saService.generateSAWithIA(iaPrompt);
      setSA(prev => ({ ...prev, ...generated }));
    } catch (error: any) {
      alert(error.message);
      setShowIAPrompt(true);
    } finally {
      setLoading(false);
    }
  };

  const addArrayItem = (key: keyof LearningSituation) => {
    setSA(prev => ({
      ...prev,
      [key]: [...(prev[key] as any[]), typeof (prev[key] as any[])[0] === 'object' ? {} : '']
    }));
  };

  const updateArrayItem = (key: keyof LearningSituation, index: number, value: any) => {
    const newArr = [...(sa[key] as any[])];
    newArr[index] = value;
    setSA(prev => ({ ...prev, [key]: newArr }));
  };

  const removeArrayItem = (key: keyof LearningSituation, index: number) => {
    setSA(prev => ({ ...prev, [key]: (prev[key] as any[]).filter((_, i) => i !== index) }));
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] relative overflow-hidden">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-64 h-64 border-[1px] border-indigo-600/20 rounded-full border-dashed absolute"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="w-96 h-96 border-[1px] border-blue-600/10 rounded-full absolute"
        />
        <motion.div 
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="relative z-10 flex flex-col items-center bg-white/50 backdrop-blur-xl p-12 rounded-[3rem] border border-slate-100 shadow-2xl"
        >
            <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2rem] flex items-center justify-center shadow-lg shadow-indigo-600/20 mb-8 animate-pulse">
               <Wand2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 mb-2">Engenharia Pedagógica Ativa</h2>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] animate-pulse">Sintetizando Conhecimento Tecnológico...</p>
        </motion.div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-10 space-y-12">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-6">
           <button onClick={() => navigate('/sa')} className="p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
              <ChevronLeft className="w-6 h-6 text-slate-400" />
           </button>
           <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
                {id ? 'Refinando Estratégia' : 'Nova Situation-A'}
              </h1>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">
                {id ? 'Editando módulo pedagógico' : 'Construindo novo desafio técnico'}
              </p>
           </div>
        </div>
        <div className="flex gap-4">
          <button 
            disabled={saving}
            onClick={() => setShowIAPrompt(true)}
            className="flex items-center gap-2 px-6 py-4 bg-blue-50 text-blue-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-100 transition-all"
          >
            <Wand2 className="w-5 h-5" />
            IA Assistant
          </button>
          <button 
            disabled={saving}
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-slate-200"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Codificando...' : 'Salvar SA'}
          </button>
        </div>
      </header>

      {/* IA Prompt Modal */}
      <AnimatePresence>
        {showIAPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white max-w-2xl w-full rounded-[3rem] p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none">
                 <Sparkles className="w-40 h-40" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">Gerar SA Inteligente</h2>
              <p className="text-slate-500 font-medium mb-8">Descreva o desafio que você quer propor aos alunos. A IA cuidará de estruturar todo o contexto e critérios técnicos.</p>
              
              <textarea 
                value={iaPrompt}
                onChange={(e) => setIAPrompt(e.target.value)}
                placeholder="Ex: Crie uma SA sobre desenvolvimento de um sistema de controle de estoque para uma padaria usando React e Firebase..."
                className="w-full h-40 p-6 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900 mb-8"
              />

              <div className="flex gap-4">
                 <button 
                  onClick={() => setShowIAPrompt(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all"
                 >
                   Manual
                 </button>
                 <button 
                  onClick={handleIAGenerate}
                  className="flex-[2] py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:from-blue-500 hover:to-indigo-500 transition-all shadow-xl shadow-blue-200"
                 >
                   Gerar com IA
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Editor Section */}
        <div className="lg:col-span-2 space-y-12">
          {/* Sessão 1: Identificação */}
          <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-4 mb-4">
               <div className="p-3 bg-blue-600 rounded-2xl text-white">
                  <Library className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-black uppercase italic tracking-tighter">Estrutura Base</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Título da SA</label>
                <input 
                  type="text" 
                  value={sa.titulo}
                  onChange={(e) => setSA(prev => ({ ...prev, titulo: e.target.value }))}
                  className="w-full p-6 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-black text-xl text-slate-900"
                  placeholder="Nome do desafio épico..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Unidade Curricular (UC)</label>
                <select 
                  value={sa.ucId}
                  onChange={(e) => setSA(prev => ({ ...prev, ucId: e.target.value }))}
                  className="w-full p-6 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-900"
                >
                  <option value="">Selecione a UC...</option>
                  <option value="web_dev">Desenvolvimento de Sistemas Web</option>
                  <option value="db_logic">Lógica de Programação e Banco de Dados</option>
                </select>
              </div>
            </div>
          </section>

          {/* Sessão 2: Contexto & Desafio */}
          <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-4 mb-4">
               <div className="p-3 bg-amber-600 rounded-2xl text-white">
                  <Sparkles className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-black uppercase italic tracking-tighter">A Jornada (Contexto e Problema)</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Contexto da Situação</label>
                <textarea 
                  value={sa.contexto}
                  onChange={(e) => setSA(prev => ({ ...prev, contexto: e.target.value }))}
                  className="w-full p-6 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900 min-h-[150px]"
                  placeholder="Descreva o cenário onde o desafio ocorre..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">O Grande Desafio (Problema)</label>
                <textarea 
                  value={sa.problema_desafio}
                  onChange={(e) => setSA(prev => ({ ...prev, problema_desafio: e.target.value }))}
                  className="w-full p-6 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900 min-h-[150px]"
                  placeholder="Qual o problema técnico que os alunos devem resolver?"
                />
              </div>
            </div>
          </section>

          {/* Sessão 3: Objetivos e Entregas */}
          <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-4 mb-4">
               <div className="p-3 bg-emerald-600 rounded-2xl text-white">
                  <CheckCircle className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-black uppercase italic tracking-tighter">Objetivos e Entregáveis</h3>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Objetivo Geral</label>
                <input 
                  type="text" 
                  value={sa.objetivo_geral}
                  onChange={(e) => setSA(prev => ({ ...prev, objetivo_geral: e.target.value }))}
                  className="w-full p-6 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-900"
                />
              </div>

              <div>
                 <div className="flex justify-between items-center mb-4">
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Objetivos Específicos</label>
                    <button onClick={() => addArrayItem('objetivos_especificos')} className="p-2 bg-slate-100 rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white transition-all"><Plus className="w-4 h-4" /></button>
                 </div>
                 <div className="space-y-4">
                    {sa.objetivos_especificos?.map((obj, i) => (
                      <div key={i} className="flex gap-4">
                         <input 
                           type="text" 
                           value={obj}
                           onChange={(e) => updateArrayItem('objetivos_especificos', i, e.target.value)}
                           className="flex-1 p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                         />
                         <button onClick={() => removeArrayItem('objetivos_especificos', i)} className="p-4 text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Settings Section */}
        <aside className="space-y-8">
           <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-8">
              <h3 className="text-lg font-black uppercase italic tracking-tighter flex items-center gap-3">
                 <Target className="w-6 h-6 text-indigo-400" />
                 Configurações
              </h3>

              <div className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Status da SA</label>
                    <div className="grid grid-cols-2 gap-2">
                       {['DRAFT', 'PUBLISHED'].map(status => (
                         <button 
                           key={status}
                           onClick={() => setSA(prev => ({ ...prev, status: status as any }))}
                           className={cn(
                             "py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all",
                             sa.status === status ? "bg-indigo-600 border-indigo-500 text-white" : "bg-slate-800 border-slate-700 text-slate-400"
                           )}
                         >
                           {status === 'DRAFT' ? 'Rascunho' : 'Publicada'}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div>
                   <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2 italic">Opções Avançadas</label>
                   <div className="space-y-4">
                      <label className="flex items-center gap-4 cursor-pointer group">
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={sa.isTemplate}
                            onChange={(e) => setSA(prev => ({ ...prev, isTemplate: e.target.checked }))} 
                          />
                          <div className="w-14 h-8 bg-slate-800 rounded-full peer peer-checked:bg-indigo-600 transition-all after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-6" />
                        </div>
                        <span className="text-sm font-bold text-slate-300">Salvar como Modelo</span>
                      </label>
                   </div>
                 </div>
              </div>
           </section>

           <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white group cursor-pointer hover:bg-blue-700 transition-all">
              <Sparkles className="w-8 h-8 mb-4 group-hover:rotate-12 transition-transform" />
              <h3 className="font-black text-xl italic uppercase tracking-tighter mb-2">Dica da IA</h3>
              <p className="text-blue-100 text-sm font-bold leading-tight">Use a ferramenta de IA para gerar rubricas automáticas baseadas nos critérios de avaliação definidos.</p>
           </div>
        </aside>
      </div>
    </div>
  );
}
