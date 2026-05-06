import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import { paymentConfigService } from '../../../services/paymentConfigService';
import { PaymentProviderConfig } from '../../../types/payment';
import { Loader2, Plus, ShieldAlert, Edit, Power, History, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PaymentConfigManager = () => {
    const { profile, user } = useAuth();
    const [providers, setProviders] = useState<PaymentProviderConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProvider, setEditingProvider] = useState<PaymentProviderConfig | null>(null);

    useEffect(() => {
        loadProviders();
    }, []);

    const loadProviders = async () => {
        if (profile?.tenantId) {
            const data = await paymentConfigService.getProvidersByTenant(profile.tenantId);
            setProviders(data);
            setLoading(false);
        }
    };

    const handleSave = async (data: Partial<PaymentProviderConfig>) => {
        if (!profile?.tenantId || !user?.id) return;
        await paymentConfigService.saveProvider({ ...data, tenantId: profile.tenantId }, user.id);
        setShowForm(false);
        setEditingProvider(null);
        loadProviders();
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Gateway Financeiro</h1>
                    <p className="text-slate-500 font-medium">Gestão centralizada de APIs de pagamento</p>
                </div>
                <button onClick={() => setShowForm(true)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2 hover:bg-slate-800">
                    <Plus size={16} /> Novo Provedor
                </button>
            </header>

            <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl text-amber-900 flex gap-4 items-start">
                <ShieldAlert className="shrink-0 text-amber-600" />
                <div>
                    <h3 className="font-bold">Modo de Preparação (Standby)</h3>
                    <p className="text-sm opacity-80">As integrações estão sendo cadastradas para futura ativação. Nenhuma cobrança é realizada pelo NexusIntAI no momento.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {providers.map(p => (
                    <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <span className="font-black text-xs uppercase bg-slate-100 px-3 py-1 rounded-full">{p.tipoProvedor}</span>
                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${p.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                {p.status}
                            </div>
                        </div>
                        <h3 className="font-bold text-lg mb-1">{p.nomeProvedor}</h3>
                        <p className="text-xs text-slate-500 mb-6 uppercase tracking-wider">{p.ambiente}</p>
                        
                        <div className="flex gap-2">
                             <button onClick={() => {setEditingProvider(p); setShowForm(true);}} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-xs uppercase hover:bg-slate-200 flex items-center justify-center gap-2">
                                <Edit size={14} /> Editar
                             </button>
                             <button className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:text-indigo-600">
                                <History size={16} />
                             </button>
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {showForm && (
                     <PaymentConfigModal 
                        onClose={() => {setShowForm(false); setEditingProvider(null);}} 
                        onSave={handleSave}
                        provider={editingProvider}
                     />
                )}
            </AnimatePresence>
        </div>
    );
};

const PaymentConfigModal = ({ onClose, onSave, provider }: any) => {
    const [form, setForm] = useState(provider || { nomeProvedor: '', tipoProvedor: 'stripe', ambiente: 'sandbox', status: 'standby' });
    
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
           <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-black uppercase">{provider ? 'Editar Provedor' : 'Novo Provedor'}</h2>
                 <button onClick={onClose}><X size={20} /></button>
              </div>
              
              <div className="space-y-4">
                  <input type="text" placeholder="Nome do Provedor" className="w-full p-4 bg-slate-50 rounded-xl" value={form.nomeProvedor} onChange={e => setForm({...form, nomeProvedor: e.target.value})} />
                  <select className="w-full p-4 bg-slate-50 rounded-xl" value={form.tipoProvedor} onChange={e => setForm({...form, tipoProvedor: e.target.value})}>
                      <option value="stripe">Stripe</option>
                      <option value="mercadopago">Mercado Pago</option>
                  </select>
                  <select className="w-full p-4 bg-slate-50 rounded-xl" value={form.ambiente} onChange={e => setForm({...form, ambiente: e.target.value})}>
                      <option value="sandbox">Sandbox</option>
                      <option value="producao">Produção</option>
                  </select>
              </div>
              
              <button 
                onClick={() => onSave(form)}
                className="w-full mt-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs"
              >
                  Salvar Configuração Segura
              </button>
           </motion.div>
        </motion.div>
    );
};
