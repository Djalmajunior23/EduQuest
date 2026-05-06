import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { activityService } from '../../services/activityService';
import { rubricService } from '../../services/rubricService';
import { Activity, ActivityType, Rubric } from '../../types/activities';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Terminal } from 'lucide-react';

export default function ActivityCreateView() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [formData, setFormData] = useState<Partial<Activity>>({
    title: '',
    description: '',
    type: 'discursive',
    courseId: 'default',
    classId: 'default',
    competencies: [],
    skills: [],
    maxScore: 10,
    allowResubmission: true,
    status: 'draft',
    bloomLevel: 'Entender',
    rubricId: '',
    correctionMode: 'evaluative'
  });

  useEffect(() => {
    async function fetchRubrics() {
      if (user) {
        const docs = await rubricService.getTeacherRubrics(user.id);
        setRubrics(docs);
      }
    }
    fetchRubrics();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      if (formData.rubricId === '') {
        delete formData.rubricId;
      }
      await activityService.createActivity({
        ...formData,
        teacherId: user.id,
      } as Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>);
      navigate('/activities');
    } catch (err) {
      console.error(err);
      alert('Erro ao criar atividade');
    } finally {
      setLoading(false);
    }
  };

  const handleListChange = (field: 'competencies' | 'skills', val: string) => {
    setFormData({ ...formData, [field]: val.split(',').map(s => s.trim()).filter(Boolean) });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-black italic uppercase text-slate-900 tracking-tighter">Criar Nova Atividade</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">Título da Atividade *</label>
            <input 
              required
              type="text" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Ex: Análise de Requisitos com Caso de Uso"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">Enunciado / Descrição *</label>
            <textarea 
              required
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[150px]"
              placeholder="Descreva o que o aluno deve fazer detalhadamente..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Atividade</label>
            <select 
              value={formData.type} 
              onChange={e => setFormData({...formData, type: e.target.value as ActivityType})}
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="discursive">Questão Discursiva</option>
              <option value="short_answer">Resposta Curta</option>
              <option value="case_study">Estudo de Caso</option>
              <option value="code">Análise/Desenvolvimento de Código</option>
              <option value="practical">Atividade Prática</option>
              <option value="file_upload">Envio de Arquivo</option>
              <option value="database">Banco de Dados</option>
              <option value="modeling">Modelagem de Sistemas</option>
              <option value="cybersecurity">Cibersegurança</option>
              <option value="network">Redes de Computadores</option>
              <option value="iot">IoT</option>
              <option value="free">Livre (Criada pelo Professor)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nível de Bloom</label>
            <select 
              value={formData.bloomLevel} 
              onChange={e => setFormData({...formData, bloomLevel: e.target.value})}
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="Lembrar">Lembrar</option>
              <option value="Entender">Entender</option>
              <option value="Aplicar">Aplicar</option>
              <option value="Analisar">Analisar</option>
              <option value="Avaliar">Avaliar</option>
              <option value="Criar">Criar</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Competências (separadas por vírgula)</label>
            <input 
              type="text" 
              value={formData.competencies?.join(', ')} 
              onChange={e => handleListChange('competencies', e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Ex: C1, C2, C3"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Pontuação Máxima</label>
            <input 
              type="number" 
              value={formData.maxScore} 
              onChange={e => setFormData({...formData, maxScore: Number(e.target.value)})}
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Status Inicial</label>
            <select 
              value={formData.status} 
              onChange={e => setFormData({...formData, status: e.target.value as any})}
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="draft">Rascunho (Não visível para alunos)</option>
              <option value="published">Publicado (Visível para alunos)</option>
              <option value="closed">Fechado (Somente visualização)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Modo de Correção IA</label>
            <select 
              value={formData.correctionMode} 
              onChange={e => setFormData({...formData, correctionMode: e.target.value as any})}
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="formative">Formativa (Foco em Feedback)</option>
              <option value="evaluative">Avaliativa (Foco em Nota)</option>
              <option value="diagnostic">Diagnóstica (Foco em Gaps)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Rubrica de Avaliação (Opcional)</label>
            <select 
              value={formData.rubricId || ''} 
              onChange={e => setFormData({...formData, rubricId: e.target.value})}
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Nenhuma Rubrica</option>
              {rubrics.map(r => (
                <option key={r.id} value={r.id}>{r.title}</option>
              ))}
            </select>
          </div>

          {(formData.type === 'code' || formData.type === 'database') && (
            <div className="md:col-span-2 bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300">
              <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Casos de Teste (Sugestão de Autocorreção)
              </h3>
              <div className="space-y-4">
                {(formData.testCases || []).map((tc, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-200 relative">
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">Input</label>
                      <input 
                        type="text" 
                        value={tc.input} 
                        onChange={e => {
                          const newTests = [...(formData.testCases || [])];
                          newTests[index].input = e.target.value;
                          setFormData({...formData, testCases: newTests});
                        }}
                        className="w-full p-2 border rounded font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">Saída Esperada</label>
                      <input 
                        type="text" 
                        value={tc.expectedOutput} 
                        onChange={e => {
                          const newTests = [...(formData.testCases || [])];
                          newTests[index].expectedOutput = e.target.value;
                          setFormData({...formData, testCases: newTests});
                        }}
                        className="w-full p-2 border rounded font-mono text-sm"
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        const newTests = (formData.testCases || []).filter((_, i) => i !== index);
                        setFormData({...formData, testCases: newTests});
                      }}
                      className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center border border-red-200"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, testCases: [...(formData.testCases || []), { input: '', expectedOutput: '' }]})}
                  className="w-full py-3 border-2 border-dashed border-slate-300 text-slate-400 rounded-xl hover:border-indigo-300 hover:text-indigo-400 transition font-bold text-sm"
                >
                  + Adicionar Caso de Teste
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-100">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : <><Save className="w-5 h-5"/> Salvar Atividade</>}
          </button>
        </div>
      </form>
    </div>
  );
}
