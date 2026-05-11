import React, { useState } from 'react';
import { 
  Terminal, Database, Globe, Shield, 
  Cpu, Code, Play, RefreshCw, 
  ChevronRight, Layout, Info, Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

const LABS = [
  { id: 'java', name: 'Java Enterprise Lab', icon: Coffee, desc: 'Sandbox para desenvolvimento backend robusto.', color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'sql', name: 'SQL Query Matrix', icon: Database, desc: 'Simulador de banco de dados relacional e queries complexas.', color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'cyber', name: 'Cyber Range', icon: Shield, desc: 'Ambiente controlado para testes de penetração e defesa.', color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 'networks', name: 'Network Simulator', icon: Globe, desc: 'Mapeamento de sub-redes e tráfego de pacotes.', color: 'text-indigo-500', bg: 'bg-indigo-50' },
];

function Coffee(props: any) {
  return <Cpu {...props} />; // Placeholder as lucide-react 'Coffee' is sometimes missing in basic sets, usando Cpu
}

export const LabsModule = () => {
    const [selectedLab, setSelectedLab] = useState(LABS[0]);

    return (
        <div className="space-y-10">
            <header>
                <div className="flex items-center gap-2 mb-2">
                    <Terminal className="text-indigo-600 w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Virtual Lab Infrastructure</span>
                </div>
                <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">NEXUS <span className="text-indigo-600">LAB MATRIX</span></h2>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Lab Selector */}
                <aside className="lg:col-span-4 space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-4">Ambientes Disponíveis</h3>
                    {LABS.map((lab) => {
                        const Icon = lab.icon;
                        const isSelected = selectedLab.id === lab.id;
                        return (
                            <button
                                key={lab.id}
                                onClick={() => setSelectedLab(lab)}
                                className={cn(
                                    "w-full flex items-start gap-4 p-6 rounded-[2rem] border-2 transition-all text-left",
                                    isSelected 
                                        ? "bg-slate-900 border-slate-900 shadow-2xl shadow-slate-200" 
                                        : "bg-white border-slate-100 hover:border-indigo-100"
                                )}
                            >
                                <div className={cn("p-3 rounded-2xl", isSelected ? "bg-white/10" : lab.bg)}>
                                    <Icon className={cn("w-6 h-6", isSelected ? "text-white" : lab.color)} />
                                </div>
                                <div>
                                    <h4 className={cn("text-sm font-black uppercase tracking-widest", isSelected ? "text-white" : "text-slate-900")}>
                                        {lab.name}
                                    </h4>
                                    <p className={cn("text-[10px] mt-1 leading-relaxed", isSelected ? "text-slate-400" : "text-slate-500 font-medium")}>
                                        {lab.desc}
                                    </p>
                                </div>
                            </button>
                        )
                    })}

                    <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white mt-10 relative overflow-hidden group">
                        <Layers className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
                        <h4 className="font-black italic uppercase tracking-tight text-xl mb-2">Labs Custom</h4>
                        <p className="text-xs text-indigo-100 mb-6 leading-relaxed">Crie seus próprios simuladores enviando uma rubrica técnica de hardware ou rede.</p>
                        <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                            Projetar Simulador
                        </button>
                    </div>
                </aside>

                {/* Lab Execution Area */}
                <main className="lg:col-span-8 flex flex-col">
                    <div className="bg-slate-900 rounded-t-[3rem] p-6 flex items-center justify-between border-b border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-rose-500" />
                                <div className="w-3 h-3 rounded-full bg-amber-500" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            </div>
                            <div className="h-6 w-px bg-slate-800 mx-2" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                                terminal@{selectedLab.id}-nexus: ~ 
                            </span>
                        </div>
                        <div className="flex gap-2">
                             <button className="p-2 text-slate-500 hover:text-white transition-colors">
                                <RefreshCw className="w-4 h-4" />
                             </button>
                             <button className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/40">
                                <Play className="w-3 h-3 fill-white" />
                                Executar
                            </button>
                        </div>
                    </div>

                    <div className="bg-[#0f172a] p-10 flex-1 min-h-[500px] font-mono text-sm leading-relaxed text-indigo-300 relative group">
                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                            <Code className="w-64 h-64" />
                        </div>
                        
                        <div className="space-y-2">
                            <p className="text-emerald-500"># Nexus Enterprise Simulation Environment</p>
                            <p className="text-slate-500"># Initializing {selectedLab.name}...</p>
                            <p className="text-slate-500"># Memory: 1.4TB Allocated | CPU: Neural Core v4</p>
                            <p>&nbsp;</p>
                            <p><span className="text-indigo-500">public class</span> <span className="text-amber-400">HelloWorld</span> {"{"}</p>
                            <p>&nbsp;&nbsp;<span className="text-indigo-500">public static void</span> <span className="text-blue-400">main</span>(String[] args) {"{"}</p>
                            <p>&nbsp;&nbsp;&nbsp;&nbsp;System.out.println(<span className="text-emerald-400">"Bem-vindo ao Nexus Lab Matrix!"</span>);</p>
                            <p>&nbsp;&nbsp;{"}"}</p>
                            <p>{"}"}</p>
                            <div className="w-2 h-4 bg-indigo-500 animate-pulse inline-block align-middle ml-1" />
                        </div>

                        {/* IA Copilot Integration during Lab */}
                        <div className="absolute bottom-10 left-10 right-10">
                            <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md flex items-center justify-between gap-6 shadow-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center">
                                         <Cpu className="text-white w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-indigo-400">Sugestão do EduJarvis</p>
                                        <p className="text-xs text-white font-medium">Parece que você está iniciando um projeto Java. Deseja que eu gere uma rubrica de avaliação para este código?</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase transition-all">Ignorar</button>
                                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-[9px] font-black uppercase transition-all">Aceitar</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-b-[3rem] p-4 text-center border-t border-slate-800">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Enterprise Sandbox v4.0.2 - Todos os logs são auditados</p>
                    </div>
                </main>
            </div>
        </div>
    );
};
