import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { rubricService } from '../../services/rubricService';
import { Rubric, RubricCriterion } from '../../types/activities';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ActivityRubricBuilder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [criteria, setCriteria] = useState<RubricCriterion[]>([]);

  const handleAddCriterion = () => {
    setCriteria([
      ...criteria,
      {
        name: '',
        description: '',
        maxPoints: 0,
        levels: [
          { label: 'Insuficiente', description: '', points: 0 },
          { label: 'Suficiente', description: '', points: 5 },
          { label: 'Excelente', description: '', points: 10 },
        ],
      },
    ]);
  };

  const handleRemoveCriterion = (index: number) => {
    const newCriteria = [...criteria];
    newCriteria.splice(index, 1);
    setCriteria(newCriteria);
  };

  const addCriterionLevel = (criterionIndex: number) => {
    const newCriteria = [...criteria];
    newCriteria[criterionIndex].levels.push({ label: '', description: '', points: 0 });
    setCriteria(newCriteria);
  };

  const removeCriterionLevel = (criterionIndex: number, levelIndex: number) => {
    const newCriteria = [...criteria];
    newCriteria[criterionIndex].levels.splice(levelIndex, 1);
    setCriteria(newCriteria);
  };

  const handleSave = async () => {
    if (!user || !title.trim() || criteria.length === 0) {
      alert('Preencha o título e adicione pelo menos um critério.');
      return;
    }
    setLoading(true);
    try {
      await rubricService.createRubric({
        title,
        teacherId: user.id,
        criteria,
      });
      alert('Rubrica salva com sucesso!');
      navigate(-1);
    } catch (e) {
      console.error(e);
      alert('Erro ao salvar rubrica.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-4 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Construtor de Rubricas</h1>
            <p className="text-sm text-slate-500">Crie critérios de avaliação estruturados.</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {loading ? 'Salvando...' : 'Salvar Rubrica'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <label className="block text-sm font-bold text-slate-700 mb-2">Título da Rubrica *</label>
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Avaliação de Redação Modelo ENEM"
          className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-lg font-bold text-slate-800"
        />
      </div>

      <div className="space-y-6">
        {criteria.map((criterion, cIndex) => (
          <div key={cIndex} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative group">
            <button 
              onClick={() => handleRemoveCriterion(cIndex)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 pr-12">
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Critério {cIndex + 1}</label>
                <input 
                  type="text" 
                  value={criterion.name}
                  onChange={(e) => {
                    const newC = [...criteria];
                    newC[cIndex].name = e.target.value;
                    setCriteria(newC);
                  }}
                  placeholder="Ex: Domínio da norma culta"
                  className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pontos Máx</label>
                <input 
                  type="number" 
                  value={criterion.maxPoints}
                  onChange={(e) => {
                    const newC = [...criteria];
                    newC[cIndex].maxPoints = Number(e.target.value);
                    setCriteria(newC);
                  }}
                  className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                />
              </div>
              <div className="md:col-span-4">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Descrição do Critério</label>
                <textarea 
                  value={criterion.description}
                  onChange={(e) => {
                    const newC = [...criteria];
                    newC[cIndex].description = e.target.value;
                    setCriteria(newC);
                  }}
                  placeholder="Detalhe o que será avaliado..."
                  className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm min-h-[80px]"
                />
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-bold text-slate-700">Níveis de Desempenho</h4>
                <button 
                  onClick={() => addCriterionLevel(cIndex)}
                  className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-800"
                >
                  <Plus className="w-4 h-4" /> Adicionar Nível
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {criterion.levels.map((level, lIndex) => (
                  <div key={lIndex} className="bg-white p-4 rounded-lg border border-slate-200 relative">
                    <button 
                      onClick={() => removeCriterionLevel(cIndex, lIndex)}
                      className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="space-y-3 pt-2">
                       <div>
                         <label className="text-[10px] font-bold text-slate-400 uppercase">Rótulo</label>
                         <input 
                           type="text" 
                           value={level.label}
                           onChange={(e) => {
                             const newC = [...criteria];
                             newC[cIndex].levels[lIndex].label = e.target.value;
                             setCriteria(newC);
                           }}
                           className="w-full p-2 border-b border-slate-200 focus:border-indigo-500 outline-none text-sm font-bold"
                           placeholder="Ex: Excelente"
                         />
                       </div>
                       <div>
                         <label className="text-[10px] font-bold text-slate-400 uppercase">Pontos</label>
                         <input 
                           type="number" 
                           value={level.points}
                           onChange={(e) => {
                             const newC = [...criteria];
                             newC[cIndex].levels[lIndex].points = Number(e.target.value);
                             setCriteria(newC);
                           }}
                           className="w-full p-2 border-b border-slate-200 focus:border-indigo-500 outline-none text-sm"
                         />
                       </div>
                       <div>
                         <label className="text-[10px] font-bold text-slate-400 uppercase">Descrição Esperada</label>
                         <textarea 
                           value={level.description}
                           onChange={(e) => {
                             const newC = [...criteria];
                             newC[cIndex].levels[lIndex].description = e.target.value;
                             setCriteria(newC);
                           }}
                           className="w-full p-2 border border-slate-100 rounded focus:border-indigo-500 outline-none text-xs min-h-[60px]"
                           placeholder="O que o aluno deve fazer para ganhar esses pontos?"
                         />
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <button 
          onClick={handleAddCriterion}
          className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 font-bold hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Adicionar Critério
        </button>
      </div>
    </div>
  );
}
