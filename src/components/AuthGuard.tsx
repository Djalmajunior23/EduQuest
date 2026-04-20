import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { OnboardingWizard } from './OnboardingWizard';

export function AuthGuard({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
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
