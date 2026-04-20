import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
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

  useEffect(() => {
    if (!profile?.tenantId) {
      setTenant(null);
      setLoadingTenant(false);
      return;
    }

    setLoadingTenant(true);
    const tenantRef = doc(db, 'tenants', profile.tenantId);
    
    const unsubscribe = onSnapshot(tenantRef, (docSnap) => {
      if (docSnap.exists()) {
        setTenant({ id: docSnap.id, ...docSnap.data() } as TenantConfig);
      } else {
        setTenant(null);
      }
      setLoadingTenant(false);
    }, (error) => {
      console.error("Error loading tenant data", error);
      setTenant(null);
      setLoadingTenant(false);
    });

    return () => unsubscribe();
  }, [profile?.tenantId]);

  // Se o SaaS block está ativo para esse tenant
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
