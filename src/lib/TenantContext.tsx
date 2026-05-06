import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';

export interface TenantConfig {
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

    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', profile.tenantId)
      .single();

    if (data) {
      setTenant(data as TenantConfig);
    } else {
      setTenant(null);
    }
    setLoadingTenant(false);
  };

  useEffect(() => {
    if (!profile?.tenantId) {
      setTenant(null);
      setLoadingTenant(false);
      return;
    }

    setLoadingTenant(true);
    fetchTenant();
    
    const channel = supabase
      .channel(`tenant-${profile.tenantId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'tenants',
          filter: `id=eq.${profile.tenantId}`,
        },
        (payload) => {
          setTenant(payload.new as TenantConfig);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
