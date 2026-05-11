import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-10 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 mb-2">Ops! Algo deu errado</h1>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Encontramos um problema inesperado na interface. O EduJarvis já foi notificado e estamos trabalhando nisso.
            </p>
            <div className="bg-slate-50 rounded-2xl p-4 mb-8 text-left overflow-auto max-h-32">
                <code className="text-[10px] font-mono text-slate-600 block leading-tight">
                    {this.state.error?.message || 'Erro desconhecido'}
                </code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
            >
              <RefreshCw className="w-4 h-4" />
              Recarregar Sistema
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
