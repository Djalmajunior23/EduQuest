import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Edit2, Lock, Power, Trash2, Shield, Users } from 'lucide-react';
import { cn } from '../../lib/utils';
import { normalizeArray } from '../../utils/normalizeArray';

interface User {
  id: string;
  nome: string;
  email: string;
  perfil: string;
  ativo: boolean;
}

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onToggleStatus: (userId: string, ativo: boolean) => void;
  onResetPassword: (userId: string) => void;
  onDelete: (userId: string) => void;
}

export const UserTable = ({ users, onEdit, onToggleStatus, onResetPassword, onDelete }: UserTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const safeUsers = normalizeArray(users);
  const totalPages = Math.ceil(safeUsers.length / itemsPerPage);
  
  const currentUsers = safeUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Nome</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">E-mail</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Perfil</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {currentUsers.length > 0 ? currentUsers.map((user) => (
            <motion.tr 
              key={user.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hover:bg-slate-50 transition-colors"
            >
              <td className="px-6 py-4 font-bold text-slate-900">{user.nome}</td>
              <td className="px-6 py-4 text-slate-500">{user.email}</td>
              <td className="px-6 py-4 font-bold">{user.perfil}</td>
              <td className="px-6 py-4">
                <span className={cn(
                  "px-2 py-1 rounded-lg text-[9px] font-black uppercase",
                  user.ativo ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                )}>
                  {user.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button onClick={() => onEdit(user)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 size={16} /></button>
                  <button onClick={() => onToggleStatus(user.id, !user.ativo)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"><Power size={16} /></button>
                  <button onClick={() => onResetPassword(user.id)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"><Lock size={16} /></button>
                  <button onClick={() => onDelete(user.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                </div>
              </td>
            </motion.tr>
          )) : (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                <div className="flex flex-col items-center">
                  <Users className="w-12 h-12 mb-4 text-slate-200" />
                  <p className="text-sm font-bold">Nenhum usuário encontrado</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {totalPages > 1 && (
        <div className="flex justify-between items-center p-6 border-t border-slate-100">
          <p className="text-xs text-slate-500 font-medium">
            Mostrando <span className="font-bold text-slate-900">{((currentPage - 1) * itemsPerPage) + 1}</span> a <span className="font-bold text-slate-900">{Math.min(currentPage * itemsPerPage, safeUsers.length)}</span> de <span className="font-bold text-slate-900">{safeUsers.length}</span> resultados
          </p>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
