// src/components/EduJarvis/QuickActions.tsx
import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Target, BarChart3, HelpCircle, Gamepad2, BrainCircuit, Code, AlertTriangle, FileText } from 'lucide-react';

interface Props {
  onSelect: (text: string) => void;
  role: string;
}

export function EduJarvisQuickActions({ onSelect, role }: Props) {
  const studentActions = [
    { text: "Explique esse conteúdo de forma simples", icon: BrainCircuit },
    { text: "Crie um exercício para eu praticar", icon: BookOpen },
    { text: "Monte um plano de estudo personalizado", icon: Target },
    { text: "Me ajude a entender meu erro", icon: HelpCircle }
  ];

  const teacherActions = [
    { text: "Criar atividade prática", icon: BookOpen },
    { text: "Gerar estudo de caso", icon: Target },
    { text: "Criar aula invertida", icon: Target },
    { text: "Gerar questões", icon: HelpCircle },
    { text: "Analisar desempenho", icon: BarChart3 },
    { text: "Criar plano de recuperação", icon: BrainCircuit },
    { text: "Corrigir código do aluno", icon: Code },
    { text: "Analisar risco de evasão", icon: AlertTriangle },
    { text: "Gerar aula completa", icon: FileText }
  ];

  const actions = role === 'ALUNO' ? studentActions : teacherActions;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {actions.map((action, i) => (
        <motion.button
          key={i}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(action.text)}
          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-[11px] font-bold text-indigo-600 uppercase tracking-wider hover:bg-indigo-100 transition-colors"
        >
          <action.icon className="w-3 h-3" />
          {action.text}
        </motion.button>
      ))}
    </div>
  );
}
