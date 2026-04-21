import React, { useState, useEffect } from 'react';
import { useTenant } from '../../../lib/TenantContext';
import { useAuth } from '../../../lib/AuthContext';
import { paymentConfigService } from '../../../services/paymentConfigService';
import { PaymentProviderConfig } from '../../../types/payment';
import { Loader2, Plus, ShieldAlert } from 'lucide-react';

export const PaymentConfigView = () => {
    const { tenant } = useTenant();
    const { profile } = useAuth();
    const [providers, setProviders] = useState<PaymentProviderConfig[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (tenant?.id) {
            paymentConfigService.getProvidersByTenant(tenant.id).then(data => {
                setProviders(data);
                setLoading(false);
            });
        }
    }, [tenant?.id]);

    if(loading) return <Loader2 className="animate-spin" />;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Gestão de Provedores de Pagamento</h1>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6 flex gap-3 text-yellow-800">
                <ShieldAlert />
                <p>Módulo em modo STANDBY. Nenhuma cobrança será executada nesta fase.</p>
            </div>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2 mb-4">
                <Plus size={18} /> Adicionar Provedor
            </button>
            <div className="grid gap-4">
                {providers.map(p => (
                    <div key={p.id} className="border p-4 rounded shadow-sm flex justify-between items-center">
                        <div>
                            <h3 className="font-bold">{p.nomeProvedor}</h3>
                            <p className="text-sm text-gray-500">{p.tipoProvedor} ({p.ambiente})</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${p.status === 'ativo' ? 'bg-green-100' : 'bg-gray-100'}`}>
                            {p.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
