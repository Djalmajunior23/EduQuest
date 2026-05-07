import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useParams } from 'react-router-dom';
import { laboratorioService, Laboratorio } from '../../../services/laboratorioService';
import { AIService } from '../../../services/aiService';
import { useAuth } from '../../../lib/AuthContext';
import { useTenant } from '../../../lib/TenantContext';
import { Save, Sparkles, ChevronLeft, Loader2, FlaskConical, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../../lib/utils';
import { Type } from '@google/genai';

export default function LabEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { tenant } = useTenant();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showIAPrompt, setShowIAPrompt] = useState(!id);
  const [iaPrompt, setIAPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [lab, setLab] = useState<Partial<Laboratorio>>({
    titulo: '',
    versaoProfessor: '',
    versaoAluno: '',
    status: 'DRAFT',
    tenantId: tenant?.id
  });

  useEffect(() => {
    if (id && tenant?.id) {
      setLoading(true);
      laboratorioService.getLaboratorios(tenant.id).then((data: Laboratorio[]) => {
        const found = data.find((l: Laboratorio) => l.id === id);
        if (found) setLab(found);
        setLoading(false);
      });
    }
  }, [id, tenant]);

  const handleSave = async () => {
    if (!tenant?.id) return;
    setSaving(true);
    try {
      if (id) {
        await laboratorioService.updateLaboratorio(id, lab);
      } else {
        await laboratorioService.createLaboratorio({ ...lab, tenantId: tenant.id } as Laboratorio);
      }
      navigate('/professor/laboratorios');
    } catch (error) {
      console.error("Erro ao salvar Laboratório:", error);
      alert("Falha ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const handleIAGenerate = async () => {
    setIsGenerating(true);
    setShowIAPrompt(false);
    try {
      const fullPrompt = `Crie um laboratório prático escolar completo baseado em: "${iaPrompt}".
      A estrutura deve obrigatoriamente conter:
      1. Objetivos de Aprendizagem (focados em habilidades técnicas)
      2. Contexto do Cenário (RPG Tech ou Situação Real)
      3. Problema a ser resolvido
      4. Etapas de Execução (para o aluno)
      5. Rubrica de Avaliação (critérios claros)
      
      Gere duas seções: 
      - Versão do Aluno (instruções práticas)
      - Versão do Professor (gabarito, dicas de mediação e rubrica)
      `;

      const schema = {
         type: Type.OBJECT,
         properties: {
            titulo: { type: Type.STRING },
            versaoAluno: { type: Type.STRING, description: "Instruções do laboratório para o aluno, incluindo Objetivos, Contexto, Problema e Etapas. Use Markdown." },
            versaoProfessor: { type: Type.STRING, description: "Gabarito ou notas completas para o professor, incluindo Rubrica de Avaliação. Use Markdown." }
         }
      };

      const generated = await AIService.generateJSON<{ titulo: string, versaoAluno: string, versaoProfessor: string }>(
         fullPrompt, schema, 'PREMIUM'
      );
      
      setLab((prev: any) => ({ 
         ...prev, 
         titulo: generated.titulo, 
         versaoAluno: generated.versaoAluno, 
         versaoProfessor: generated.versaoProfessor 
      }));
    } catch (error: any) {
      alert(error.message);
      setShowIAPrompt(true);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) return (
     <div className="flex justify-center p-20 text-indigo-500">
         <Loader2 className="w-10 h-10 animate-spin" />
     </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
           <button onClick={() => navigate('/professor/laboratorios')} className="p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
              <ChevronLeft className="w-6 h-6 text-slate-400" />
           </button>
           <div>
              <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-indigo-500 mb-1">
                 <FlaskConical className="w-3 h-3" />
                 Laboratório Científico
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                {id ? 'Refinando Experimento' : 'Novo Experimento'}
              </h1>
           </div>
        </div>
        <div className="flex gap-4">
          <button 
             onClick={() => setShowIAPrompt(true)}
             className="px-6 py-4 bg-blue-50 text-blue-600 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-blue-100 transition-colors"
          >
             <Sparkles className="w-4 h-4" /> IA Generation
          </button>
          <button 
            disabled={saving}
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-slate-200"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? 'Publicando...' : 'Salvar Experimento'}
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
                 <FlaskConical className="w-40 h-40" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">Gerar Laboratório</h2>
              <p className="text-slate-500 font-medium mb-8">Descreva qual máquina, configuração ou código os alunos irão usar na prática.</p>
              
              <textarea 
                value={iaPrompt}
                onChange={(e) => setIAPrompt(e.target.value)}
                placeholder="Ex: Laboratório prático onde o aluno deve configurar uma VPN usando Wireguard em 3 máquinas virtuais Linux..."
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
                  disabled={!iaPrompt.trim()}
                  className="flex-[2] py-4 bg-gradient-to-r from-emerald-500 to-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:from-emerald-400 hover:to-indigo-500 transition-all shadow-xl shadow-emerald-200"
                 >
                   Sintetizar Lab Mágico
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      {isGenerating && (
          <div className="flex flex-col items-center justify-center py-20 relative overflow-hidden bg-white rounded-[3rem] border border-slate-100 shadow-sm mt-8">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-64 h-64 border-[1px] border-emerald-600/20 rounded-full border-dashed absolute"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="w-96 h-96 border-[1px] border-indigo-600/10 rounded-full absolute"
              />
              <motion.div 
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="relative z-10 flex flex-col items-center p-12"
              >
                  <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-indigo-600 rounded-[2rem] flex items-center justify-center shadow-lg shadow-emerald-600/20 mb-8 animate-pulse">
                     <FlaskConical className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 mb-2">Engenharia Acadêmica</h2>
                  <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] animate-pulse">Instanciando Máquinas Lógicas...</p>
              </motion.div>
          </div>
      )}

      {/* Main Form */}
      {!isGenerating && (
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
             <div className="mb-6">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Título do Laboratório</label>
                <input 
                   value={lab.titulo}
                   onChange={e => setLab((p) => ({ ...p, titulo: e.target.value }))}
                   placeholder="Ex: Deploy de Kubernetes em Bare-Metal"
                   className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-black text-xl text-slate-900 border-none focus:ring-4 focus:ring-slate-100 transition-all outline-none"
                />
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                 <div className="space-y-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-slate-600 w-max">
                        <Layout className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Visão do Aluno / Instruções</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <textarea 
                          value={lab.versaoAluno}
                          onChange={e => setLab((p) => ({ ...p, versaoAluno: e.target.value }))}
                          placeholder="MarkDown das instruções para o aluno..."
                          className="w-full h-[500px] bg-slate-50 p-6 rounded-[2rem] resize-none font-medium text-slate-700 outline-none focus:ring-4 focus:ring-slate-100 disabled:opacity-50"
                       />
                       <div className="w-full h-[500px] bg-white p-6 rounded-[2rem] border border-slate-100 overflow-y-auto prose prose-slate">
                           <ReactMarkdown>{lab.versaoAluno || '*Preview da Visão do Aluno...*'}</ReactMarkdown>
                       </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl w-max">
                        <Save className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Gabarito do Professor</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <textarea 
                          value={lab.versaoProfessor}
                          onChange={e => setLab((p) => ({ ...p, versaoProfessor: e.target.value }))}
                          placeholder="Notas e gabarito exclusivo do docente..."
                          className="w-full h-[500px] bg-indigo-50/50 p-6 rounded-[2rem] resize-none font-medium text-indigo-900 outline-none focus:ring-4 focus:ring-indigo-50 disabled:opacity-50"
                       />
                       <div className="w-full h-[500px] bg-white p-6 rounded-[2rem] border border-indigo-100 overflow-y-auto prose prose-indigo">
                           <ReactMarkdown>{lab.versaoProfessor || '*Preview do Gabarito...*'}</ReactMarkdown>
                       </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
