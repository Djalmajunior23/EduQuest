import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<any>(null);
    const navigate = useNavigate();

    const token = searchParams.get('token');

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setStatus({ type: 'error', message: 'As senhas não coincidem.' });
            return;
        }

        setIsLoading(true);
        try {
            const resp = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password })
            });
            const data = await resp.json();
            if (data.success) {
                setStatus({ type: 'success', message: 'Senha redefinida com sucesso! Redirecionando...' });
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setStatus({ type: 'error', message: data.error || 'Falha ao redefinir senha.' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Erro de conexão.' });
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100 text-center space-y-6 max-w-lg">
                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
                        <AlertTriangle className="w-10 h-10 text-rose-500" />
                    </div>
                    <h1 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">Link Inválido</h1>
                    <p className="text-slate-500 font-medium">Este link de recuperação é inválido ou já foi utilizado.</p>
                    <button onClick={() => navigate('/login')} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">
                        Voltar ao Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 max-w-md w-full space-y-8"
            >
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Nova Senha</h1>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">EduQuest Security Protocol</p>
                </div>

                <form onSubmit={handleReset} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Nova Senha</label>
                            <input 
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all outline-none font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Confirmar Senha</label>
                            <input 
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all outline-none font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {status && (
                        <div className={cn(
                            "p-4 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest",
                            status.type === 'success' ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                        )}>
                            {status.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                            {status.message}
                        </div>
                    )}

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
                    >
                        {isLoading ? "Processando..." : "Redefinir Senha"}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
