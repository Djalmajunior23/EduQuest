
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { useTenant } from '../lib/TenantContext'; // Implemented SaaS Tenant hook
import { OnboardingWizard } from './OnboardingWizard';
import { Lock, UserCircle } from 'lucide-react';

export function AuthGuard({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) {
  const { user, profile, profileError, loading, logout } = useAuth();
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

  if (!profile && !loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
         <div className="bg-slate-800 p-8 rounded-2xl border border-indigo-500/20 max-w-md w-full text-center space-y-4">
            <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
               <UserCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">Perfil não encontrado</h2>
            <p className="text-slate-400">
               Encontramos um problema ao carregar ou configurar seu ambiente de aprendizado.
            </p>
            {profileError && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 text-xs text-left p-3 rounded overflow-auto">
                <p className="font-bold mb-1">Erro retornado:</p>
                <code>{profileError}</code>
              </div>
            )}
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl w-full text-sm uppercase tracking-widest transition"
            >
              Tentar Novamente
            </button>
            <button 
              onClick={() => {
                logout();
              }}
              className="mt-2 px-6 py-3 bg-transparent border border-slate-700 text-slate-400 hover:text-white rounded-xl w-full text-sm uppercase tracking-widest transition"
            >
              Voltar ao Login
            </button>
         </div>
      </div>
    );
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
         <OnboardingWizard onComplete={() => window.location.reload()} />
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
