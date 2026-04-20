import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  Tag, 
  Filter,
  X,
  CheckCircle2,
  Sparkles,
  Loader2,
  BookOpen,
  Layers,
  AlertCircle,
  FileText,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { generateQuestions, suggestQuestionMetadata } from '../services/aiAssistantService';

export default function QuestionBank() {
  const { profile } = useAuth();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isQuickExamModalOpen, setIsQuickExamModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [quickExamConfig, setQuickExamConfig] = useState({ title: '', tag: '', count: 5, passingScore: 6 });
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'question' | 'options' | 'metadata'>('question');
  const [search, setSearch] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterBloom, setFilterBloom] = useState('all');
  const [filterTag, setFilterTag] = useState('');

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(search.toLowerCase()) || 
                          q.competence?.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || q.difficulty === filterDifficulty;
    const matchesBloom = filterBloom === 'all' || q.bloomTaxonomy === filterBloom;
    const matchesTag = !filterTag || q.tags?.includes(filterTag);
    return matchesSearch && matchesDifficulty && matchesBloom && matchesTag;
  });
  
  const [formData, setFormData] = useState({
    text: '',
    options: ['', '', '', ''],
    correctOptionIndex: 0,
    difficulty: 'medium',
    tags: '',
    competence: '',
    discipline: '',
    bloomTaxonomy: 'Entender',
    explanation: ''
  });

  const [metadataLoading, setMetadataLoading] = useState(false);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const q = query(collection(db, 'questions'), where('teacherId', '==', profile?.uid));
        const snap = await getDocs(q);
        setQuestions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    }

    if (profile) fetchQuestions();
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.text.trim()) {
      alert('O enunciado da questão é obrigatório.');
      return;
    }
    if (formData.options.some(opt => !opt.trim())) {
      alert('Todas as opções devem ser preenchidas.');
      return;
    }
    try {
      const newQuestion = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        teacherId: profile.uid,
        createdAt: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, 'questions'), newQuestion);
      setQuestions([{ id: docRef.id, ...newQuestion }, ...questions]);
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const resetForm = () => {
    setFormData({ 
      text: '', 
      options: ['', '', '', ''], 
      correctOptionIndex: 0, 
      difficulty: 'medium', 
      tags: '',
      competence: '',
      discipline: '',
      bloomTaxonomy: 'Entender',
      explanation: ''
    });
  };

  const handleSuggestMetadata = async () => {
    if (!formData.text || formData.options.some(opt => !opt.trim())) {
      alert('Preencha o enunciado e as opções antes de sugerir os metadados.');
      return;
    }
    setMetadataLoading(true);
    try {
      const suggestion = await suggestQuestionMetadata({
        text: formData.text,
        options: formData.options,
        correctIndex: formData.correctOptionIndex
      });
      setFormData(prev => ({
        ...prev,
        bloomTaxonomy: suggestion.bloomTaxonomy,
        explanation: suggestion.explanation
      }));
    } catch (error) {
      console.error('Error suggesting metadata:', error);
      alert('Erro ao sugerir metadados via IA.');
    } finally {
      setMetadataLoading(false);
    }
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    try {
      const generated = await generateQuestions(aiPrompt);
      const batch = writeBatch(db);
      const newQuestions: any[] = [];

      generated.forEach((q: any) => {
        const qRef = doc(collection(db, 'questions'));
        const qData = {
          ...q,
          teacherId: profile.uid,
          createdAt: new Date().toISOString(),
          discipline: formData.discipline || 'Geral',
          competence: aiPrompt
        };
        batch.set(qRef, qData);
        newQuestions.push({ id: qRef.id, ...qData });
      });

      await batch.commit();
      setQuestions([...newQuestions, ...questions]);
      setIsAIModalOpen(false);
      setAiPrompt('');
    } catch (error) {
      console.error('Error generating AI questions:', error);
      alert('Erro ao gerar questões com IA. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja excluir esta questão?')) {
      await deleteDoc(doc(db, 'questions', id));
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const handleQuickExamGenerate = async () => {
    if (!quickExamConfig.title || !quickExamConfig.tag) return;
    setIsGenerating(true);
    try {
      const q = query(
        collection(db, 'questions'),
        where('teacherId', '==', profile.uid),
        where('tags', 'array-contains', quickExamConfig.tag)
      );
      const snap = await getDocs(q);
      const taggedQuestions = snap.docs.map(doc => doc.id);
      
      if (taggedQuestions.length === 0) {
        alert('Nenhuma questão encontrada com esta tag.');
        return;
      }
      
      const selectedIds = taggedQuestions.sort(() => 0.5 - Math.random())
        .slice(0, Math.min(quickExamConfig.count, taggedQuestions.length));
      
      const newExam = {
        title: quickExamConfig.title,
        description: `Simulado rápido sobre ${quickExamConfig.tag}`,
        questionIds: selectedIds,
        active: true,
        timeLimit: selectedIds.length * 2,
        passingScore: quickExamConfig.passingScore,
        teacherId: profile.uid,
        createdAt: new Date().toISOString()
      };
      
      await addDoc(collection(db, 'exams'), newExam);
      setIsQuickExamModalOpen(false);
      setQuickExamConfig({ title: '', tag: '', count: 5, passingScore: 6 });
      alert('Simulado gerado com sucesso!');
    } catch (error) {
      console.error('Error generating quick exam:', error);
      alert('Erro ao gerar simulado.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenAIModalWithPrompt = (prompt: string) => {
    setAiPrompt(prompt);
    setIsAIModalOpen(true);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Enunciado', 'Opções', 'Resposta Correta', 'Dificuldade', 'Taxonomia de Bloom', 'Tags', 'Explicação'];
    const rows = questions.map(q => [
      q.id,
      `"${(q.text || '').replace(/"/g, '""')}"`,
      `"${(q.options?.join(' | ') || '').replace(/"/g, '""')}"`,
      `"${(q.options && q.options[q.correctOptionIndex] ? q.options[q.correctOptionIndex] : '').replace(/"/g, '""')}"`,
      q.difficulty,
      q.bloomTaxonomy,
      `"${(q.tags?.join(', ') || '').replace(/"/g, '""')}"`,
      `"${(q.explanation || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'banco_de_questoes.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Banco de Questões</h1>
          <p className="text-slate-500">Gerencie seu acervo de questões para simulados.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
          >
            <Download className="w-5 h-5" />
            Exportar CSV
          </button>
          <button 
            onClick={() => setIsQuickExamModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
          >
            <FileText className="w-5 h-5" />
            Gerar Prova Rápida
          </button>
          <button 
            onClick={() => handleOpenAIModalWithPrompt('Criação de Interfaces React com Vite')}
            className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-100 transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            Gerar: React/Vite
          </button>
          <button 
            onClick={() => setIsAIModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            <Sparkles className="w-5 h-5" />
            Gerar com IA
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            <Plus className="w-5 h-5" />
            Nova Questão
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por texto ou competência..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          <select 
            value={filterDifficulty}
            onChange={e => setFilterDifficulty(e.target.value)}
            className="p-2 border rounded-xl border-slate-200"
          >
            <option value="all">Filtro: Dificuldade (Todas)</option>
            <option value="easy">Fácil</option>
            <option value="medium">Médio</option>
            <option value="hard">Difícil</option>
          </select>
          <select 
            value={filterBloom}
            onChange={e => setFilterBloom(e.target.value)}
            className="p-2 border rounded-xl border-slate-200"
          >
            <option value="all">Filtro: Bloom (Todos)</option>
            <option value="Lembrar">Lembrar</option>
            <option value="Entender">Entender</option>
            <option value="Aplicar">Aplicar</option>
            <option value="Analisar">Analisar</option>
            <option value="Avaliar">Avaliar</option>
            <option value="Criar">Criar</option>
          </select>
          <input 
            value={filterTag}
            onChange={e => setFilterTag(e.target.value)}
            placeholder="Filtrar por tag"
            className="p-2 border rounded-xl border-slate-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredQuestions.map((q) => (
          <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all duration-300">
            <div className="flex justify-between gap-4 mb-4">
              <div className="flex flex-wrap gap-2">
                <span className={cn(
                  "px-2 py-1 rounded text-xs font-bold uppercase",
                  q.difficulty === 'easy' ? "bg-emerald-50 text-emerald-600" :
                  q.difficulty === 'medium' ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                )}>
                  {q.difficulty}
                </span>
                {q.bloomTaxonomy && (
                  <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-bold uppercase flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    {q.bloomTaxonomy}
                  </span>
                )}
                {q.discipline && (
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-bold uppercase flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {q.discipline}
                  </span>
                )}
                {q.tags?.map((tag: string) => (
                  <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(q.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <p className="text-slate-900 font-medium mb-4">{q.text}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
              {q.options.map((opt: string, idx: number) => (
                <div key={idx} className={cn(
                  "p-3 rounded-lg border text-sm flex items-center gap-2",
                  idx === q.correctOptionIndex ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-100 bg-slate-50 text-slate-500"
                )}>
                  {idx === q.correctOptionIndex && <CheckCircle2 className="w-4 h-4" />}
                  {opt}
                </div>
              ))}
            </div>
            {q.explanation && (
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-xs font-bold text-blue-700 uppercase mb-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Explicação da Resposta
                </p>
                <p className="text-sm text-blue-900">{q.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Exam Modal */}
      <AnimatePresence>
        {isQuickExamModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Gerar Prova Rápida</h2>
                <button onClick={() => setIsQuickExamModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <input type="text" placeholder="Título da Prova" className="w-full p-3 border rounded-xl border-slate-200" value={quickExamConfig.title} onChange={e => setQuickExamConfig({...quickExamConfig, title: e.target.value})} />
                <input type="text" placeholder="Tag de busca" className="w-full p-3 border rounded-xl border-slate-200" value={quickExamConfig.tag} onChange={e => setQuickExamConfig({...quickExamConfig, tag: e.target.value})} />
                <input type="number" placeholder="Qtd. Questões" className="w-full p-3 border rounded-xl border-slate-200" value={quickExamConfig.count} onChange={e => setQuickExamConfig({...quickExamConfig, count: parseInt(e.target.value)})} />
                <input type="number" placeholder="Nota de Corte" className="w-full p-3 border rounded-xl border-slate-200" value={quickExamConfig.passingScore} onChange={e => setQuickExamConfig({...quickExamConfig, passingScore: parseInt(e.target.value)})} />
                <button 
                  onClick={handleQuickExamGenerate} 
                  disabled={isGenerating}
                  className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                >
                  {isGenerating ? 'Gerando...' : 'Gerar Simulado'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Generation Modal */}
      <AnimatePresence>
        {isAIModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-slate-900">Assistente de IA</h2>
                </div>
                <button onClick={() => setIsAIModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <p className="text-slate-600 text-sm">
                  Descreva o tema ou competência para gerar questões automaticamente com Taxonomia de Bloom.
                </p>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tema / Competência</label>
                  <textarea 
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    placeholder="Ex: Fundamentos de Redes de Computadores, Protocolo HTTP, Lógica de Programação com JavaScript..."
                    className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                  />
                </div>

                <button 
                  onClick={handleAIGenerate}
                  disabled={isGenerating || !aiPrompt}
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Gerando Questões...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Gerar 5 Questões
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manual Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl my-8"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Nova Questão</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-200 mb-8">
                {(['question', 'options', 'metadata'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-6 py-3 font-semibold text-sm capitalize transition-colors border-b-2",
                      activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
                    )}
                  >
                    {tab === 'question' ? 'Questão' : tab === 'options' ? 'Opções' : 'Metadados'}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {activeTab === 'question' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Enunciado</label>
                      <textarea 
                        required
                        value={formData.text}
                        onChange={e => setFormData({...formData, text: e.target.value})}
                        className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px]"
                        placeholder="Digite o enunciado da questão..."
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-bold text-slate-700">Explicação Detalhada (Correção)</label>
                        <button 
                          type="button"
                          onClick={handleSuggestMetadata}
                          disabled={metadataLoading}
                          className="text-[10px] font-black uppercase text-indigo-600 flex items-center gap-1 hover:text-indigo-700 disabled:opacity-50"
                        >
                          {metadataLoading ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3" />}
                          Sugerir via IA
                        </button>
                      </div>
                      <textarea 
                        value={formData.explanation}
                        onChange={e => setFormData({...formData, explanation: e.target.value})}
                        className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                        placeholder="Explique por que a resposta correta é a certa..."
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'options' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.options.map((opt, idx) => (
                      <div key={idx}>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Opção {String.fromCharCode(65 + idx)}</label>
                        <input 
                          required
                          value={opt}
                          onChange={e => {
                            const newOpts = [...formData.options];
                            newOpts[idx] = e.target.value;
                            setFormData({...formData, options: newOpts});
                          }}
                          className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    ))}
                    <div className="col-span-full">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Opção Correta</label>
                      <select 
                        value={formData.correctOptionIndex}
                        onChange={e => setFormData({...formData, correctOptionIndex: parseInt(e.target.value)})}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        {formData.options.map((_, idx) => (
                          <option key={idx} value={idx}>Opção {String.fromCharCode(65 + idx)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === 'metadata' && (
                  <div className="space-y-8">
                    <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                      <h4 className="text-sm font-bold text-indigo-900 mb-4 flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        Classificação Pedagógica (Taxonomia & Dificuldade)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Dificuldade</label>
                          <select 
                            value={formData.difficulty}
                            onChange={e => setFormData({...formData, difficulty: e.target.value})}
                            className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                          >
                            <option value="easy">Fácil</option>
                            <option value="medium">Médio</option>
                            <option value="hard">Difícil</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Taxonomia de Bloom</label>
                          <select 
                            value={formData.bloomTaxonomy}
                            onChange={e => setFormData({...formData, bloomTaxonomy: e.target.value})}
                            className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none uppercase tracking-widest text-[10px] font-black"
                          >
                            <option value="Lembrar">Lembrar</option>
                            <option value="Entender">Entender</option>
                            <option value="Aplicar">Aplicar</option>
                            <option value="Analisar">Analisar</option>
                            <option value="Avaliar">Avaliar</option>
                            <option value="Criar">Criar</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Vínculo Curricular SENAI
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Disciplina (UC)</label>
                          <input 
                            value={formData.discipline}
                            onChange={e => setFormData({...formData, discipline: e.target.value})}
                            className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Ex: Redes de Computadores"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Competência</label>
                          <input 
                            value={formData.competence}
                            onChange={e => setFormData({...formData, competence: e.target.value})}
                            className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Ex: Configuração de Roteadores"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-xs font-bold text-slate-500 mb-1">Tags (separadas por vírgula)</label>
                        <input 
                          value={formData.tags}
                          onChange={e => setFormData({...formData, tags: e.target.value})}
                          className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                          placeholder="ex: javascript, lógica, arrays"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                  Salvar Questão
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
