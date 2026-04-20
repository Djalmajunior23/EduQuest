import React from 'react';
import { motion } from 'motion/react';
import { Check, Zap, Shield, Building2, Star, ArrowRight } from 'lucide-react';
import { SAAS_PLANS } from '../../constants/saas';
import { useAuth } from '../../lib/AuthContext';
import { cn } from '../../lib/utils';

export default function SubscriptionPlans() {
  const { profile, user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      <header className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-xs font-black uppercase tracking-widest"
        >
          <Star className="w-3 h-3 fill-indigo-600" />
          Planos e Preços NEXUSINTAI
        </motion.div>
        <h1 className="text-5xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
          Potencialize seu <span className="text-indigo-600 underline decoration-indigo-200">Futuro Tech</span>
        </h1>
        <p className="text-slate-500 font-bold max-w-2xl mx-auto uppercase tracking-wide text-xs">
          Escolha o plano ideal para sua jornada. De estudantes individuais a grandes instituições, temos a solução de IA e Gamificação perfeita.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(Object.entries(SAAS_PLANS) as [string, any][]).map(([key, plan], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "relative bg-white border rounded-[2.5rem] p-8 flex flex-col transition-all",
              profile?.plano === key 
                ? "border-indigo-600 ring-4 ring-indigo-50 shadow-2xl scale-105 z-10" 
                : "border-slate-200 hover:border-indigo-200 hover:shadow-xl"
            )}
          >
            {profile?.plano === key && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                Seu Plano Atual
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 mb-1">{plan.label}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">R$ {plan.price}</span>
                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">/mês</span>
              </div>
            </div>

            <ul className="flex-1 space-y-4 mb-8">
              {plan.features.map((feature: string, fIndex: number) => (
                <li key={fIndex} className="flex items-start gap-3">
                  <div className="mt-1 bg-emerald-50 p-0.5 rounded-full">
                    <Check className="w-3 h-3 text-emerald-600" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 uppercase leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-4 pt-6 border-t border-slate-100">
               <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                  <span>Alunos</span>
                  <span className="text-slate-900">{plan.limits.students === 999999 ? 'Ilimitado' : plan.limits.students}</span>
               </div>
               <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                  <span>IA Tokens</span>
                  <span className="text-slate-900">{plan.limits.aiTokens / 1000}k</span>
               </div>
            </div>

            <button
              disabled={profile?.plano === key}
              onClick={async () => {
                 if (!user) return alert('Faça login primeiro.');
                 const confirm = window.confirm(`[SIMULAÇÃO STRIPE] Deseja simular o Checkout para o plano ${plan.label}? (Isso fará o update direto no seu usuário simulando um webhook do n8n)`);
                 if(confirm) {
                    const { doc, updateDoc } = await import('firebase/firestore');
                    const { db } = await import('../../lib/firebase');
                    try {
                      await updateDoc(doc(db, 'usuarios', user.uid), { plano: key });
                      alert('✅ Webhook Simulando Sucesso! Plano atualizado para ' + key);
                    } catch (err) {
                      alert('Erro ao atualizar plano: ' + err);
                    }
                 }
              }}
              className={cn(
                "mt-8 w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all",
                profile?.plano === key
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-slate-900 text-white hover:bg-indigo-600 shadow-xl shadow-slate-200"
              )}
            >
              {profile?.plano === key ? 'Plano Ativo' : 'Fazer Upgrade'}
              {profile?.plano !== key && <ArrowRight className="w-4 h-4" />}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
               <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">NEXUSINTAI para Instituições</h2>
               <p className="text-indigo-200 font-medium mb-8 leading-relaxed">
                  Precisa de uma solução personalizada para sua escola ou universidade? O plano Institucional oferece controle total, White-Label e suporte prioritário 24/7.
               </p>
               <div className="flex gap-4">
                  <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">
                     Falar com Consultor
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border border-white/10">
                     Ver Case de Sucesso
                  </button>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: 'SLA 99.9%', icon: Shield },
                 { label: 'Tokens Custom', icon: Zap },
                 { label: 'Relatórios BI', icon: Building2 },
                 { label: 'Integração LMS', icon: Zap },
               ].map((item, i) => (
                 <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3">
                    <item.icon className="w-6 h-6 text-indigo-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">{item.label}</span>
                 </div>
               ))}
            </div>
         </div>
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      </div>
    </div>
  );
}
