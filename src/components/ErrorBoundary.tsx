import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
          <div className="bg-slate-800 p-8 rounded-[2rem] border border-rose-500/20 max-w-lg w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-rose-500/10 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 text-rose-500">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-black text-white mb-2">Ops! Algo deu errado.</h1>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Nossa equipe já foi notificada. Você pode tentar recarregar a página para continuar.
            </p>
            
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-2xl w-full transition"
            >
              <RefreshCw className="w-5 h-5" />
              Recarregar Sistema
            </button>
            <div className="mt-8 text-left bg-slate-900 p-4 rounded-xl border border-slate-700 overflow-auto max-h-48 text-xs text-rose-400 font-mono">
              {this.state.error && this.state.error.toString()}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
