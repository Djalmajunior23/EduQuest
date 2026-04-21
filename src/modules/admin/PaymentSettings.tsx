import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../lib/AuthContext';

export function PaymentSettings() {
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
    const docRef = doc(db, 'tenants', profile.tenantId, 'config', 'payments');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      setConfig(snap.data() as any);
    }
  };

  const handleSave = async () => {
    if (!profile?.tenantId) return;
    setLoading(true);
    try {
      const docRef = doc(db, 'tenants', profile.tenantId, 'config', 'payments');
      await setDoc(docRef, { ...config, tenantId: profile.tenantId }, { merge: true });
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
