import { api } from '../../lib/api';


import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';export function PaymentSettings() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({ stripeApiKey: '', mercadoPagoApiKey: '' });

  useEffect(() => {
    if (profile?.tenantId) {
      loadConfig();
    }
  }, [profile?.tenantId]);

  const loadConfig = async () => {
    if (!profile?.tenantId) return;
    const { data, error } = await api
      .from('tenant_configs')
      .select('*')
      .eq('tenant_id', profile.tenantId)
      .eq('config_key', 'payments')
      .maybeSingle();
    
    if (data) {
      setConfig(data.config_value);
    }
  };

  const handleSave = async () => {
    if (!profile?.tenantId) return;
    setLoading(true);
    try {
      const { error } = await api
        .from('tenant_configs')
        .upsert({
          tenant_id: profile.tenantId,
          config_key: 'payments',
          config_value: config,
          updated_at: new Date().toISOString()
        }, { onConflict: 'tenant_id,config_key' });
      
      if (error) throw error;
      alert('Configurações salvas com sucesso!');
    } catch (e) {
      console.error(e);
      alert('Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold mb-4">Configurações de Pagamento</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Stripe API Key</label>
          <input 
            type="password"
            value={config.stripeApiKey}
            onChange={e => setConfig({...config, stripeApiKey: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mercado Pago API Key</label>
          <input 
            type="password"
            value={config.mercadoPagoApiKey}
            onChange={e => setConfig({...config, mercadoPagoApiKey: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {loading ? 'Salvando...' : 'Salvar Configurações'}
        </button>
      </div>
    </div>
  );
}
