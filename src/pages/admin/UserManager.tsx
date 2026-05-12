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
import { normalizeArray } from '../../utils/normalizeArray';
import { UserTable } from '../../components/users/UserTable';
import { UserFormModal } from '../../components/users/UserFormModal';
import { BulkImportModal } from '../../components/admin/BulkImportModal';
import { listarUsuarios } from '../../services/userService';
import { api } from '../../lib/api';


const PermissionModal = ({isOpen, onClose, user, permissions, toggle, onSave}: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl p-8">
        <h2 className="text-xl font-black uppercase italic mb-6">Permissões de {user?.nome}</h2>
        <div className="grid grid-cols-2 gap-2 mb-8">
          {normalizeArray(['usar_ia_professor', 'gerenciar_turmas', 'gerenciar_cursos']).map(perm => (
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
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [newPermissions, setNewPermissions] = useState<string[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: any = { 
        page: pagination.page, 
        limit: pagination.limit 
      };
      if (searchTerm) params.search = searchTerm;
      if (filterRole !== 'ALL') params.perfil = filterRole;
      if (filterStatus !== 'ALL') params.status = filterStatus;

      const result = await listarUsuarios(params);
      if (result.success) {
        setUsers(normalizeArray(result.data));
        setPagination(result.pagination);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, searchTerm, filterRole, filterStatus]);

  const handleSaveUser = async (data: any) => {
    if (!currentUser) return;
    
    setIsSaving(true);
    try {
      const url = selectedUser ? `/api/usuarios/${selectedUser.id}` : '/api/usuarios';
      
      const { data: result, error } = selectedUser 
        ? await api.put(url, data)
        : await api.post(url, data);

      if (error) throw new Error(error);
      
      setIsModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Failed to save user:', error);
      throw error;
    } finally {
      setIsSaving(false);
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
      const { error } = await api.put(`/api/usuarios/${selectedUser.id}`, { permissoes_granulares: newPermissions });
      if (error) throw new Error(error);
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
            Gestão de <span className="text-indigo-600">Usuários</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-xl">Administre identidades, perfis e permissões granulares da plataforma EduQuest.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           <button 
             onClick={() => setIsImportModalOpen(true)}
             className="group flex items-center gap-3 px-6 py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm"
           >
             <Download className="w-4 h-4 rotate-180 group-hover:-translate-y-1 transition-transform" /> Importar Lote
           </button>
           <button 
             onClick={() => {
                setSelectedUser(null);
                setIsModalOpen(true);
             }}
             className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-slate-200 hover:bg-indigo-600 hover:scale-[1.02] active:scale-95 transition-all"
           >
             <UserPlus className="w-4 h-4" /> Novo Usuário
           </button>
        </div>
      </header>

      {/* Admin Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-slate-900 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
               <Users className="w-20 h-20 text-white" />
            </div>
            <div className="relative z-10">
               <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">Total de Registros</h3>
               <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black italic uppercase tracking-tighter text-white">{normalizeArray(users).length}</span>
               </div>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-50 shadow-xl shadow-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
               <UserCheck className="w-20 h-20 text-slate-900" />
            </div>
            <div className="relative z-10">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Alunos</h3>
               <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">{normalizeArray(users).filter(u => u.perfil === 'ALUNO').length}</span>
               </div>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-50 shadow-xl shadow-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
               <Shield className="w-20 h-20 text-indigo-600" />
            </div>
            <div className="relative z-10">
               <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Professores e Admins</h3>
               <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black italic uppercase tracking-tighter text-indigo-900">
                    {normalizeArray(users).filter(u => ['PROFESSOR', 'ADMIN', 'GESTOR', 'COORDENADOR'].includes(u.perfil)).length}
                  </span>
               </div>
            </div>
         </div>

         <div className="bg-rose-50 p-8 rounded-[2rem] shadow-xl shadow-rose-100 text-rose-600 relative overflow-hidden group border border-rose-100">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
               <UserMinus className="w-20 h-20" />
            </div>
            <div className="relative z-10">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4">Inativos</h3>
               <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black italic uppercase tracking-tighter">{normalizeArray(users).filter(u => !u.ativo).length}</span>
               </div>
            </div>
         </div>
      </section>

      {/* Filters & Search - Sophisticated Panel */}
      <section className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex-1 relative w-full group">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
             <input 
               type="text" 
               placeholder="Busca global por nome ou e-mail..."
               className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-sm font-medium focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-100 overflow-x-auto">
             {normalizeArray(['ALL', 'ALUNO', 'PROFESSOR', 'ADMIN', 'GESTOR']).map((role) => (
               <button
                 key={role}
                 onClick={() => setFilterRole(role)}
                 className={cn(
                   "px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                   filterRole === role ? "bg-white text-slate-900 shadow-md" : "text-slate-400 hover:text-slate-600"
                 )}
               >
                 {role === 'ALL' ? 'Todos' : role}
               </button>
             ))}
          </div>

           <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-100">
             {normalizeArray(['ALL', 'ATIVO', 'INATIVO']).map((status) => (
               <button
                 key={status}
                 onClick={() => setFilterStatus(status)}
                 className={cn(
                   "px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                   filterStatus === status ? "bg-white text-slate-900 shadow-md" : "text-slate-400 hover:text-slate-600"
                 )}
               >
                 {status === 'ALL' ? 'Status' : status}
               </button>
             ))}
          </div>

        </div>
      </section>

      {/* Users List - Refined Table */}
      <section id="user-directory-panel" className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-100/50 overflow-hidden">
         <div className="overflow-x-auto">
            <UserTable
              users={normalizeArray(users).map(u => ({
                id: u.id,
                nome: u.nome,
                email: u.email,
                platform_email: u.platform_email,
                perfil: u.perfil,
                ativo: u.ativo
              }))}
              onEdit={(user) => {
                setSelectedUser(users.find(u => u.id === user.id));
                setIsModalOpen(true);
              }}
              onToggleStatus={async (userId, ativo) => {
                try {
                  const { error } = await api.patch(`/api/usuarios/${userId}/status`, { ativo });
                  if (error) throw new Error(error);
                  fetchUsers();
                } catch (e) {
                  console.error(e);
                }
              }}
              onResetPassword={async (userId) => {
                const novaSenha = prompt('Digite a nova senha para este usuário (mínimo 8 caracteres):');
                if (!novaSenha || novaSenha.length < 8) {
                    if (novaSenha) alert('A senha deve ter no mínimo 8 caracteres.');
                    return;
                }
                
                try {
                  const { error } = await api.patch(`/api/usuarios/${userId}/reset-password`, { novaSenha });
                  if (error) throw new Error(error);
                  alert('Senha redefinida com sucesso. O usuário precisará alterá-la no próximo login.');
                } catch (e) {
                  console.error(e);
                  alert('Erro ao redefinir senha.');
                }
              }}
              onDelete={async (userId) => {
                if (!confirm('Você tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita.')) return;
                try {
                  const { error } = await api.delete(`/api/usuarios/${userId}`);
                  if (error) {
                    alert(error || 'Erro ao deletar usuário.');
                  }
                  fetchUsers();
                } catch (e) {
                  console.error(e);
                }
              }}
            />
         </div>
         {/* Pagination Controls */}
         <div className="px-8 py-6 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">
                Página {pagination.page} de {pagination.totalPages || 1}
            </p>
            <div className="flex items-center gap-2">
                <button 
                    disabled={pagination.page === 1}
                    onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                    className="px-4 py-2 bg-slate-100 rounded-lg text-xs font-bold uppercase hover:bg-slate-200 disabled:opacity-50"
                >
                    Anterior
                </button>
                <button 
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                    className="px-4 py-2 bg-slate-100 rounded-lg text-xs font-bold uppercase hover:bg-slate-200 disabled:opacity-50"
                >
                    Próxima
                </button>
            </div>
         </div>
      </section>

      <BulkImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onSuccess={fetchUsers} 
      />

      <UserFormModal 
        isOpen={isModalOpen}
        onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
        }}
        onSave={handleSaveUser}
        user={selectedUser}
        loading={isSaving}
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
