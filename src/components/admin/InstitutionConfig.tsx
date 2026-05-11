import React, { useState } from 'react';
import { Building, MapPin, Phone, Globe, Save, Camera } from 'lucide-react';

export const InstitutionConfig = () => {
    const [data, setData] = useState({
        nome: 'Nexus Institute of Technology',
        cnpj: '12.345.678/0001-90',
        email: 'contato@nexusinstitute.edu.br',
        telefone: '(11) 4002-8922',
        website: 'https://nexusinstitute.edu.br',
        endereco: 'Av. Paulista, 1000 - São Paulo, SP'
    });

    return (
        <div className="space-y-8 max-w-4xl">
            <div className="flex items-center gap-8 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                <div className="w-32 h-32 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center relative group overflow-hidden">
                    <Building className="w-12 h-12 text-slate-300" />
                    <button className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2">
                        <Camera className="w-6 h-6" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Alterar Logo</span>
                    </button>
                    <div className="absolute bottom-2 right-2 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <div className="flex-1">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 mb-1">{data.nome}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Building className="w-3 h-3" /> Unidade Central
                    </p>
                    <div className="mt-4 flex gap-2">
                        <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">Multitenant v2</span>
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">Plano Enterprise</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Nome da Instituição</label>
                    <div className="relative">
                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            value={data.nome}
                            onChange={e => setData({...data, nome: e.target.value})}
                            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">CNPJ</label>
                    <input 
                        type="text" 
                        value={data.cnpj}
                        onChange={e => setData({...data, cnpj: e.target.value})}
                        className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Endereço Principal</label>
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            value={data.endereco}
                            onChange={e => setData({...data, endereco: e.target.value})}
                            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Telefone</label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            value={data.telefone}
                            onChange={e => setData({...data, telefone: e.target.value})}
                            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Website</label>
                    <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            value={data.website}
                            onChange={e => setData({...data, website: e.target.value})}
                            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-6 flex justify-end">
                <button className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">
                    <Save className="w-4 h-4" /> Salvar Alterações
                </button>
            </div>
        </div>
    );
}
