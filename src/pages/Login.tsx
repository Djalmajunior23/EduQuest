import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Mail, Lock, AlertCircle, User } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const { signInWithEmail, signUpWithEmail, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [emailError, setEmailError] = useState('');
  const [authError, setAuthError] = useState('');

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError('Por favor, insira um e-mail válido.');
    } else {
      setEmailError('');
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('E-mail inválido.');
      return;
    }
    if (password.length < 6) {
      setAuthError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    setAuthError('');

    try {
      if (isSignUp) {
        if (!name.trim()) {
           setAuthError('Informe seu nome completo.');
           setLoading(false);
           return;
        }
        await signUpWithEmail(email, password, name);
        // Display an alert or handled state below
        setAuthError('Conta criada! Verifique seu email para confirmação ou faça login.');
        setIsSignUp(false);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setAuthError(error.message || 'Erro de autenticação. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-4 rounded-2xl mb-4 shadow-lg shadow-blue-200">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">EduQuest</h1>
          <p className="text-slate-500 mt-2 text-center">
            Plataforma educacional para estudantes de Desenvolvimento de Sistemas.
          </p>
        </div>

        {authError && (
          <div className={`p-4 rounded-xl mb-6 text-sm flex items-start gap-3 ${authError.includes('criada') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-100'}`}>
             <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
             <p>{authError}</p>
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
          {isSignUp && (
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
               <div className="relative">
                 <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                 <input
                   type="text"
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   placeholder="Seu nome"
                   className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                   required={isSignUp}
                 />
               </div>
             </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="seu@email.com"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  emailError ? 'border-red-500' : 'border-slate-200'
                } focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                required
              />
            </div>
            {emailError && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {emailError}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !!emailError}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-blue-200 mt-2"
          >
            {loading ? 'Aguarde...' : (isSignUp ? 'Criar Conta' : 'Entrar')}
          </button>
        </form>

        <div className="text-center mb-6">
           <button 
             type="button" 
             onClick={() => { setIsSignUp(!isSignUp); setAuthError(''); }}
             className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
           >
             {isSignUp ? 'Já tem uma conta? Fazer Login' : 'Não tem conta? Criar Conta'}
           </button>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-center text-slate-400 px-4">
            Ao entrar, você concorda com nossos termos de uso e política de privacidade.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
