import { api } from '../../../lib/api';


import React, { useState } from 'react';export default function SAProducer() {
  const [prompt, setPrompt] = useState({ tema: '', conhecimentos: '', capacidades: '', objetivos: '' });
  const [generating, setGenerating] = useState(false);
  const [saContent, setSaContent] = useState('');

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-sa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          context: {
            ...prompt,
            conhecimentos: prompt.conhecimentos.split(','),
            capacidades: prompt.capacidades.split(',')
          } 
        }),
      });
      const data = await response.json();
      setSaContent(data.content);
    } catch (error) {
      console.error(error);
      alert('Falha ao gerar SA');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await api
        .from('situacoes_aprendizagem')
        .insert({
          titulo: prompt.tema,
          versao_professor: saContent,
          created_at: new Date().toISOString(),
          status: 'DRAFT'
        });
      
      if (error) throw error;
      alert('SA salva com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar SA');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Produção de Situação de Aprendizagem (SA)</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input placeholder="Tema" className="border p-2" onChange={e => setPrompt({...prompt, tema: e.target.value})} />
        <input placeholder="Conhecimentos (separar por vírgula)" className="border p-2" onChange={e => setPrompt({...prompt, conhecimentos: e.target.value})} />
        <input placeholder="Capacidades (separar por vírgula)" className="border p-2" onChange={e => setPrompt({...prompt, capacidades: e.target.value})} />
        <input placeholder="Objetivos" className="border p-2" onChange={e => setPrompt({...prompt, objetivos: e.target.value})} />
      </div>
      <button onClick={handleGenerate} className="bg-purple-600 text-white px-4 py-2 rounded mb-4" disabled={generating}>
        {generating ? 'Gerando com IA...' : 'Gerar SA com IA'}
      </button>
      
      {saContent && (
        <div className="border p-4 rounded bg-gray-50">
          <h2 className="font-bold mb-2">Resultado da SA:</h2>
          <pre className="whitespace-pre-wrap">{saContent}</pre>
          <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded mt-4">Salvar SA Como Rascunho</button>
        </div>
      )}
    </div>
  );
}
