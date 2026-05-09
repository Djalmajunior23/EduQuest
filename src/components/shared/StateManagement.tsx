import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, RefreshCcw, Search, Loader2 } from 'lucide-react';

export const LoadingState = ({ message = 'Carregando dados...' }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center">
    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
    <p className="text-slate-500 font-medium animate-pulse">{message}</p>
  </div>
);

export const EmptyState = ({ 
  title = 'Nenhum item encontrado', 
  message = 'Não há dados para exibir no momento.',
  icon: Icon = Search,
  action
}: { 
  title?: string; 
  message?: string;
  icon?: any;
  action?: React.ReactNode;
}) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200"
  >
    <div className="bg-white p-4 rounded-2xl shadow-sm mb-6">
      <Icon className="w-10 h-10 text-slate-300" />
    </div>
    <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-500 max-w-xs mb-8">{message}</p>
    {action}
  </motion.div>
);

export const ErrorState = ({ 
  error = 'Ocorreu um erro ao carregar os dados.',
  onRetry 
}: { 
  error?: string;
  onRetry?: () => void;
}) => (
  <div className="flex flex-col items-center justify-center p-12 text-center bg-red-50 rounded-[2rem] border border-red-100">
    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
    <h3 className="text-lg font-black text-red-900 mb-2 uppercase italic tracking-tighter">Erro de Sistema</h3>
    <p className="text-red-600 mb-8 max-w-md">{error}</p>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-200"
      >
        <RefreshCcw className="w-4 h-4" />
        Tentar Novamente
      </button>
    )}
  </div>
);

export const SkeletonLoader = ({ count = 3, height = '150px' }: { count?: number, height?: string }) => (
  <div className="space-y-4 w-full">
    {Array.from({ length: count }).map((_, i) => (
      <div 
        key={i} 
        className="bg-slate-100 animate-pulse rounded-2xl w-full" 
        style={{ height }}
      />
    ))}
  </div>
);
