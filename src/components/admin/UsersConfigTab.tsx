import React, { useState, useEffect } from 'react';
import { Plus, Upload, Search, Filter, Mail, Shield, CheckCircle2, MoreVertical, Loader2 } from 'lucide-react';
import { UserFormModal } from '../users/UserFormModal';
import { BulkImportModal } from './BulkImportModal';
import { userService } from '../../services/userService';
import { normalizeArray } from '../../utils/normalizeArray';
import { cn } from '../../lib/utils';

export const UsersConfigTab = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setInitialLoading(true);
        try {
            const response = await userService.listarUsuarios();
            setUsers(normalizeArray(response));
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setInitialLoading(false);
        }
    };

    const handleCreateUser = async (data: any) => {
        setLoading(true);
        try {
            await userService.criarUsuario(data);
            setIsCreateModalOpen(false);
            loadUsers();
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
                    >
                        <Plus className="w-4 h-4" />
                        Cadastrar Usuário
                    </button>
                    <button 
                        onClick={() => setIsImportModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:border-indigo-100 hover:text-indigo-600 transition-all"
                    >
                        <Upload className="w-4 h-4" />
                        Importar Planilha
                    </button>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-2xl w-full md:w-auto">
                    <Search className="w-4 h-4 text-slate-400 ml-2" />
                    <input 
                        type="text"
                        placeholder="Buscar por nome ou e-mail..."
                        className="bg-transparent border-none outline-none text-sm font-medium p-1 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="p-2 bg-white rounded-xl shadow-sm hover:text-indigo-600 transition-colors">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Usuário</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Perfil</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {initialLoading ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-20 text-center">
                                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-4" />
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">Carregando usuários...</p>
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-20 text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Mail className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">Nenhum usuário encontrado</p>
                                </td>
                            </tr>
                        ) : users.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                                            {user.nome?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{user.nome}</p>
                                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                                <Mail className="w-3 h-3" /> {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-3 h-3 text-indigo-500" />
                                        <span className="text-[10px] font-black tracking-widest uppercase text-slate-500">{user.perfil}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase",
                                        user.ativo ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                                    )}>
                                        <CheckCircle2 className="w-3 h-3" />
                                        {user.ativo ? 'ATIVO' : 'INATIVO'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <UserFormModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)}
                onSave={handleCreateUser}
                loading={loading}
            />

            <BulkImportModal 
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onSuccess={() => {
                    setIsImportModalOpen(false);
                    loadUsers();
                }}
            />
        </div>
    );
};
