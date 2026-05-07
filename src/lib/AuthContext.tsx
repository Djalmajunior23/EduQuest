import React, { createContext, useContext, useEffect, useState } from 'react';
import { SAAS_PLANS } from '../constants/saas';
import { api } from './api';

const DEFAULT_PERMISSIONS: Record<string, string[]> = {
  ADMIN: [
    'gerenciar_usuarios', 'cadastrar_usuario', 'editar_usuario', 'alterar_perfil_usuario', 'redefinir_senha', 'bloquear_usuario', 'gerenciar_permissoes',
    'gerenciar_turmas', 'gerenciar_cursos', 'gerenciar_conhecimentos_tecnicos', 'gerenciar_capacidades_tecnicas',
    'criar_simulado', 'editar_simulado', 'excluir_simulado', 'criar_atividade', 
    'usar_ia_professor', 'visualizar_bi_turma', 'visualizar_relatorios_institucionais', 
    'gerenciar_tokens', 'gerenciar_gamificacao', 'gerenciar_configuracoes', 'acessar_logs'
  ],
  PROFESSOR: [
    'criar_simulado', 'editar_simulado', 'excluir_simulado', 'criar_atividade',
    'usar_ia_professor', 'visualizar_bi_turma'
  ],
  ALUNO: [
    'fazer_simulado'
  ],
  COORDINATOR: [
    'visualizar_bi_turma', 'visualizar_relatorios_institucionais', 'gerenciar_turmas', 'gerenciar_cursos', 'acessar_logs'
  ],
  SUPPORT: [
    'redefinir_senha', 'visualizar_relatorios_institucionais'
  ]
};

// Define local User interface instead of using Database's
export interface User {
  id: string;
  email: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  profile: any | null;
  profileError: string | null;
  loading: boolean;
  signInWithEmail: (email: string, senha: string) => Promise<void>;
  signUpWithEmail: (email: string, senha: string, nome: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permissionName: string) => boolean;
  hasPlanFeature: (featureName: string) => boolean;
  setBackendToken: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const [profileError, setProfileError] = useState<string | null>(null);

  const hasPermission = (permissionName: string): boolean => {
    if (!profile) return false;
    if (profile.permissoesGranulares && profile.permissoesGranulares.includes(permissionName)) {
       return true;
    }
    const defaultRolePerms = DEFAULT_PERMISSIONS[profile.perfil] || [];
    if (defaultRolePerms.includes(permissionName)) {
       return true;
    }
    return false;
  };

  const hasPlanFeature = (featureName: string): boolean => {
    if (!profile || !profile.plano) return false;
    const plan = SAAS_PLANS[profile.plano as keyof typeof SAAS_PLANS];
    return plan?.features.includes(featureName) || false;
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      const token = localStorage.getItem('eduquest_token');
      if (!token) {
        if (mounted) setLoading(false);
        return;
      }
      
      try {
        const { data } = await api.get('/api/auth/me');
        if (data && data.user && mounted) {
           setUser({ id: data.user.id, email: data.user.email });
           setProfile({
             ...data.user,
             id: data.user.id,
             role: data.user.perfil,
             tenantId: data.user.tenantId,
             saldoTokensIA: data.user.aiTokens
           });
        }
      } catch (err) {
        console.error("Failed to restore session from backend:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const setBackendToken = async (token: string) => {
    localStorage.setItem('eduquest_token', token);
// Another block inside setBackendToken
    try {
      const { data } = await api.get('/api/auth/me');
      if (data && data.user) {
        setUser({ id: data.user.id, email: data.user.email });
        setProfile({
          ...data.user,
          id: data.user.id,
          role: data.user.perfil,
          tenantId: data.user.tenantId,
          saldoTokensIA: data.user.aiTokens
        });
      }
    } catch (e) {
      console.error("Failed to fetch backend session:", e);
    }
  };

  const signInWithEmail = async (email: string, senha: string) => {
    try {
      const { data } = await api.post('/api/auth/login', { email, senha });
      await setBackendToken(data.accessToken);
    } catch(err) {
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, senha: string, nome: string) => {
    try {
      const { data } = await api.post('/api/auth/register', { email, senha, nome });
      if (data && data.user) {
         await signInWithEmail(email, senha);
      }
    } catch(err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem('eduquest_token');
      setUser(null);
      setProfile(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, profileError, loading, signInWithEmail, signUpWithEmail, logout, hasPermission, hasPlanFeature, setBackendToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
