import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  Shield, 
  Calendar,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { updateUserProfile } from '../services/userManagementService';

export default function Profile() {
  const { profile, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nome: profile?.nome || '',
    telefone: profile?.telefone || '',
    fotoUrl: profile?.fotoUrl || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateUserProfile(user.uid, formData, user.uid);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError('Erro ao atualizar perfil. Verifique sua conexão.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <header>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Meu Perfil</h1>
        <p className="text-slate-500 font-medium mt-1">Gerencie suas informações pessoais e configurações de conta.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Profile Stats/Info Sidebar */}
        <aside className="space-y-8">
           <div className="industrial-card p-8 flex flex-col items-center text-center">
              <div className="relative group mb-6">
                 <div className="w-32 h-32 rounded-[2.5rem] bg-slate-900 flex items-center justify-center text-indigo-400 text-4xl font-black italic uppercase shadow-2xl overflow-hidden">
                    {formData.fotoUrl ? (
                      <img src={formData.fotoUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      profile?.nome?.[0]
                    )}
                 </div>
                 <button className="absolute -bottom-2 -right-2 p-3 bg-white border border-slate-200 rounded-2xl shadow-lg text-slate-600 hover:text-blue-600 transition-all active:scale-90">
                    <Camera className="w-5 h-5" />
                 </button>
              </div>
              <h2 className="text-xl font-black italic uppercase tracking-tight text-slate-900">{profile?.nome}</h2>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-2">{profile?.perfil}</span>
           </div>

           <div className="industrial-card p-8 space-y-6">
              <h3 className="micro-label">Dados de Registro</h3>
              <div className="space-y-4">
                 <div className="flex items-center gap-3 text-slate-500">
                    <Shield className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">ID: {user?.uid.slice(0, 8)}...</span>
                 </div>
                 <div className="flex items-center gap-3 text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Membro desde: 2024</span>
                 </div>
              </div>
           </div>
        </aside>

        {/* Form Area */}
        <main className="lg:col-span-2 space-y-8">
           <form onSubmit={handleSubmit} className="industrial-card p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="micro-label">Nome Completo</label>
                    <div className="relative">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input 
                         type="text" 
                         value={formData.nome}
                         onChange={(e) => setFormData({...formData, nome: e.target.value})}
                         className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-slate-900 transition-all"
                         required
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="micro-label">Email Institucional</label>
                    <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input 
                         type="email" 
                         value={profile?.email}
                         disabled
                         className="w-full pl-12 pr-4 py-4 bg-slate-100 border-none rounded-2xl text-sm font-medium text-slate-400 cursor-not-allowed"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="micro-label">Telefone de Contato</label>
                    <div className="relative">
                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input 
                         type="tel" 
                         value={formData.telefone}
                         onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                         className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-slate-900 transition-all"
                         placeholder="(00) 00000-0000"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="micro-label">URL do Avatar</label>
                    <div className="relative">
                       <Camera className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input 
                         type="url" 
                         value={formData.fotoUrl}
                         onChange={(e) => setFormData({...formData, fotoUrl: e.target.value})}
                         className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-slate-900 transition-all"
                         placeholder="https://..."
                       />
                    </div>
                 </div>
              </div>

              <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="flex-1">
                    <h4 className="text-xs font-black uppercase text-slate-900 mb-1 flex items-center gap-2">
                       <Lock className="w-3 h-3" /> Segurança da Conta
                    </h4>
                    <p className="text-[10px] font-medium text-slate-500">Alterações de perfil e e-mail exigem auditoria do administrador.</p>
                 </div>

                 <div className="flex items-center gap-4 w-full md:w-auto">
                    <AnimatePresence>
                       {success && (
                          <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 text-emerald-600 font-black uppercase text-[10px]"
                          >
                             <CheckCircle2 className="w-4 h-4" /> Salvo com sucesso
                          </motion.div>
                       )}
                       {error && (
                          <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 text-red-600 font-black uppercase text-[10px]"
                          >
                             <AlertCircle className="w-4 h-4" /> {error}
                          </motion.div>
                       )}
                    </AnimatePresence>
                    
                    <button 
                      type="submit"
                      disabled={loading}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                       {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                       Atualizar Dados
                    </button>
                 </div>
              </div>
           </form>

           <section className="industrial-card p-10 bg-slate-900 text-white overflow-hidden relative">
              <div className="relative z-10">
                 <h3 className="text-xl font-black italic uppercase tracking-tighter mb-4">Zona de Perigo</h3>
                 <p className="text-slate-400 text-sm max-w-md mb-8">Solicite a desativação da sua conta ou relate problemas de privacidade aqui.</p>
                 <button className="px-8 py-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500/20 transition-all">
                    Sinalizar Incidente
                 </button>
              </div>
              <Shield className="absolute -right-8 -bottom-8 w-32 h-32 text-white/5 opacity-50" />
           </section>
        </main>
      </div>
    </div>
  );
}
