import React from 'react';
import { motion } from 'motion/react';
import { 
    BookOpen, Target, BarChart3, HelpCircle, 
    Gamepad2, BrainCircuit, Code, AlertTriangle, 
    FileText, Zap, Rocket, Shield
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface Props {
  onSelect: (text: string) => void;
  role?: string;
}

export function EduJarvisQuickActions({ onSelect, role }: Props) {
  const studentActions = [
    { text: "Explique esse conteúdo de forma simples", icon: BrainCircuit, color: 'text-indigo-600' },
    { text: "Crie um exercício para eu praticar", icon: Zap, color: 'text-amber-500' },
    { text: "Monte um plano de estudo personalizado", icon: Target, color: 'text-rose-500' },
    { text: "Me ajude a entender meu erro", icon: HelpCircle, color: 'text-emerald-500' }
  ];

  const teacherActions = [
    { text: "Criar atividade prática baseada em competências", icon: Rocket, color: 'text-indigo-600' },
    { text: "Analisar risco de evasão desta turma", icon: AlertTriangle, color: 'text-rose-500' },
    { text: "Gerar plano de recuperação automático para notas < 60%", icon: Shield, color: 'text-emerald-500' },
    { text: "Corrigir exercícios com rubricas TRI", icon: Target, color: 'text-amber-500' },
    { text: "Gerar aula completa com Situação de Aprendizagem", icon: FileText, color: 'text-violet-500' },
    { text: "Analisar gaps de proficiência coletiva", icon: BarChart3, color: 'text-cyan-500' }
  ];

  const actions = role === 'ALUNO' ? studentActions : teacherActions;

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
      {actions.map((action, i) => (
        <motion.button
          key={i}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(action.text)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl",
            "whitespace-nowrap transition-all shadow-sm hover:shadow-md hover:border-indigo-100"
          )}
        >
          <action.icon className={cn("w-3.5 h-3.5", action.color)} />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
            {action.text}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
