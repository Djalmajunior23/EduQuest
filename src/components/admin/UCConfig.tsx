import React, { useState } from 'react';
import { Layers, Plus, Search, MoreVertical, BookOpen, Clock, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

export const UCConfig = () => {
    const [ucs] = useState([
        { id: 1, nome: 'Desenvolvimento Web Front-end', modulo: 'Módulo 1', curso: 'ADS', cargaHoraria: 120 },
        { id: 2, nome: 'Estrutura de Dados em Java', modulo: 'Módulo 2', curso: 'ADS', cargaHoraria: 80 },
        { id: 3, nome: 'Banco de Dados SQL & NoSQL', modulo: 'Módulo 1', curso: 'Eng. Software', cargaHoraria: 100 },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-indigo-600 transition-all shadow-xl">
                    <Plus className="w-4 h-4" /> Nova Unidade Curricular
                </button>

                <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-2xl w-full md:w-auto">
                    <Search className="w-4 h-4 text-slate-400 ml-2" />
                    <input 
                        type="text"
                        placeholder="Buscar UCs..."
                        className="bg-transparent border-none outline-none text-sm font-medium p-1 w-64"
                    />
                </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Unidade Curricular</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Vínculo</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Carga</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {ucs.map(uc => (
                            <tr key={uc.id} className="hover:bg-slate-50/80 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                            <Layers className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{uc.nome}</p>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{uc.modulo}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        {uc.curso}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <span className="text-sm font-black italic text-slate-900">{uc.cargaHoraria}H</span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button className="p-2 text-slate-300 hover:text-slate-600">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                        <Target className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Dica da IA</p>
                        <p className="text-xs font-medium text-slate-600 italic">EduJarvis pode gerar planos de aula automaticamente para estas UCs.</p>
                    </div>
                </div>
                <button className="px-6 py-2 bg-white text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all">
                    Otimizar
                </button>
            </div>
        </div>
    );
}
