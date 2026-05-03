// src/components/edujarvis/TeacherProductivityHub.tsx
import React, { useState } from 'react';
import { 
  FilePlus, 
  ClipboardCheck, 
  Users, 
  RotateCcw, 
  Target, 
  BarChart, 
  BookOpen, 
  Calendar,
  Loader2
} from 'lucide-react';

interface TeacherProductivityHubProps {
  onActionResult?: (result: string) => void;
}

export function TeacherProductivityHub({ onActionResult }: TeacherProductivityHubProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [tema, setTema] = useState("");

  const actions = [
    { id: 'aula_completa', name: "Criar aula completa", icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'simulado', name: "Criar simulado adaptativo", icon: Target, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'recuperacao', name: "Gerar recuperação paralela", icon: RotateCcw, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 'corrigir', name: "Corrigir respostas", icon: ClipboardCheck, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'rubrica', name: "Criar rubrica", icon: FilePlus, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { id: 'analisar_turma', name: "Analisar desempenho da turma", icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 'estudo_caso', name: "Criar estudo de caso", icon: BarChart, color: 'text-pink-600', bg: 'bg-pink-50' },
    { id: 'plano_semanal', name: "Gerar plano semanal", icon: Calendar, color: 'text-teal-600', bg: 'bg-teal-50' },
  ];

  const handleAction = async (actionId: string, actionName: string) => {
    if (!tema) return alert("Por favor, digite o tema da atividade.");
    
    setLoading(actionId);
    try {
      const response = await fetch('/api/phase07/content-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: actionName,
          tema,
          nivel: 'médio',
          cargaHoraria: '4 horas'
        })
      });

      const data = await response.json();
      if (onActionResult) onActionResult(data.result);
    } catch (error) {
      console.error("Action Failed", error);
      if (onActionResult) onActionResult("Falha ao gerar conteúdo. Tente novamente.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hub de Produtividade</h2>
          <p className="text-sm text-gray-500">EduJarvis: IA Copiloto para o Professor</p>
        </div>
      </div>

      <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sobre qual tema você quer trabalhar hoje?</label>
          <input 
            type="text" 
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            placeholder="Ex: Introdução a Python, Revolução Industrial, Biologia Celular..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleAction(action.id, action.name)}
            disabled={loading !== null || !tema}
            className={`group relative flex flex-col items-center justify-center text-center p-4 rounded-xl border border-transparent transition-all duration-200 hover:border-gray-200 hover:shadow-md disabled:opacity-50 ${action.bg}`}
          >
            {loading === action.id ? (
                <Loader2 className="w-6 h-6 animate-spin text-gray-400 mb-3" />
            ) : (
                <div className={`p-3 rounded-lg mb-3 ${action.bg} group-hover:scale-110 transition-transform`}>
                    <action.icon className={`w-6 h-6 ${action.color}`} />
                </div>
            )}
            <span className="text-sm font-medium text-gray-700 leading-tight">
              {action.name}
            </span>
          </button>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center text-xs text-gray-400">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
            EduJarvis Phase 07 Online
        </div>
        <button className="text-xs font-semibold text-blue-600 hover:underline">
            Configurar White-Label IA →
        </button>
      </div>
    </div>
  );
}
