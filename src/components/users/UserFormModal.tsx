import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Save, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../lib/AuthContext';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  user?: any;
  loading: boolean;
}

export const UserFormModal = ({ isOpen, onClose, onSave, user, loading }: UserFormModalProps) => {
  const { profile: currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    perfil: 'ALUNO',
    turmaId: '',
    cursoId: '',
    deveTrocarSenha: true,
    ativo: true
  });
  
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        email: user.email || '',
        senha: '',
        confirmarSenha: '',
        perfil: user.perfil || 'ALUNO',
        turmaId: user.turmaId || '',
        cursoId: user.cursoId || '',
        deveTrocarSenha: user.deveTrocarSenha ?? false,
        ativo: user.ativo ?? true
      });
    } else {
      setFormData({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        perfil: 'ALUNO',
        turmaId: '',
        cursoId: '',
        deveTrocarSenha: true,
        ativo: true
      });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user && formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }
    
    if (!user && formData.senha.length < 8) {
        setError('A senha deve ter no mínimo 8 caracteres');
        return;
    }
    
    const payload: any = {
      nome: formData.nome,
      email: formData.email,
      perfil: formData.perfil,
      turmaId: formData.turmaId || null,
      cursoId: formData.cursoId || null,
      deveTrocarSenha: formData.deveTrocarSenha,
      ativo: formData.ativo
    };

    if (!user) {
        payload.senha = formData.senha;
    }

    try {
      await onSave(payload);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar usuário');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 to-violet-600" />
        
        <div className="flex justify-between items-start p-8 pb-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900">
              {user ? 'Editar Usuário' : 'Novo Usuário'}
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              Preencha os dados abaixo
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1">
            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold">
                    {error}
                </div>
            )}
            <form id="user-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Nome Completo *</label>
                        <input 
                        required
                        type="text"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all outline-none text-sm font-medium"
                        placeholder="Ex: João Silva"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email Institucional *</label>
                        <input 
                        required
                        type="email"
                        disabled={!!user}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all outline-none text-sm font-medium disabled:opacity-50"
                        placeholder="joao@nexus.edu.br"
                        />
                    </div>

                    {!user && (
                        <>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Senha *</label>
                                <input 
                                required
                                type="password"
                                minLength={8}
                                value={formData.senha}
                                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all outline-none text-sm font-medium"
                                placeholder="Mínimo 8 caracteres"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Confirmar Senha *</label>
                                <input 
                                required
                                type="password"
                                value={formData.confirmarSenha}
                                onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all outline-none text-sm font-medium"
                                placeholder="Repita a senha"
                                />
                            </div>
                        </>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Curso (Opcional)</label>
                        <input 
                        type="text"
                        value={formData.cursoId}
                        onChange={(e) => setFormData({ ...formData, cursoId: e.target.value })}
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all outline-none text-sm font-medium"
                        placeholder="ID do Curso"
                        />
                    </div>
                
                    <div className="flex items-center gap-2 mt-4 ml-2 mb-4">
                        <input
                            type="checkbox"
                            checked={formData.deveTrocarSenha}
                            onChange={(e) => setFormData({ ...formData, deveTrocarSenha: e.target.checked })}
                            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <label className="text-xs font-bold text-slate-700">Forçar troca de senha no primeiro acesso</label>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Tipo de Perfil *</label>
                        <select 
                        required
                        value={formData.perfil}
                        onChange={(e) => setFormData({ ...formData, perfil: e.target.value })}
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all outline-none text-sm font-black text-slate-700"
                        >
                            <option value="ALUNO">ALUNO</option>
                            <option value="PROFESSOR">PROFESSOR</option>
                            <option value="COORDENADOR">COORDENADOR</option>
                            <option value="GESTOR">GESTOR</option>
                            <option value="SUPORTE">SUPORTE</option>
                            {currentUser?.perfil === 'ADMIN' && <option value="ADMIN">ADMIN</option>}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Status</label>
                        <select 
                        value={formData.ativo ? 'true' : 'false'}
                        onChange={(e) => setFormData({ ...formData, ativo: e.target.value === 'true' })}
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all outline-none text-sm font-black text-slate-700"
                        >
                        <option value="true">ATIVO</option>
                        <option value="false">INATIVO</option>
                        </select>
                    </div>
                </div>
            </form>
        </div>

        <div className="p-8 border-t border-slate-100 flex gap-4 flex-shrink-0">
          <button 
            type="button"
            onClick={onClose} 
            className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
          >
            Cancelar
          </button>
          <button 
            form="user-form"
            disabled={loading}
            type="submit" 
            className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? 'Salvando...' : 'Salvar Usuário'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
