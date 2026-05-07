import { api } from '../../lib/api';


import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import {   Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Shield, 
  UserCheck, 
  UserMinus,
  Mail,
  Calendar,
  Lock,
  ChevronDown,
  X,
  Send,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { inviteUser } from '../../services/userManagementService';
import { BulkImportModal } from '../../components/admin/BulkImportModal';const PermissionModal = ({isOpen, onClose, user, permissions, toggle, onSave}: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl p-8">
        <h2 className="text-xl font-black uppercase italic mb-6">Permissões de {user?.nome}</h2>
        <div className="grid grid-cols-2 gap-2 mb-8">
          {['usar_ia_professor', 'gerenciar_turmas', 'gerenciar_cursos'].map(perm => (
              <button key={perm} onClick={() => toggle(perm)} className={cn("px-4 py-3 rounded-xl text-[10px] font-black uppercase text-left transition-all", permissions.includes(perm) ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600")}>
              {perm}
              </button>
          ))}
        </div>
        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 py-4 border rounded-xl font-bold uppercase text-[10px]">Cancelar</button>
          <button onClick={onSave} className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-bold uppercase text-[10px]">Salvar</button>
        </div>
      </motion.div>
    </div>
  );
};

export default function UserManager() {
  const { profile: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterDate, setFilterDate] = useState('ALL');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [newPermissions, setNewPermissions] = useState<string[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [inviteData, setInviteData] = useState({ nome: '', email: '', perfil: 'ALUNO', turmaId: '' });
  const [isInviting, setIsInviting] = useState(false);

  const fetchUsers = async () => {
    try {
      const { data, error } = await api
        .from('usuarios')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setIsInviting(true);
    try {
      await inviteUser(inviteData, currentUser.id || 'ADMIN');
      setIsModalOpen(false);
      setInviteData({ nome: '', email: '', perfil: 'ALUNO', turmaId: '' });
      fetchUsers();
    } catch (error) {
      console.error('Failed to invite user:', error);
    } finally {
      setIsInviting(false);
    }
  };

  const togglePermission = (perm: string) => {
    setNewPermissions(prev => 
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const savePermissions = async () => {
    if (!selectedUser) return;
    try {
      const { error } = await api
        .from('usuarios')
        .update({
          permissoes_granulares: newPermissions
        })
        .eq('id', selectedUser.id);
      
      if (error) throw error;
      setIsPermissionModalOpen(false);
      fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const openPermissionModal = (user: any) => {
    setSelectedUser(user);
    setNewPermissions(user.permissoes_granulares || []);
    setIsPermissionModalOpen(true);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'ALL' || u.perfil === filterRole;
    const matchesStatus = filterStatus === 'ALL' || u.status === filterStatus;
    
    let matchesDate = true;
    if (filterDate === 'LAST_30') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const createdAt = new Date(u.created_at);
        matchesDate = createdAt >= thirtyDaysAgo;
    }
    
    return matchesSearch && matchesRole && matchesStatus && matchesDate;
  });


  return (
    <div className="space-y-8 pb-12 relative">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Gestão de Usuários</h1>
          <p className="text-slate-500 font-medium mt-1">Administre as contas e permissões de alunos e professores.</p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={() => setIsImportModalOpen(true)}
             className="flex items-center gap-2 px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all"
           >
             Importar Lote
           </button>
           <button className="flex items-center gap-2 px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">
             Exportar CSV
           </button>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all"
           >
             <UserPlus className="w-4 h-4" /> Convidar Usuário
           </button>
        </div>
      </header>

      {/* Tabs / Filters Navigation */}
      <div className="flex gap-6 border-b border-slate-200">
         {['USUARIOS_ATIVOS', 'CONVITES_PENDENTES', 'AUDITORIA'].map((tab) => (
            <button 
               key={tab} 
               className={cn(
                  "pb-4 text-[10px] font-black uppercase tracking-widest transition-colors border-b-2",
                  tab === 'USUARIOS_ATIVOS' ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"
               )}
            >
               {tab.replace('_', ' ')}
            </button>
         ))}
      </div>

      {/* Invitation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden shadow-slate-900/40"
            >
              <div className="p-10 space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">Novo Convite</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-3 text-slate-400 hover:text-slate-900 transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleInvite} className="space-y-6">
                  <div className="space-y-2">
                    <label className="micro-label">Nome Completo</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: João da Silva"
                      className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-50 transition-all"
                      value={inviteData.nome}
                      onChange={(e) => setInviteData({...inviteData, nome: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="micro-label">Email Corporativo / Educacional</label>
                    <input 
                      type="email" 
                      required
                      placeholder="exemplo@instituicao.com.br"
                      className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-50 transition-all"
                      value={inviteData.email}
                      onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="micro-label">Perfil de Acesso</label>
                      <select 
                        className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-slate-200 transition-all uppercase tracking-widest text-[10px] font-black"
                        value={inviteData.perfil}
                        onChange={(e) => setInviteData({...inviteData, perfil: e.target.value})}
                      >
                        <option value="ALUNO">Aluno</option>
                        <option value="PROFESSOR">Professor</option>
                        <option value="ADMIN">Administrador</option>
                        <option value="COORDINATOR">Coordenador</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="micro-label">Turma / Grupo (Opcional)</label>
                      <input 
                        type="text" 
                        placeholder="Ex: T01-2024"
                        className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-slate-200 transition-all"
                        value={inviteData.turmaId}
                        onChange={(e) => setInviteData({...inviteData, turmaId: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-8 py-4 border border-slate-200 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      disabled={isInviting}
                      className="flex-[2] flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                      {isInviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Disparar Convite
                    </button>
                  </div>
                </form>

                <p className="text-[10px] text-center text-slate-400 font-medium">
                  Um e-mail de boas-vindas com o token de ativação será enviado automaticamente via n8n.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Filters & Search */}
      <section className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
           <input 
             type="text" 
             placeholder="Buscar por nome ou email..."
             className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-slate-900 transition-all"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <div className="flex gap-2 flex-wrap">
           {['ALL', 'ALUNO', 'PROFESSOR', 'ADMIN'].map((role) => (
             <button
               key={role}
               onClick={() => setFilterRole(role)}
               className={cn(
                 "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border",
                 filterRole === role ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
               )}
             >
               {role === 'ALL' ? 'Todos Perfis' : role}
             </button>
           ))}
           <div className="w-px h-8 bg-slate-200 mx-2" />
           {['ALL', 'ATIVO', 'PENDENTE'].map((status) => (
             <button
               key={status}
               onClick={() => setFilterStatus(status)}
               className={cn(
                 "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border",
                 filterStatus === status ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
               )}
             >
               {status === 'ALL' ? 'Todos Status' : status}
             </button>
           ))}
           <div className="w-px h-8 bg-slate-200 mx-2" />
            <button
               onClick={() => setFilterDate(filterDate === 'ALL' ? 'LAST_30' : 'ALL')}
               className={cn(
                 "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border",
                 filterDate === 'LAST_30' ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
               )}
             >
               {filterDate === 'ALL' ? 'Toda Data' : 'Últimos 30 Dias'}
             </button>
        </div>
      </section>

      {/* Users List */}
      <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Usuário</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Perfil</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Ações</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  <AnimatePresence>
                    {(filteredUsers || []).map((user) => (
                      <motion.tr 
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-indigo-400 font-black italic shadow-lg">
                                 {user.nome?.[0]}
                               </div>
                               <div>
                                  <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{user.nome}</p>
                                  <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                              user.perfil === 'ADMIN' ? "bg-purple-100 text-purple-600" :
                              user.perfil === 'PROFESSOR' ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600"
                            )}>
                              {user.perfil}
                            </span>
                         </td>
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                               <div className={cn("w-2 h-2 rounded-full", user.status === 'ATIVO' ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
                               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{user.status}</span>
                            </div>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <button className="p-3 text-slate-400 hover:text-slate-900 transition-colors">
                               <MoreVertical className="w-5 h-5" />
                            </button>
                         </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
               </tbody>
            </table>
         </div>
      </section>

      {/* Admin Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="industrial-card p-10 bg-slate-900 text-white">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Total Ativos</h3>
            <div className="flex items-baseline gap-4">
               <span className="text-5xl font-black italic uppercase tracking-tighter text-indigo-400">{(users || []).length}</span>
               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Contas</span>
            </div>
         </div>
         <div className="industrial-card p-10">
            <h3 className="micro-label mb-4">Licenças Disponíveis</h3>
            <div className="flex items-baseline gap-4">
               <span className="text-5xl font-black italic uppercase tracking-tighter text-slate-900">450</span>
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Restantes</span>
            </div>
         </div>
         <div className="industrial-card p-10 bg-blue-600 text-white">
            <h3 className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em] mb-4">Tokens de IA</h3>
            <div className="flex items-baseline gap-4">
               <span className="text-5xl font-black italic uppercase tracking-tighter">1.2M</span>
               <span className="text-xs font-bold text-blue-200 uppercase tracking-widest">Global</span>
            </div>
         </div>
      </section>

      <BulkImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onSuccess={fetchUsers} 
      />
    </div>
  );
}
