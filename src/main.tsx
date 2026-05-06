import { StrictMode, Suspense, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';
import { isEnvValid } from './lib/env';
import './index.css';

function Main() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate initial sequence
    const init = async () => {
      try {
        if (!isEnvValid()) {
          // In production, we might want a nicer message
          // but for now we log and could show a specific recovery UI
          console.warn("Configurações de ambiente incompletas. Verifique seu arquivo .env.");
        }
        
        // Small delay for the professional feel
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (err) {
        setConfigError("Falha ao inicializar a aplicação.");
      } finally {
        setIsInitializing(false);
      }
    };

    init();
  }, []);

  if (isInitializing) {
    return <LoadingScreen />;
  }

  if (configError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-sm border border-red-100">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Erro Crítico</h2>
          <p className="text-slate-500 mb-4">{configError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-600 transition"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <StrictMode>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <App />
        </Suspense>
      </ErrorBoundary>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Main />);
