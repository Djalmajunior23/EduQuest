import { api } from '../lib/api';


import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';export interface TenantConfig {
  id: string;
  name: string;
  statusAssinatura: 'ATIVA' | 'INADIMPLENTE' | 'CANCELADA';
  limiteAlunos: number;
  limiteTokens: number;
  branding: {
    primaryColor: string;
    logoUrl?: string;
  };
}

interface TenantContextType {
  tenant: TenantConfig | null;
  loadingTenant: boolean;
  isBlockedByBilling: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();
  const [tenant, setTenant] = useState<TenantConfig | null>(null);
  const [loadingTenant, setLoadingTenant] = useState(true);

  const fetchTenant = async () => {
    if (!profile?.tenantId) return;

    try {
      const { data } = await api.get(`/api/tenants/${profile.tenantId}`);
      setTenant(data as TenantConfig);
    } catch (err) {
      console.error("Failed to fetch tenant:", err);
      setTenant(null);
    } finally {
      setLoadingTenant(false);
    }
  };

  useEffect(() => {
    if (!profile?.tenantId) {
      setTenant(null);
      setLoadingTenant(false);
      return;
    }

    setLoadingTenant(true);
    fetchTenant();
    
    // Real-time updates removed for now, or could be replaced by polling/websockets later
  }, [profile?.tenantId]);

  const isBlockedByBilling = tenant?.statusAssinatura === 'INADIMPLENTE';

  return (
    <TenantContext.Provider value={{ tenant, loadingTenant, isBlockedByBilling }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
