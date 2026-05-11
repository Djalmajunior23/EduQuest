import React, { useState } from 'react';
import { Bot, Save, AlertCircle, Cpu, Zap, ShieldCheck } from 'lucide-react';

export const EduJarvisSettings = () => {
    const [settings, setSettings] = useState({
        model: 'gemini-1.5-pro',
        tokenLimit: 2000,
        temp: 0.7,
        fallbackEnabled: true,
        recoveryEnabled: true,
        pedagogicalTone: 'supportive'
    });

    const handleSave = () => {
        // Implement save logic
        console.log('Saving EduJarvis settings:', settings);
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl">
                    <Cpu className="text-indigo-600 mb-4" />
                    <h4 className="font-bold text-slate-900 mb-2">Modelo de IA</h4>
                    <select 
                        value={settings.model}
                        onChange={(e) => setSettings({...settings, model: e.target.value})}
                        className="w-full bg-white border-2 border-transparent rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-600"
                    >
                        <option value="gemini-1.5-pro">Gemini 1.5 Pro (Enterprise)</option>
                        <option value="gemini-1.5-flash">Gemini 1.5 Flash (Performance)</option>
                        <option value="gpt-4o">GPT-4o (Standard)</option>
                    </select>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl">
                    <Zap className="text-emerald-600 mb-4" />
                    <h4 className="font-bold text-slate-900 mb-2">Limite de Tokens</h4>
                    <input 
                        type="number"
                        value={settings.tokenLimit}
                        onChange={(e) => setSettings({...settings, tokenLimit: parseInt(e.target.value)})}
                        className="w-full bg-white border-2 border-transparent rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:border-emerald-600"
                    />
                </div>

                <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl">
                    <ShieldCheck className="text-amber-600 mb-4" />
                    <h4 className="font-bold text-slate-900 mb-2">Fallback de Segurança</h4>
                    <div className="flex items-center gap-2 mt-2">
                        <input 
                            type="checkbox"
                            checked={settings.fallbackEnabled}
                            onChange={(e) => setSettings({...settings, fallbackEnabled: e.target.checked})}
                            className="w-5 h-5 text-indigo-600 rounded-lg"
                        />
                        <span className="text-sm font-bold text-slate-700">Ativado</span>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Bot className="text-indigo-600" />
                    Regras de Comportamento do EduJarvis
                </h3>
                
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <div>
                            <p className="font-bold text-slate-900">Modo de Recuperação Automática</p>
                            <p className="text-xs text-slate-500">EduJarvis cria planos de aula extras para alunos em risco.</p>
                        </div>
                        <input 
                            type="checkbox"
                            checked={settings.recoveryEnabled}
                            onChange={(e) => setSettings({...settings, recoveryEnabled: e.target.checked})}
                            className="w-6 h-6 text-indigo-600 rounded-lg"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Tom Pedagógico</label>
                        <select 
                            value={settings.pedagogicalTone}
                            onChange={(e) => setSettings({...settings, pedagogicalTone: e.target.value})}
                            className="w-full bg-white border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-700 outline-none focus:border-indigo-600"
                        >
                            <option value="supportive">Apoio e Incentivo (Recomendado)</option>
                            <option value="technical">Técnico e Direto</option>
                            <option value="challenging">Desafiador e Provocativo</option>
                        </select>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button 
                        onClick={handleSave}
                        className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                    >
                        <Save className="w-4 h-4" />
                        Salvar Configurações de IA
                    </button>
                </div>
            </div>

            <div className="p-6 border-2 border-dashed border-indigo-100 rounded-[2rem]">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-indigo-100 rounded-2xl">
                        <AlertCircle className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-1">Dica de Performance</h4>
                        <p className="text-sm text-slate-500 max-w-xl">
                            Utilizar o modelo <strong>Gemini 1.5 Flash</strong> reduz a latência das respostas em até 40%, ideal para chats de suporte rápido aos alunos.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
