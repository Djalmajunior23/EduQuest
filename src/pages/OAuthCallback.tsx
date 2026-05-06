import React, { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function OAuthCallback() {
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Call getSession to ensure Supabase has parsed the tokens from the URL hash
        await supabase.auth.getSession();
        
        if (window.opener) {
          window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
          setTimeout(() => window.close(), 100);
        } else {
          window.location.href = '/';
        }
      } catch (err) {
        console.error("Error during auth callback:", err);
      }
    };
    
    // Give the client a moment to pick up the hash
    const timer = setTimeout(handleCallback, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">Conectando...</h2>
        <p className="text-slate-500 mt-2">Esta janela fechará automaticamente em instantes.</p>
      </div>
    </div>
  );
}

export default OAuthCallback;
