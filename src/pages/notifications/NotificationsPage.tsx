import React, { useState, useEffect } from 'react';
import { 
    Bell, CheckCircle2, AlertTriangle, Info, XCircle, 
    Trash2, Mail, Clock, Filter, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Notification {
    id: string;
    titulo: string;
    mensagem: string;
    tipo: 'INFO' | 'ALERTA' | 'SUCESSO' | 'ERRO';
    lida: boolean;
    createdAt: string;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const fetchNotifications = async () => {
        try {
            const resp = await fetch('/api/notifications');
            const data = await resp.json();
            setNotifications(data);
        } catch (error) {
            console.error('Erro ao buscar notificações:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
        } catch (error) {
            console.error('Erro ao marcar como lida:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch('/api/notifications/read-all', { method: 'PATCH' });
            setNotifications(prev => prev.map(n => ({ ...n, lida: true })));
        } catch (error) {
            console.error('Erro ao marcar todas como lidas:', error);
        }
    };

    const filteredNotifications = filter === 'all' 
        ? notifications 
        : notifications.filter(n => !n.lida);

    const getIcon = (tipo: string) => {
        switch (tipo) {
            case 'SUCESSO': return <CheckCircle2 className="text-emerald-500" />;
            case 'ALERTA': return <AlertTriangle className="text-amber-500" />;
            case 'ERRO': return <XCircle className="text-rose-500" />;
            default: return <Info className="text-indigo-500" />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <header className="flex items-end justify-between">
                <div>
                   <div className="flex items-center gap-2 mb-2">
                       <Bell className="text-indigo-600 w-5 h-5" />
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Central de Comunicação</span>
                   </div>
                   <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">Notificações</h2>
                </div>

                <div className="flex gap-2">
                    <button 
                        onClick={markAllAsRead}
                        className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-600 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <Check className="w-3 h-3" />
                        Marcar todas como lidas
                    </button>
                </div>
            </header>

            <div className="flex gap-4">
                <button 
                    onClick={() => setFilter('all')}
                    className={cn(
                        "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        filter === 'all' ? "bg-slate-900 text-white" : "bg-white text-slate-400 hover:text-slate-600 border border-slate-100"
                    )}
                >
                    Todas
                </button>
                <button 
                    onClick={() => setFilter('unread')}
                    className={cn(
                        "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        filter === 'unread' ? "bg-indigo-600 text-white" : "bg-white text-slate-400 hover:text-slate-600 border border-slate-100"
                    )}
                >
                    Não lidas ({notifications.filter(n => !n.lida).length})
                </button>
            </div>

            <main className="space-y-4">
                {isLoading ? (
                    <div className="py-20 text-center space-y-4">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sincronizando com o Servidor Neural...</p>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="bg-white p-20 rounded-[3rem] border border-slate-100 text-center space-y-4 shadow-xl shadow-slate-100/50">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Bell className="w-10 h-10 text-slate-200" />
                        </div>
                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900">Silêncio Absoluto</h3>
                        <p className="text-slate-400 text-xs font-medium max-w-xs mx-auto">Você não possui notificações no momento. Relaxe e aproveite o dia!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredNotifications.map((n) => (
                            <motion.div 
                                key={n.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "p-6 bg-white rounded-[2rem] border transition-all flex gap-6 items-start group shadow-sm hover:shadow-md",
                                    n.lida ? "border-slate-100 opacity-60" : "border-indigo-100 bg-indigo-50/10 shadow-indigo-100/50"
                                )}
                            >
                                <div className={cn(
                                    "p-4 rounded-2xl",
                                    n.lida ? "bg-slate-50" : "bg-indigo-50"
                                )}>
                                    {getIcon(n.tipo)}
                                </div>
                                
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-black italic uppercase tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                                            {n.titulo}
                                        </h4>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: ptBR })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4">
                                        {n.mensagem}
                                    </p>
                                    
                                    <div className="flex gap-3">
                                        {!n.lida && (
                                            <button 
                                                onClick={() => markAsRead(n.id)}
                                                className="text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-1 hover:gap-2 transition-all"
                                            >
                                                Marcar como lida
                                            </button>
                                        )}
                                        <button className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-rose-500 transition-colors">
                                            Arquivar
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
