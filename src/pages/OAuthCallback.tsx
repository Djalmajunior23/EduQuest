import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export function OAuthCallback() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setBackendToken } = useAuth(); // Assuming we add this to AuthContext

  useEffect(() => {
    let mounted = true;
    
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const errParam = params.get('error');

        if (errParam) {
           console.error("Erro OAuth do backend:", errParam);
           if (mounted) navigate(`/login?error=${errParam}`);
           return;
        }

        if (!token) {
           console.warn("Nenhum token encontrado após OAuth");
           if (mounted) navigate("/login?error=no_token");
           return;
        }

        // Set token in AuthContext
        await setBackendToken(token);

        if (mounted) {
          navigate('/');
        }
      } catch (err: any) {
        console.error("Error during auth callback:", err);
        if (mounted) {
          setError(err.message || 'Falha ao processar a autenticação.');
        }
      }
    };
    
    handleCallback();

    return () => {
      mounted = false;
    };
  }, [navigate, location, setBackendToken]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 border-t-4 border-indigo-500">
      <div className="text-center p-8 bg-slate-800 rounded-[2.5rem] border border-slate-700/50 max-w-sm w-full mx-4 shadow-2xl">
        {error ? (
           <>
             <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-500">
               <AlertCircle className="w-8 h-8" />
             </div>
             <h2 className="text-xl font-bold text-white mb-2">Ops! Algo deu errado</h2>
             <p className="text-slate-400 mb-8">{error}</p>
             <button onClick={() => window.location.href = '/login'} className="w-full bg-slate-700 hover:bg-slate-600 text-white px-6 py-4 rounded-2xl font-bold transition">
               Voltar para o Login
             </button>
           </>
        ) : (
           <>
             <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-400">
               <Loader2 className="w-8 h-8 animate-spin" />
             </div>
             <h2 className="text-2xl font-bold text-white mb-2">Conectando...</h2>
             <p className="text-slate-400">Preparando seu ambiente de aprendizado.</p>
           </>
        )}
      </div>
    </div>
  );
}

export default OAuthCallback;

