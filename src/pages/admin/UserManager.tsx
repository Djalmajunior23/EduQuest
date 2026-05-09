import { UserTable } from '../../components/users/UserTable';
import { normalizeArray } from '../../utils/normalizeArray';


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
  Loader2,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { inviteUser, createUser } from '../../services/userManagementService';
import { BulkImportModal } from '../../components/admin/BulkImportModal';

const CreateUserModal = ({ isOpen, onClose, onSave, loading }: any) => {
  const [formData, setFormData] = useState({ nome: '', email: '', perfil: 'ALUNO', turmaId: '' });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ nome: '', email: '', perfil: 'ALUNO', turmaId: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 to-violet-600" />
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">Novo Cadastro</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Registro Direto no Sistema</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Nome Completo</label>
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
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email Institucional</label>
            <input 
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all outline-none text-sm font-medium"
              placeholder="joao@nexus.edu.br"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Tipo de Perfil</label>
            <select 
              value={formData.perfil}
              onChange={(e) => setFormData({ ...formData, perfil: e.target.value })}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all outline-none text-sm font-black uppercase text-[10px] tracking-widest"
            >
              <option value="ALUNO">ALUNO</option>
              <option value="PROFESSOR">PROFESSOR</option>
              <option value="ADMIN">ADMINISTRADOR</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={onClose} 
              className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button 
              disabled={loading}
              type="submit" 
              className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              {loading ? 'Salvando...' : 'Cadastrar Usuário'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const PermissionModal = ({isOpen, onClose, user, permissions, toggle, onSave}: any) => {
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
      const response = await fetch('/api/usuarios');
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      setUsers(normalizeArray(result.data));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (data: any) => {
    if (!currentUser) return;
    
    setIsInviting(true);
    try {
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Failed to create user:', error);
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
      await fetch(`/api/usuarios/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissoes_granulares: newPermissions })
      });
      setIsPermissionModalOpen(false);
      fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const openPermissionModal = (user: any) => {
    setSelectedUser(user);
    setNewPermissions(normalizeArray(user.permissoes_granulares));
    setIsPermissionModalOpen(true);
  };

  const filteredUsers = normalizeArray(users).filter(u => {
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
    <div className="space-y-10 pb-12 relative font-sans">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="bg-slate-900 p-2 rounded-xl text-indigo-400 shadow-xl">
                <Users className="w-5 h-5" />
             </div>
             <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Diretório Central de Contas</h2>
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
            Gestão de <span className="text-indigo-600">Acessos</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-xl">Administre identidades, perfis e permissões granulares da plataforma EduJarvis.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           <button 
             onClick={() => setIsImportModalOpen(true)}
             className="group flex items-center gap-3 px-6 py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm"
           >
             <Download className="w-4 h-4 rotate-180 group-hover:-translate-y-1 transition-transform" /> Importar Lote
           </button>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-slate-200 hover:bg-indigo-600 hover:scale-[1.02] active:scale-95 transition-all"
           >
             <UserPlus className="w-4 h-4" /> Cadastrar Usuário
           </button>
        </div>
      </header>

      {/* Admin Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <UserCheck className="w-24 h-24 text-white" />
            </div>
            <div className="relative z-10">
               <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-6">Total Ativos</h3>
               <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-black italic uppercase tracking-tighter text-white">{normalizeArray(users).length}</span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Identidades Registradas</span>
               </div>
               <div className="mt-8 flex items-center gap-2">
                  <div className="flex -space-x-3">
                     {[1,2,3,4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400">
                           {String.fromCharCode(64 + i)}
                        </div>
                     ))}
                  </div>
                  <span className="text-[9px] font-black uppercase text-slate-500 ml-2">+24 hoje</span>
               </div>
            </div>
         </div>

         <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-50 shadow-xl shadow-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity">
               <Shield className="w-24 h-24 text-slate-900" />
            </div>
            <div className="relative z-10">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Licenças Enterprise</h3>
               <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-black italic uppercase tracking-tighter text-slate-900">450</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Disponíveis</span>
               </div>
               <div className="mt-8 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 w-3/4" />
               </div>
            </div>
         </div>

         <div className="bg-indigo-600 p-10 rounded-[3rem] shadow-2xl shadow-indigo-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
               <Lock className="w-24 h-24 text-white" />
            </div>
            <div className="relative z-10">
               <h3 className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] mb-6">Security Pulse</h3>
               <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-black italic uppercase tracking-tighter text-white">99.2%</span>
                  <span className="text-xs font-bold text-indigo-100 uppercase tracking-widest">Score de Segurança</span>
               </div>
               <div className="mt-8 flex items-center gap-4">
                  <div className="px-3 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-widest text-white">
                     MFA Obrigatório
                  </div>
                  <div className="px-3 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-widest text-white">
                     Auditoria Ativa
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Tabs / Filters Navigation */}
      <div className="flex gap-10 border-b border-slate-100">
         {['TODOS_USUARIOS', 'CONVITES_PENDENTES', 'LOG_DE_AUDITORIA'].map((tab) => (
            <button 
               key={tab} 
               className={cn(
                  "pb-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative",
                  tab === 'TODOS_USUARIOS' ? "text-slate-900" : "text-slate-300 hover:text-slate-500"
               )}
            >
               {tab.replace(/_/g, ' ')}
               {tab === 'TODOS_USUARIOS' && (
                  <motion.div layoutId="userTab" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full" />
               )}
            </button>
         ))}
      </div>

      {/* Filters & Search - Sophisticated Panel */}
      <section className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex-1 relative w-full group">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
             <input 
               type="text" 
               placeholder="Filtrar por nome, email ou turma..."
               className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-sm font-medium focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-100">
             {['ALL', 'ALUNO', 'PROFESSOR', 'ADMIN'].map((role) => (
               <button
                 key={role}
                 onClick={() => setFilterRole(role)}
                 className={cn(
                   "px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                   filterRole === role ? "bg-white text-slate-900 shadow-md" : "text-slate-400 hover:text-slate-600"
                 )}
               >
                 {role === 'ALL' ? 'Todos' : role}
               </button>
             ))}
          </div>

          <div className="flex items-center gap-2">
             <button className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                <Filter className="w-5 h-5" />
             </button>
             <button className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-100">
                Aplicar
             </button>
          </div>
        </div>
      </section>

      {/* Users List - Refined Table */}
      <section className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-100/50 overflow-hidden">
         <div className="overflow-x-auto">
            <UserTable
              users={filteredUsers.map(u => ({
                id: u.id,
                nome: u.nome,
                email: u.email,
                perfil: u.perfil,
                ativo: u.ativo
              }))}
              onEdit={(user) => {
                setSelectedUser(user);
                // TODO: Open edit modal
              }}
              onToggleStatus={async (userId, ativo) => {
                try {
                  await fetch(`/api/usuarios/${userId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ativo })
                  });
                  fetchUsers();
                } catch (e) {
                  console.error(e);
                }
              }}
              onResetPassword={(userId) => {
                console.log('Resetting password for', userId);
              }}
              onDelete={async (userId) => {
                if (!confirm('Tem certeza?')) return;
                try {
                  await fetch(`/api/usuarios/${userId}`, { method: 'DELETE' });
                  fetchUsers();
                } catch (e) {
                  console.error(e);
                }
              }}
            />
         </div>
      </section>

      <BulkImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onSuccess={fetchUsers} 
      />

      <CreateUserModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreate}
        loading={isInviting}
      />

      <PermissionModal 
        isOpen={isPermissionModalOpen}
        onClose={() => setIsPermissionModalOpen(false)}
        user={selectedUser}
        permissions={newPermissions}
        toggle={togglePermission}
        onSave={savePermissions}
      />
    </div>
  );
}
