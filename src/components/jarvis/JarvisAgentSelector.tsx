import React from 'react';
import { 
  GraduationCap, Code, Target, 
  BarChart3, ShieldCheck, Gamepad2,
  BrainCircuit, BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Agent {
    id: string;
    name: string;
    icon: any;
    color: string;
    description: string;
    tasks: string[];
}

const agents: Agent[] = [
    {
        id: 'tutor',
        name: 'Tutor Inteligente',
        icon: GraduationCap,
        color: 'bg-indigo-500',
        description: 'Especialista em tirar dúvidas e explicar conceitos complexos de forma simples.',
        tasks: ['Explicar Teoria', 'Exemplos Práticos', 'Dúvidas Rápidas']
    },
    {
        id: 'coder',
        name: 'Correction Agent',
        icon: Code,
        color: 'bg-emerald-500',
        description: 'Analisa código, detecta erros de lógica e sugere melhorias de performance.',
        tasks: ['Revisar Código', 'Depurar Erro', 'Análise SQL']
    },
    {
        id: 'copilot',
        name: 'Professor Copilot',
        icon: BrainCircuit,
        color: 'bg-violet-500',
        description: 'Auxilia na criação de aulas, avaliações e situações de aprendizagem (SA).',
        tasks: ['Planejar Aula', 'Criar SA', 'Gerar Rubricas']
    },
    {
        id: 'analytics',
        name: 'Analytics Agent',
        icon: BarChart3,
        color: 'bg-amber-500',
        description: 'Analisa dados de desempenho e identifica alunos em risco ou turmas críticas.',
        tasks: ['Evasão', 'Desempenho', 'Insights']
    },
    {
        id: 'gamification',
        name: 'Master Gamification',
        icon: Gamepad2,
        color: 'bg-rose-500',
        description: 'Gerencia XP, missões e conquistas para manter o engajamento elevado.',
        tasks: ['Criar Missões', 'XP Reward', 'Badges']
    }
];

export const JarvisAgentSelector = ({ onSelect, selectedId }: { onSelect: (id: string) => void, selectedId?: string }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {agents.map((agent) => {
                const Icon = agent.icon;
                const isSelected = selectedId === agent.id;
                
                return (
                    <button
                        key={agent.id}
                        onClick={() => onSelect(agent.id)}
                        className={cn(
                            "group p-6 rounded-[2rem] border-2 transition-all text-left flex flex-col items-start gap-4 h-full",
                            isSelected 
                                ? "bg-slate-900 border-slate-900 shadow-2xl shadow-slate-200" 
                                : "bg-white border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50"
                        )}
                    >
                        <div className={cn(
                            "p-3 rounded-2xl transition-transform group-hover:scale-110",
                            isSelected ? "bg-white/10" : agent.color + " bg-opacity-10"
                        )}>
                            <Icon className={cn("w-6 h-6", isSelected ? "text-white" : agent.color.replace('bg-', 'text-'))} />
                        </div>
                        
                        <div>
                            <h4 className={cn("text-sm font-black uppercase tracking-widest", isSelected ? "text-white" : "text-slate-900")}>
                                {agent.name}
                            </h4>
                            <p className={cn("text-[10px] mt-1 leading-relaxed line-clamp-2", isSelected ? "text-slate-400" : "text-slate-500 font-medium")}>
                                {agent.description}
                            </p>
                        </div>
                        
                        <div className="mt-auto pt-4 flex flex-wrap gap-2">
                            {agent.tasks.map(task => (
                                <span key={task} className={cn(
                                    "px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider",
                                    isSelected ? "bg-white/5 text-white/50" : "bg-slate-50 text-slate-400"
                                )}>
                                    {task}
                                </span>
                            ))}
                        </div>
                    </button>
                )
            })}
        </div>
    );
};
