import React from 'react';
import { motion } from 'motion/react';
import { Edit2, Lock, Power, Trash2, Shield } from 'lucide-react';
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
  return (
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
        {normalizeArray(users).map((user) => (
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
        ))}
      </tbody>
    </table>
  );
};
