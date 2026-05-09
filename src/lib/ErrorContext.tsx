import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';

interface ErrorMessage {
  id: string;
  message: string;
  type: 'ERROR' | 'WARNING';
}

interface ErrorContextType {
  reportError: (message: string) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

// Event bus for outside-of-react reporting
export const apiErrorEventBus = new EventTarget();

export const reportGlobalError = (message: string) => {
  apiErrorEventBus.dispatchEvent(new CustomEvent('api-error', { detail: message }));
};

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [errors, setErrors] = useState<ErrorMessage[]>([]);

  const reportError = (message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setErrors(prev => [...prev, { id, message, type: 'ERROR' }]);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
      removeError(id);
    }, 8000);
  };

  const removeError = (id: string) => {
    setErrors(prev => prev.filter(e => e.id !== id));
  };

  useEffect(() => {
    const handler = (e: any) => {
      reportError(e.detail);
    };
    apiErrorEventBus.addEventListener('api-error', handler);
    return () => apiErrorEventBus.removeEventListener('api-error', handler);
  }, []);

  return (
    <ErrorContext.Provider value={{ reportError }}>
      {children}
      
      {/* Global Error UI Overlay */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none">
        <AnimatePresence>
          {errors.map((err) => (
            <motion.div
              key={err.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="pointer-events-auto bg-white border-l-4 border-red-500 rounded-xl shadow-2xl p-4 flex items-start gap-4 ring-1 ring-black/5"
            >
              <div className="bg-red-50 p-2 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900">Falha na Conexão</h4>
                <p className="text-sm text-slate-600 mt-1">{err.message}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-3 flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Tentar novamente
                </button>
              </div>

              <button 
                onClick={() => removeError(err.id)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
}
