import React, { useState } from 'react';
import { 
    Mail, Send, Shield, Zap, Layout, Settings, 
    CheckCircle2, AlertCircle, Eye, TestTube,
    Smartphone, Bell, BarChart3, PieChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export function CommunicationSettings() {
    const [provider, setProvider] = useState('resend');
    const [testEmail, setTestEmail] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [status, setStatus] = useState<any>(null);

    const handleSendTest = async () => {
        if (!testEmail) return;
        setIsSending(true);
        setStatus(null);
        
        try {
            // Mock API call to trigger test email from backend
            const resp = await fetch('/api/admin/communication/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to: testEmail, provider })
            });
            const data = await resp.json();
            if (data.success) {
                setStatus({ type: 'success', message: 'E-mail de teste enviado com sucesso!' });
            } else {
                setStatus({ type: 'error', message: 'Falha ao enviar: ' + data.error });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Erro na comunicação com o servidor.' });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="space-y-10">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'E-mails Enviados', value: '1.2k', icon: Mail, color: 'text-indigo-600' },
                    { label: 'Taxa de Entrega', value: '99.8%', icon: CheckCircle2, color: 'text-emerald-600' },
                    { label: 'Taxa de Abertura', value: '42%', icon: Eye, color: 'text-blue-600' },
                    { label: 'Alertas IA', value: '156', icon: Zap, color: 'text-amber-600' },
                ].map((stat, i) => (
                    <div key={i} className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
                        <stat.icon className={cn("w-5 h-5 mb-4", stat.color)} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                        <p className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Provider Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                        <Zap className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900">Provedor de E-mail</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Motor de Entrega Transacional</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { id: 'resend', name: 'Resend', desc: 'Recomendado para SaaS', icon: Zap },
                        { id: 'brevo', name: 'Brevo', desc: 'Ideal para Marketing', icon: Send },
                        { id: 'ses', name: 'Amazon SES', desc: 'Escalabilidade Extrema', icon: Shield },
                        { id: 'smtp', name: 'Custom SMTP', desc: 'Servidor Próprio', icon: Settings },
                    ].map(p => (
                        <button 
                            key={p.id}
                            onClick={() => setProvider(p.id)}
                            className={cn(
                                "p-6 rounded-[2rem] border-2 text-left transition-all group",
                                provider === p.id 
                                    ? "border-indigo-600 bg-indigo-50/30 shadow-lg shadow-indigo-100" 
                                    : "border-slate-50 bg-white hover:border-slate-200"
                            )}
                        >
                            <p.icon className={cn(
                                "w-6 h-6 mb-4 transition-transform group-hover:scale-110",
                                provider === p.id ? "text-indigo-600" : "text-slate-300"
                            )} />
                            <h4 className="font-black italic uppercase tracking-tight text-slate-900 mb-1">{p.name}</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{p.desc}</p>
                        </button>
                    ))}
                </div>
            </section>

            {/* Test Console */}
            <section className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1 space-y-2">
                        <h4 className="text-sm font-black italic uppercase tracking-tight text-slate-900">Console de Teste</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">Envie um e-mail de boas-vindas para validar as variáveis de ambiente (${provider.toUpperCase()}_API_KEY).</p>
                    </div>
                    <div className="w-full md:w-auto flex gap-2">
                        <input 
                            type="email"
                            placeholder="seu@email.com"
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                            className="flex-1 md:w-64 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all shadow-sm"
                        />
                        <button 
                            onClick={handleSendTest}
                            disabled={isSending || !testEmail}
                            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSending ? (
                                <TestTube className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                            Testar
                        </button>
                    </div>
                </div>

                {status && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "mt-6 p-4 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest",
                            status.type === 'success' ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                        )}
                    >
                        {status.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        {status.message}
                    </motion.div>
                )}
            </section>

            {/* Notification Channels */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                        <Bell className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900">Canais Ativos</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Central Multi-canal Nexus</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {[
                        { channel: 'E-mail Transacional', status: 'Ativo', icon: Mail, color: 'text-indigo-500' },
                        { channel: 'In-App Notifications', status: 'Ativo', icon: Bell, color: 'text-amber-500' },
                        { channel: 'Push Web (Service Worker)', status: 'Pendente', icon: Smartphone, color: 'text-slate-300' },
                    ].map(ch => (
                        <div key={ch.channel} className="p-5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-4">
                                <ch.icon className={cn("w-5 h-5", ch.color)} />
                                <span className="text-xs font-black uppercase tracking-tight text-slate-700">{ch.channel}</span>
                            </div>
                            <span className={cn(
                                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                ch.status === 'Ativo' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                            )}>
                                {ch.status}
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
