import { api } from '../../../lib/api';


import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {   Settings2, Building2, Shield, Zap, Box, 
  Save, Database, History, Bell, Globe,
  CheckCircle2, AlertCircle, Loader2, Bot
} from 'lucide-react';
import { useAuth } from '../../../lib/AuthContext';
import { cn } from '../../../lib/utils';export default function InstitutionalConfigManager() {
  const { user } = useAuth();
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'IA' | 'MODULES' | 'BACKUP'>('GENERAL');

  useEffect(() => {
    async function fetchConfig() {
      const { data, error } = await api
        .from('configuracoes_institucionais')
        .select('*')
        .eq('id', 'global')
        .maybeSingle();

      if (data) {
        setConfig(data);
      } else {
        // Initial setup
        setConfig({
          id: 'global',
          nomeInstituicao: 'Inteligência Educacional Interativa - Unidade Industrial',
          logoUrl: '',
          iaRules: {
            tutorTone: 'PEDAGOGICAL',
            strictness: 'MEDIUM',
            maxTokensPerUserDay: 5000
          },
          moduloStatus: {
            abp: true,
            spacedLearning: true,
            gamification: true,
            collaboration: true
          },
          backupPolicy: 'DAILY'
        });
      }
      setLoading(false);
    }
    fetchConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await api
        .from('configuracoes_institucionais')
        .upsert({
          ...config,
          id: 'global',
          updated_at: new Date().toISOString(),
          updated_by: user?.id
        });
      if (error) throw error;
      // Simulate success toast
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Carregando Configurações...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32">
       <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 p-10 rounded-[3rem] text-white overflow-hidden relative shadow-2xl">
          <div className="relative z-10">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Gestão Institucional</h1>
            <p className="text-indigo-300 font-bold mt-2 uppercase tracking-widest text-[10px]">Painel de Controle Avançado da Plataforma</p>
          </div>
          <div className="relative z-10 flex gap-4">
             <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50"
             >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Salvar Configurações
             </button>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
       </header>

       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-2 bg-white border border-slate-200 p-4 rounded-3xl h-fit shadow-sm">
             {[
               { id: 'GENERAL', label: 'Geral e Identidade', icon: Building2 },
               { id: 'IA', label: 'Inteligência Artificial', icon: Bot },
               { id: 'MODULES', label: 'Módulos Ativos', icon: Box },
               { id: 'BACKUP', label: 'Política de Dados', icon: Database },
             ].map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={cn(
                   "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm",
                   activeTab === tab.id 
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                 )}
               >
                 <tab.icon className="w-5 h-5" />
                 {tab.label}
               </button>
             ))}
          </aside>

          <main className="lg:col-span-3">
             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm min-h-[500px]">
                {activeTab === 'GENERAL' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Nome da Instituição</label>
                           <input 
                             type="text" 
                             value={config.nomeInstituicao}
                             onChange={(e) => setConfig({...config, nomeInstituicao: e.target.value})}
                             className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-900"
                           />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">URL do Logotipo (CDN)</label>
                           <input 
                             type="text" 
                             value={config.logoUrl}
                             onChange={(e) => setConfig({...config, logoUrl: e.target.value})}
                             className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-900"
                           />
                        </div>
                     </div>
                     <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                        <h4 className="font-black text-slate-900 uppercase tracking-tighter italic mb-2 flex items-center gap-2">
                           <Shield className="w-4 h-4 text-emerald-500" /> Segurança Institucional
                        </h4>
                        <p className="text-slate-500 text-sm font-medium mb-6">Controle as políticas de acesso e segurança global.</p>
                        <div className="flex items-center gap-4">
                           <button className="flex-1 bg-white border border-slate-200 py-3 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 transition-colors">Visualizar Certificados SSL</button>
                           <button className="flex-1 bg-white border border-slate-200 py-3 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 transition-colors">Configurar SSO/OIDC</button>
                        </div>
                     </div>
                  </div>
                )}

                {activeTab === 'IA' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                     <div className="flex items-center gap-4 p-6 bg-indigo-50 border border-indigo-100 rounded-3xl">
                        <Bot className="w-10 h-10 text-indigo-600" />
                        <div>
                           <h4 className="font-bold text-indigo-900">Motor de Inteligência Pedagógica</h4>
                           <p className="text-xs text-indigo-600 font-medium">Configure as diretrizes éticas e pedagógicas da IA para todos os alunos.</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Tom do Tutor IA</label>
                           <select 
                             value={config.iaRules.tutorTone}
                             onChange={(e) => setConfig({...config, iaRules: {...config.iaRules, tutorTone: e.target.value}})}
                             className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-900"
                           >
                              <option value="PEDAGOGICAL">Socrático (Pedagógico)</option>
                              <option value="DIRECT">Direto (Instrutivo)</option>
                              <option value="ENTU">Entusiasta (Motivador)</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Cota Diária de Tokens (Por Aluno)</label>
                           <input 
                             type="number" 
                             value={config.iaRules.maxTokensPerUserDay}
                             onChange={(e) => setConfig({...config, iaRules: {...config.iaRules, maxTokensPerUserDay: parseInt(e.target.value)}})}
                             className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-900"
                           />
                        </div>
                     </div>
                  </div>
                )}

                {activeTab === 'MODULES' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(config.moduloStatus).map(([key, val]: [string, any]) => (
                           <div key={key} className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-slate-300 transition-all">
                              <div>
                                 <h4 className="font-black text-slate-900 uppercase tracking-tighter mb-1">{key}</h4>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase">Status: {val ? 'ATIVO' : 'INATIVO'}</p>
                              </div>
                              <button 
                                onClick={() => setConfig({
                                  ...config, 
                                  moduloStatus: { ...config.moduloStatus, [key]: !val }
                                })}
                                className={cn(
                                  "w-14 h-8 rounded-full transition-all relative flex items-center p-1",
                                  val ? "bg-emerald-500 justify-end" : "bg-slate-300 justify-start"
                                )}
                              >
                                 <div className="w-6 h-6 bg-white rounded-full shadow-md" />
                              </button>
                           </div>
                        ))}
                     </div>
                  </div>
                )}
             </div>
          </main>
       </div>
    </div>
  );
}
