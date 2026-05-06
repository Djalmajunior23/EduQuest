import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Zap, Shield, Building2, Star, ArrowRight, Lock, Unlock, Clock, Loader2 } from 'lucide-react';
import { SAAS_PLANS } from '../../constants/saas';
import { useAuth } from '../../lib/AuthContext';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
// import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore'; // Removed Firebase

export default function SubscriptionPlans() {
  const { profile, user } = useAuth();
  const [liberatedPlans, setLiberatedPlans] = useState<string[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<Record<string, number>>({});
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfigs = async () => {
      const { data } = await supabase
        .from('configuracoes_institucionais')
        .select('*')
        .eq('id', 'saas')
        .single();
      
      if (data) {
        setLiberatedPlans(data.planos_liberados || []);
      }
    };

    fetchConfigs();
  }, []);

  const handleToggleLiberation = async (planKey: string) => {
    const isLiberated = liberatedPlans.includes(planKey);
    const newList = isLiberated 
      ? liberatedPlans.filter(p => p !== planKey)
      : [...liberatedPlans, planKey];
    
    try {
      await supabase
        .from('configuracoes_institucionais')
        .upsert({
          id: 'saas',
          planos_liberados: newList,
          updated_at: new Date().toISOString()
        });
      setLiberatedPlans(newList);
    } catch (err) {
      console.error("Erro ao liberar plano:", err);
    }
  };

  const handleUpgrade = async (key: string, plan: any) => {
    if (!user) return alert('Faça login primeiro.');
    
    const months = selectedMonths[key] || 1;
    const total = (plan.price * months).toFixed(2);
    
    const confirm = window.confirm(`[CHECKOUT NEXUSINTAI] 
Plano: ${plan.label}
Duração: ${months} mês(es)
Total: R$ ${total}

Deseja confirmar a assinatura?`);

    if(confirm) {
       setIsUpdating(key);
       try {
         const { error } = await supabase
           .from('usuarios')
           .update({ 
             plano: key,
             plano_expiracao: months > 1 ? new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000).toISOString() : null,
             plano_duration: months
           })
           .eq('uid', user.id);
         
         if (error) throw error;
         alert('✅ Assinatura confirmada com sucesso!');
       } catch (err) {
         alert('Erro ao atualizar plano: ' + err);
       } finally {
         setIsUpdating(null);
       }
    }
  };

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
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg whitespace-nowrap">
                Seu Plano Atual
              </div>
            )}

            {liberatedPlans.includes(key) && profile?.perfil === 'ALUNO' && profile?.plano !== key && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg whitespace-nowrap flex items-center gap-1">
                <Unlock className="w-3 h-3" />
                Liberado pela Instituição
              </div>
            )}

            <div className="mb-8">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">{plan.label || plan.name}</h3>
                {profile?.perfil === 'ADMIN' && (
                  <button 
                    onClick={() => handleToggleLiberation(key)}
                    className={cn(
                      "p-2 rounded-xl transition-all",
                      liberatedPlans.includes(key) ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400 hover:text-slate-600"
                    )}
                    title={liberatedPlans.includes(key) ? "Liberado para Alunos" : "Liberar para Alunos"}
                  >
                    {liberatedPlans.includes(key) ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </button>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">R$ {plan.price}</span>
                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">/mês</span>
              </div>
            </div>

            <ul className="flex-1 space-y-4 mb-8">
              {plan.features.map((feature: string, fIndex: number) => (
                <li key={fIndex} className="flex items-start gap-3">
                  <div className="mt-1 bg-emerald-50 p-0.5 rounded-full shrink-0">
                    <Check className="w-3 h-3 text-emerald-600" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 uppercase leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-4 pt-6 border-t border-slate-100">
               <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                  <span>Alunos</span>
                  <span className="text-slate-900">{plan.limits.students === 999999 ? 'Ilimitado' : (plan.limits.students || plan.limits.alunos)}</span>
               </div>
               <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                  <span>IA Tokens</span>
                  <span className="text-slate-900">{((plan.limits.aiTokens || plan.limits.tokensIA) / 1000).toFixed(0)}k</span>
               </div>
            </div>

            {/* Se o plano estiver liberado, habilitar opções de tempo para upgrade */}
            <AnimatePresence>
              {liberatedPlans.includes(key) && profile?.plano !== key && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 pt-6 border-t border-dashed border-slate-200 space-y-3"
                >
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Escolha o Período do Upgrade
                  </label>
                  <div className="flex gap-2">
                    {[1, 12, 16].map((m) => (
                      <button
                        key={m}
                        onClick={() => setSelectedMonths(prev => ({ ...prev, [key]: m }))}
                        className={cn(
                          "flex-1 py-2 rounded-xl text-[10px] font-bold uppercase transition-all border",
                          (selectedMonths[key] || 1) === m
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100"
                            : "bg-slate-50 border-slate-100 text-slate-400 hover:border-indigo-200"
                        )}
                      >
                        {m === 1 ? 'Mensal' : `${m} Meses`}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              disabled={profile?.plano === key || isUpdating === key}
              onClick={() => handleUpgrade(key, plan)}
              className={cn(
                "mt-8 w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all",
                profile?.plano === key
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-slate-900 text-white hover:bg-indigo-600 shadow-xl shadow-slate-200"
              )}
            >
              {isUpdating === key ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {profile?.plano === key ? 'Plano Ativo' : 'Fazer Upgrade'}
                  {profile?.plano !== key && <ArrowRight className="w-4 h-4" />}
                </>
              )}
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
                 { label: 'Upgrade 16m', icon: Zap },
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
