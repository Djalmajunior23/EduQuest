import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Sparkles, X, Loader2, Save, Trash2, Edit2, Search, Filter } from 'lucide-react';

interface Question {
  id?: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  bloomTaxonomy: string;
  difficulty: string;
  ucId: string;
  tags?: string[];
}

export default function QuestionBank() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterBloom, setFilterBloom] = useState('');
  const [filterTag, setFilterTag] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'questions'));
      setQuestions(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question)));
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAi = async () => {
    if (!aiPrompt.trim()) return;
    setGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await response.json();
      setSuggestedQuestions(data.map((q: any) => ({
        ...q,
        ucId: 'UC-Inteligência Educacional Interativa-001'
      })));
    } catch (error) {
      console.error(error);
      alert('Falha ao gerar questões com IA.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveQuestion = async (index: number) => {
    const q = suggestedQuestions[index];
    try {
      await addDoc(collection(db, 'questions'), {
        ...q,
        createdAt: serverTimestamp(),
        status: 'PUBLISHED'
      });
      setSuggestedQuestions(prev => prev.filter((_, i) => i !== index));
      fetchQuestions();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar questão.');
    }
  };

  const handleDiscardSuggested = (index: number) => {
    setSuggestedQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = !filterDifficulty || q.difficulty === filterDifficulty;
    const matchesBloom = !filterBloom || q.bloomTaxonomy === filterBloom;
    const matchesTags = !filterTag || (q.tags && q.tags.some(t => t.toLowerCase().includes(filterTag.toLowerCase())));
    return matchesSearch && matchesDifficulty && matchesBloom && matchesTags;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8" id="question-bank-container">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
               <Plus className="w-6 h-6" />
            </div>
            Banco de Questões
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">Curadoria de conteúdos para simulados e atividades em escala.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-100 transition-all border border-indigo-200 active:scale-95"
          >
            <Sparkles className="w-5 h-5 text-indigo-500" />
            Sugerir com IA
          </button>
          <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-95">
            Nova Questão
          </button>
        </div>
      </header>

      {/* Sugestões da IA - Draft Area */}
      <AnimatePresence>
        {suggestedQuestions.length > 0 && (
          <motion.section 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-indigo-50/50 border-2 border-dashed border-indigo-200 rounded-3xl p-8 overflow-hidden mb-12"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-black text-indigo-900">
                  Novas Sugestões da IA
                </h2>
                <div className="px-3 py-1 bg-indigo-600 text-white text-xs font-black rounded-full shadow-inner">
                  {suggestedQuestions.length} QUESTÕES
                </div>
              </div>
              <button 
                onClick={() => setSuggestedQuestions([])}
                className="text-indigo-400 hover:text-indigo-600 font-bold text-sm tracking-tight"
              >
                Descartar Tudo
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {suggestedQuestions.map((q, idx) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={`suggested-${idx}`}
                  className="bg-white border border-indigo-100 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between gap-6"
                >
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        q.difficulty === 'easy' ? 'bg-green-100 text-green-700' : 
                        q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {q.difficulty}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                        {q.bloomTaxonomy}
                      </span>
                    </div>
                    <textarea 
                      value={q.text} 
                      onChange={(e) => {
                        const updated = [...suggestedQuestions];
                        updated[idx].text = e.target.value;
                        setSuggestedQuestions(updated);
                      }}
                      className="w-full text-lg font-bold text-gray-800 bg-transparent border-none focus:ring-0 resize-none p-0 leading-tight"
                      rows={2}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options?.map((opt, optIdx) => (
                        <div key={optIdx} className={`group relative flex items-center p-3 rounded-xl border-2 transition-all ${
                          optIdx === q.correctOptionIndex 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm' 
                          : 'border-gray-100 bg-gray-50 text-gray-500'
                        }`}>
                          <div className={`w-6 h-6 flex items-center justify-center rounded-lg text-[10px] font-black mr-3 ${
                            optIdx === q.correctOptionIndex ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </div>
                          <span className="text-sm font-bold">{opt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex md:flex-col justify-end gap-3 shrink-0">
                    <button 
                      onClick={() => handleSaveQuestion(idx)}
                      className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-black transition-all shadow-lg active:scale-90"
                      title="Salvar Questão"
                    >
                      <Save className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => handleDiscardSuggested(idx)}
                      className="bg-gray-100 text-gray-400 p-3 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
                      title="Descartar"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Main List Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Pesquisar por enunciado..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-600 font-medium"
              />
           </div>
           <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl shadow-sm font-bold border transition-all ${
              showFilters ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
            }`}
           >
              <Filter className="w-5 h-5" />
              Filtros
           </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Dificuldade</label>
                  <select 
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="w-full bg-white border-none rounded-xl py-2.5 px-4 shadow-sm focus:ring-2 focus:ring-indigo-600 font-bold text-sm"
                  >
                    <option value="">Todas</option>
                    <option value="easy">Fácil</option>
                    <option value="medium">Médio</option>
                    <option value="hard">Difícil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Taxonomia de Bloom</label>
                  <select 
                    value={filterBloom}
                    onChange={(e) => setFilterBloom(e.target.value)}
                    className="w-full bg-white border-none rounded-xl py-2.5 px-4 shadow-sm focus:ring-2 focus:ring-indigo-600 font-bold text-sm"
                  >
                    <option value="">Todas</option>
                    <option value="Lembrar">Lembrar</option>
                    <option value="Entender">Entender</option>
                    <option value="Aplicar">Aplicar</option>
                    <option value="Analisar">Analisar</option>
                    <option value="Avaliar">Avaliar</option>
                    <option value="Criar">Criar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Tag</label>
                  <input 
                    type="text" 
                    placeholder="Filtrar por tag..." 
                    value={filterTag}
                    onChange={(e) => setFilterTag(e.target.value)}
                    className="w-full bg-white border-none rounded-xl py-2.5 px-4 shadow-sm focus:ring-2 focus:ring-indigo-600 font-bold text-sm"
                  />
                </div>
                {(filterDifficulty || filterBloom || filterTag) && (
                  <div className="md:col-span-3 flex justify-end">
                    <button 
                      onClick={() => {
                        setFilterDifficulty('');
                        setFilterBloom('');
                        setFilterTag('');
                      }}
                      className="text-xs font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest"
                    >
                      Limpar Filtros
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="relative">
             <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
             <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-indigo-400 animate-pulse" />
          </div>
          <p className="mt-6 text-gray-500 font-black uppercase text-xs tracking-widest">Sincronizando Banco de Dados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 pb-20">
          <AnimatePresence mode="popLayout">
            {filteredQuestions.map((q) => (
              <motion.div 
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key={q.id} 
                className="group p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
              >
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-full ${
                        q.difficulty === 'easy' ? 'bg-green-50 text-green-600' : 
                        q.difficulty === 'medium' ? 'bg-indigo-50 text-indigo-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {q.difficulty}
                      </span>
                      <div className="h-4 w-[1px] bg-gray-100" />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight">UC: {q.ucId}</span>
                  </div>
                  <p className="text-gray-900 font-bold text-lg leading-tight group-hover:text-indigo-600 transition-colors">{q.text}</p>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-tighter">
                     Taxonomia de Bloom: <span className="text-indigo-600">{q.bloomTaxonomy || 'Não Definido'}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 md:opacity-0 group-hover:opacity-100 transition-all">
                  <button className="p-3 bg-gray-50 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredQuestions.length === 0 && (
            <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100">
               <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-gray-300" />
               </div>
               <h3 className="text-xl font-black text-gray-900">Nada encontrado aqui</h3>
               <p className="text-gray-400 font-medium text-sm mt-2">Ajuste seus filtros ou use a IA para criar novos conteúdos.</p>
               <button onClick={() => setShowAiModal(true)} className="mt-8 bg-black text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-lg">Começar agora</button>
            </div>
          )}
        </div>
      )}

      {/* IA Suggestion Modal */}
      <AnimatePresence>
        {showAiModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAiModal(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="bg-indigo-600 p-10 text-white">
                 <div className="flex justify-between items-start mb-6">
                    <div className="bg-white/20 p-3 rounded-2xl shadow-inner">
                       <Sparkles className="w-8 h-8" />
                    </div>
                    <button onClick={() => setShowAiModal(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                       <X className="w-8 h-8" />
                    </button>
                 </div>
                 <h2 className="text-4xl font-black leading-tight tracking-tighter">
                   Gerador Pedagógico<br />
                   Inteligente
                 </h2>
                 <p className="text-indigo-100 text-sm mt-3 font-medium opacity-80 italic">Descreva o tema ou competência para gerar questões automaticamente com Taxonomia de Bloom.</p>
              </div>
              
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Prompt Operacional</label>
                  <textarea 
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-6 focus:border-indigo-600 focus:bg-white focus:ring-0 transition-all min-h-[160px] text-lg font-bold text-gray-800 placeholder:text-gray-300 placeholder:font-medium leading-snug"
                    placeholder="Ex: Crie 5 questões sobre Desenvolvimento de APIs com Node.js, foque no nível 'Analisar' da Taxonomia de Bloom."
                  />
                </div>
                
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => setShowAiModal(false)}
                    className="px-8 py-3 text-gray-400 font-black text-xs uppercase tracking-widest hover:text-gray-900 transition-colors"
                  >
                    Fechar
                  </button>
                  <button 
                    onClick={handleGenerateAi}
                    disabled={generating || !aiPrompt.trim()}
                    className={`flex items-center gap-3 px-10 py-4 rounded-2xl transition-all shadow-xl font-black text-xs uppercase tracking-widest ${
                      generating ? 'bg-gray-200 text-gray-400' : 'bg-black text-white hover:bg-gray-800 active:scale-95'
                    }`}
                  >
                    {generating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Refinando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Gerar 5 Questões
                      </>
                    )}
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
