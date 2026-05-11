import React, { useState } from 'react';
import { BookOpen, Plus, Search, MoreVertical, GraduationCap, Clock, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

export const CourseConfig = () => {
    const [courses] = useState([
        { id: 1, nome: 'Análise e Desenvolvimento de Sistemas', modalidade: 'PRESENCIAL', cargaHoraria: 2400, status: 'ATIVO' },
        { id: 2, nome: 'Engenharia de Software', modalidade: 'HÍBRIDO', cargaHoraria: 3200, status: 'ATIVO' },
        { id: 3, nome: 'Data Science & IA', modalidade: 'REMOTO', cargaHoraria: 2000, status: 'DRAFT' },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                    <Plus className="w-4 h-4" /> Novo Curso
                </button>

                <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-2xl w-full md:w-auto">
                    <Search className="w-4 h-4 text-slate-400 ml-2" />
                    <input 
                        type="text"
                        placeholder="Buscar cursos..."
                        className="bg-transparent border-none outline-none text-sm font-medium p-1 w-64"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {courses.map(course => (
                    <div key={course.id} className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center",
                                course.status === 'ATIVO' ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-400"
                            )}>
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <button className="p-2 text-slate-300 hover:text-slate-600">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>

                        <h4 className="text-lg font-black italic uppercase tracking-tighter text-slate-900 mb-2 truncate group-hover:text-indigo-600 transition-colors">
                            {course.nome}
                        </h4>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-100">
                                {course.modalidade}
                            </span>
                            <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-100 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {course.cargaHoraria}h
                            </span>
                        </div>

                        <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                                ))}
                                <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                                    +12
                                </div>
                            </div>
                            <span className={cn(
                                "text-[9px] font-black uppercase tracking-widest",
                                course.status === 'ATIVO' ? "text-emerald-500" : "text-amber-500"
                            )}>
                                {course.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
