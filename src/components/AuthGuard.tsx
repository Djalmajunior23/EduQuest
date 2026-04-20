import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { useTenant } from '../lib/TenantContext'; // Implemented SaaS Tenant hook
import { OnboardingWizard } from './OnboardingWizard';
import { Lock } from 'lucide-react';

export function AuthGuard({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) {
  const { user, profile, loading } = useAuth();
  const { isBlockedByBilling, loadingTenant } = useTenant();
  const location = useLocation();

  if (loading || loadingTenant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Suspense UI for Overdue Billing (SaaS Lock)
  // Admins might need a way out to the Billing Page, but let's block generally first.
  if (isBlockedByBilling && location.pathname !== '/admin/billing') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
         <div className="bg-slate-800 p-8 rounded-2xl border border-rose-500/20 max-w-md w-full text-center space-y-4">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
               <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">Acesso Suspenso</h2>
            <p className="text-slate-400">
               O ambiente de sua instituição encontra-se temporariamente suspenso.
               <br/><br/>
               Se você é administrador, regularize a assinatura.
            </p>
         </div>
      </div>
    )
  }

  // If user is authenticated but hasn't completed onboarding, show the Wizard hijacking the UI.
  if (profile && profile.primeiroAcessoCompleto === false) {
    return (
       <>
         <OnboardingWizard />
         {/* Render children in background, but the wizard will block interaction */}
         {children}
       </>
    );
  }

  if (requiredRole && profile?.perfil !== requiredRole && profile?.perfil !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
