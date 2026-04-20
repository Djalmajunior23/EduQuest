import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../lib/AuthContext';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CheckCircle2, ShieldCheck, UserCircle, Rocket } from 'lucide-react';

export function OnboardingWizard() {
  const { user, profile } = useAuth();
  const [step, setStep] = useState(1);
  const [telefone, setTelefone] = useState(profile?.telefone || '');
  const [loading, setLoading] = useState(false);

  // If already complete or loading, don't show.
  // Actually, the AuthGuard will only render this if it IS incomplete.
  if (profile?.primeiroAcessoCompleto) return null;

  const handleAcceptTerms = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'usuarios', user!.uid), {
        termosAceitosEm: serverTimestamp(),
      });
      setStep(2);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'usuarios', user!.uid), {
        telefone,
      });
      setStep(3);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'usuarios', user!.uid), {
        primeiroAcessoCompleto: true,
      });
      // Auth data reloads automatically via snapshot
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col"
      >
        <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
             <h2 className="text-3xl font-black italic uppercase tracking-tighter">Bem-vindo(a), {profile?.nome}!</h2>
             <p className="opacity-80 mt-2 font-medium">Vamos preparar sua conta para a melhor experiência.</p>
          </div>
          <Rocket className="absolute -right-8 -bottom-8 w-48 h-48 text-white/10" />
        </div>

        <div className="p-8 flex-1">
          <div className="flex gap-4 mb-8">
             {[1, 2, 3].map(s => (
                <div key={s} className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden relative">
                   <motion.div 
                      className="absolute inset-y-0 left-0 bg-indigo-600"
                      initial={{ width: 0 }}
                      animate={{ width: step >= s ? '100%' : '0%' }}
                      transition={{ duration: 0.5 }}
                   />
                </div>
             ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                     <ShieldCheck className="w-6 h-6" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-800">Termos e Condições</h3>
                </div>
                <div className="h-48 overflow-y-auto p-4 bg-slate-50 rounded-xl text-sm text-slate-600 mb-6 border border-slate-100">
                  <p className="font-bold mb-2">1. Aceite e Consentimento (LGPD)</p>
                  <p className="mb-4">Ao continuar, você concorda que o SENAI pode coletar e tratar seus dados acadêmicos para fins estritamente pedagógicos...</p>
                  <p className="font-bold mb-2">2. Uso da Plataforma</p>
                  <p>A plataforma EduQuest deve ser utilizada para atividades acadêmicas. O uso indevido pode acarretar em bloqueio da conta.</p>
                </div>
                <button 
                  onClick={handleAcceptTerms} disabled={loading}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  {loading ? 'Processando...' : 'Li e concordo com os Termos'} <CheckCircle2 className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                     <UserCircle className="w-6 h-6" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-800">Complete seu Perfil</h3>
                </div>
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Telefone / WhatsApp</label>
                    <input 
                      type="text" 
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    <p className="text-xs text-slate-400 mt-2">Para recebermos alertas importantes de turmas e simulados.</p>
                  </div>
                </div>
                <button 
                  onClick={handleUpdateProfile} disabled={loading}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold uppercase tracking-wider transition-all"
                >
                  Salvar e Continuar
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center py-8"
              >
                <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Rocket className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 mb-2">Tudo Pronto!</h3>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">Seu ambiente está configurado. Prepare-se para uma experiência imersiva e inteligente no EduQuest.</p>
                <button 
                  onClick={handleFinish} disabled={loading}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold uppercase tracking-wider transition-all"
                >
                  Decolar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
