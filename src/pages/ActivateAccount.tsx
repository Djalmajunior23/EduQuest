import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { collection, query, where, getDocs, updateDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function ActivateAccount() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [invitation, setInvitation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activating, setActivating] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function verifyToken() {
      if (!token || !email) {
        setError('Token ou e-mail de ativação ausente.');
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'convites'), 
          where('token', '==', token),
          where('email', '==', email),
          where('status', '==', 'ENVIADO')
        );
        const snap = await getDocs(q);

        if (snap.empty) {
          setError('Convite inválido, expirado ou já utilizado.');
        } else {
          const inviteDoc = snap.docs[0];
          const inviteData = inviteDoc.data();
          
          // Check expiration
          const expiresAt = inviteData.expiresAt.toDate();
          if (new Date() > expiresAt) {
            setError('Este convite expirou. Solicite um novo convite ao administrador.');
          } else {
            setInvitation({ id: inviteDoc.id, ...inviteData });
          }
        }
      } catch (err) {
        console.error(err);
        setError('Erro ao verificar convite. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }

    verifyToken();
  }, [token, email]);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    setActivating(true);
    setError(null);

    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, email!, password);
      const user = userCredential.user;

      // 2. Set Display Name
      await updateProfile(user, { displayName: invitation.nome });

      // 3. Create Firestore User Profile
      await setDoc(doc(db, 'usuarios', user.uid), {
        nome: invitation.nome,
        email: invitation.email,
        perfil: invitation.perfil,
        turmaId: invitation.turmaId || '',
        status: 'ATIVO',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ultimoLogin: serverTimestamp()
      });

      // 4. Update Invitation Status
      await updateDoc(doc(db, 'convites', invitation.id), {
        status: 'ACEITO',
        acceptedAt: serverTimestamp()
      });

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já possui uma conta ativa. Tente fazer login.');
      } else {
        setError('Algo deu errado na ativação. Contate o suporte.');
      }
    } finally {
      setActivating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
       <div className="flex items-center gap-4 text-white font-mono text-[10px] tracking-[0.3em] uppercase opacity-50">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-400" /> 
          Verificando Credenciais...
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
         <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600 rounded-full blur-[120px]" />
         <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-xl w-full relative z-10">
         <AnimatePresence mode="wait">
            {success ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[3.5rem] p-12 text-center space-y-8 shadow-2xl shadow-indigo-900/50"
              >
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                   <CheckCircle2 className="w-12 h-12" />
                </div>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                  Acesso Liberado
                </h1>
                <p className="text-slate-500 font-medium">
                  Sua conta foi ativada com sucesso. Você já pode acessar a plataforma SENAI com sua nova senha.
                </p>
                <Link 
                  to="/login"
                  className="inline-flex items-center gap-3 px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Entrar no Sistema <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[3.5rem] p-12 text-center space-y-8 shadow-2xl"
              >
                <div className="w-20 h-20 bg-red-100 text-red-600 rounded-[1.5rem] flex items-center justify-center mx-auto">
                   <AlertCircle className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">Falha na Ativação</h2>
                <p className="text-slate-500 font-medium">{error}</p>
                <Link to="/login" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline block">
                  Voltar para o Login
                </Link>
              </motion.div>
            ) : (
              <motion.div 
                key="form"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden"
              >
                <div className="p-12 space-y-10">
                   <header className="space-y-4">
                      <div className="flex items-center gap-3">
                         <ShieldCheck className="w-8 h-8 text-indigo-600" />
                         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Ativação de Protocolo</span>
                      </div>
                      <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                        Quase lá, <span className="text-indigo-600">{invitation.nome}</span>
                      </h1>
                      <p className="text-slate-500 font-medium">Defina sua senha de acesso para concluir o registro no perfil <span className="text-slate-900 font-black">{invitation.perfil}</span>.</p>
                   </header>

                   <form onSubmit={handleActivate} className="space-y-6">
                      <div className="space-y-2">
                         <label className="micro-label">Email Confirmado</label>
                         <input 
                           type="email" 
                           disabled 
                           value={email!}
                           className="w-full px-8 py-4 bg-slate-50 border-none rounded-2xl text-sm font-black text-slate-400 cursor-not-allowed opacity-60"
                         />
                      </div>

                      <div className="space-y-2">
                         <label className="micro-label">Nova Senha de Acesso</label>
                         <div className="relative">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                              type={showPassword ? "text" : "password"} 
                              required
                              placeholder="Mínimo 8 caracteres"
                              className="w-full pl-14 pr-14 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-50 transition-all"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                            <button 
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                            >
                               {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="micro-label">Confirmar Senha</label>
                         <div className="relative">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                              type={showPassword ? "text" : "password"} 
                              required
                              placeholder="Repita sua senha"
                              className="w-full pl-14 pr-14 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-50 transition-all"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                         </div>
                      </div>

                      <button 
                        type="submit"
                        disabled={activating}
                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                         {activating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                         Concluir Ativação de Conta
                      </button>
                   </form>

                   <div className="pt-6 border-t border-slate-100">
                      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <Terminal className="w-4 h-4 text-indigo-400" />
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                            Ao prosseguir, você concorda com as diretrizes de segurança institucional.
                         </p>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
}
