import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Brain, Sparkles, Loader2, Target, Users, BookOpen } from 'lucide-react';
import { aiService } from '../../services/aiService';
import Markdown from 'react-markdown';
import { cn } from '../../lib/utils';
import { useAuth } from '../../lib/AuthContext';

export function ProfessorSAPlanner() {
  const { profile } = useAuth();
  const [tema, setTema] = useState('');
  const [contexto, setContexto] = useState('');
  const [curso, setCurso] = useState('Técnico em Desenvolvimento de Sistemas');

  const saExamples = [
      { id: '1', icon: BookOpen, titulo: "API E-commerce", tipo: 'Back-end', tema: "API REST em Node.js", contexto: "Alunos iniciantes em Back-end, foco em rotas de produtos.", curso: "Técnico em Desenvolvimento de Sistemas" },
      { id: '2', icon: Target, titulo: "Dashboard Dados", tipo: 'Front-end', tema: "Visualização com D3.js", contexto: "Turma de Front-end, nível intermediário.", curso: "Informática para Internet" },
      { id: '3', icon: Users, titulo: "Firewall Linux", tipo: 'Redes', tema: "Regras iptables", contexto: "Introdução à segurança de redes.", curso: "Técnico em Cibersegurança" },
      { id: '4', icon: Sparkles, titulo: "Chatbot IA", tipo: 'Inteligência', tema: "Integração LLM", contexto: "Projeto integrador de final de curso.", curso: "Técnico em Desenvolvimento de Sistemas" },
   ];

  const [activeExampleId, setActiveExampleId] = useState<string | null>(null);

  const loadExample = (ex: any) => {
     setActiveExampleId(ex.id);
     setTema(ex.tema);
     setContexto(ex.contexto);
     setCurso(ex.curso);
   };
  
  const [loading, setLoading] = useState(false);
  const [generatedSA, setGeneratedSA] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!tema) return alert('Por favor, informe o Tema da Situação de Aprendizagem.');
    
    setLoading(true);
    setError('');
    
    try {
       const prompt = `Você é um Especialista em Gamificação Educacional Sênior e Estruturador Pedagógico no sistema NEXUSINTAI.
Aja como o 'Assistente IA' do Professor.
Contexto do Aluno Alvo: Adolescentes e jovens aprendendo tecnologia.

Quero que gere uma Situação de Aprendizagem (Projeto Prático / Desafio) completa.
Curso Alvo: ${curso}
Tema Específico: ${tema}
Contexto do que eles já sabem ou do cenário: ${contexto || 'Alunos iniciantes'}

A estrutura de sua resposta em Markdown DEVE conter:
# 🎯 [Nome Épico da Missão]
**Resumo:** O que eles deverão fazer em 1 parágrafo motivador como se fosse um RPG Tech.
### 🛠️ Competências Trabalhadas
- ...
### 📦 Entregáveis Mínimos
- ...
### 🚀 Etapas do Projeto
1. ...
### 📊 Rubrica de Avaliação Simplificada
- ...
`;
       // Usando o SDK Gemni (Flash ou Pro) dependendo da implementação em aiService
       const responseText = await aiService.generateText(prompt);
       setGeneratedSA(responseText);
    } catch (err: any) {
       console.error("Erro ao gerar IA:", err);
       setError(err.message || "Não foi possível gerar no momento. Tente novamente.");
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
         <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 flex items-center gap-2">
            <Brain className="w-8 h-8 text-indigo-600" />
            NEXUS<span className="text-indigo-600">INTAI</span> Planner
         </h1>
         <p className="text-slate-500 font-medium">Geração Inteligente de Situações de Aprendizagem (SA)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
               <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-[10px] mb-6">
                 <Target className="w-4 h-4" /> Configurar Missão
               </div>

               <div className="space-y-4">
                 <div>
                   <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest pl-2 mb-1">Curso</label>
                   <select 
                     value={curso} onChange={e => setCurso(e.target.value)}
                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                   >
                     <option>Técnico em Desenvolvimento de Sistemas</option>
                     <option>Informática para Internet</option>
                     <option>Técnico em Cibersegurança</option>
                     <option>Aperfeiçoamento em Linux</option>
                   </select>
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest pl-2 mb-1">Tema da Missão (SA)</label>
                   <input 
                     type="text" 
                     placeholder="Ex: Criar uma API para gerenciamento de biblioteca..."
                     value={tema} onChange={e => setTema(e.target.value)}
                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                   />
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest pl-2 mb-1">Contexto / Nível da Turma</label>
                   <textarea 
                     rows={3}
                     placeholder="Ex: Eles aprenderam Node.js e Express ontem. Precisam focar em rotas GET e POST."
                     value={contexto} onChange={e => setContexto(e.target.value)}
                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                   />
                 </div>

                <button
                   onClick={handleGenerate}
                   disabled={loading || !tema}
                   className={cn(
                     "w-full mt-4 flex items-center justify-center gap-2 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-indigo-200",
                     loading || !tema ? "bg-slate-300 text-slate-500 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700"
                   )}
                 >
                   {loading ? (
                     <><Loader2 className="w-5 h-5 animate-spin" /> Processando Motor IA...</>
                   ) : (
                     <><Sparkles className="w-5 h-5" /> Gerar Situação (SA)</>
                   )}
                 </button>

                 <div className="mt-8 space-y-3">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest pl-2">Exemplos de SA Geradas</label>
                    {saExamples.map((ex) => {
                      const Icon = ex.icon;
                      return (
                      <button 
                         key={ex.id}
                         onClick={() => loadExample(ex)}
                         className={cn(
                           "w-full text-left p-4 rounded-xl border transition-all group flex items-start gap-4",
                           activeExampleId === ex.id 
                            ? "bg-indigo-50 border-indigo-200"
                            : "bg-slate-50 border-slate-200 hover:border-indigo-300"
                         )}
                      >
                         <div className={cn("p-2 rounded-lg", activeExampleId === ex.id ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600")}>
                           <Icon className="w-5 h-5" />
                         </div>
                         <div className="flex-1">
                           <p className="text-xs font-black text-slate-900 group-hover:text-indigo-600">{ex.titulo}</p>
                           <p className="text-[10px] text-slate-500 mt-0.5">{ex.tipo}</p>
                         </div>
                      </button>
                    )})}
                 </div>

                 <div className="mt-4 p-4 rounded-xl bg-orange-50 border border-orange-100 flex items-start gap-3">
                    <span className="text-xl">⚠️</span>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-orange-800 leading-relaxed">
                       O NEXUSINTAI Planner consome Tokens do plano institucional. Verifique e edite a SA gerada de acordo com as diretrizes da escola.
                    </p>
                 </div>
               </div>
            </div>
         </div>

         <div className="lg:col-span-2">
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 min-h-[600px]">
               {error && (
                 <div className="text-red-500 font-medium bg-red-50 p-4 rounded-xl border border-red-200">
                   {error}
                 </div>
               )}

               {!generatedSA && !loading && !error && (
                 <div className="h-full flex flex-col items-center justify-center text-slate-400 p-12 text-center opacity-50">
                    <Brain className="w-24 h-24 mb-6 text-slate-200" />
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-300">Pronto para Gerar</h2>
                    <p className="font-medium max-w-sm mt-2">Preencha os dados e peça para a IA construir uma missão para seus alunos.</p>
                 </div>
               )}

               {loading ? (
                 <div className="h-full flex flex-col items-center justify-center text-indigo-500 p-12 text-center animate-pulse">
                    <Brain className="w-24 h-24 mb-6" />
                    <h2 className="text-xl font-black italic uppercase tracking-tighter">O Motor está pensando...</h2>
                 </div>
               ) : (
                 generatedSA && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="prose prose-indigo max-w-none prose-h1:text-3xl prose-h1:font-black prose-h1:italic prose-h1:uppercase prose-h1:tracking-tighter prose-h3:uppercase prose-h3:tracking-widest prose-h3:text-xs prose-h3:font-black prose-h3:text-indigo-500"
                   >
                     <Markdown>{generatedSA}</Markdown>
                   </motion.div>
                 )
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
