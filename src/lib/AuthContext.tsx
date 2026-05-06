import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { SAAS_PLANS } from '../constants/saas';

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

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permissionName: string) => boolean;
  hasPlanFeature: (featureName: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

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
    const fetchProfile = async (userId: string) => {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('uid', userId)
        .single();

      if (data) {
        setProfile(data);
      } else if (!error || error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const adminEmails = [
            'djalmabatistajunior@gmail.com', 
            'djalmabatistabarbosajunior@gmail.com'
          ];
          const isAdmin = user.email && adminEmails.includes(user.email);
          
          const newProfile = {
            uid: user.id,
            email: user.email,
            nome: user.user_metadata?.full_name || 'Usuário',
            perfil: isAdmin ? 'ADMIN' : 'ALUNO',
            plano: 'FREE',
            tenantId: isAdmin ? 'nexus_master' : 'nexus_default',
            status: 'ATIVO',
            saldoTokensIA: 50,
            xp: 0,
            updatedAt: new Date().toISOString()
          };

          const { data: createdProfile, error: createError } = await supabase
            .from('usuarios')
            .upsert(newProfile)
            .select()
            .single();

          if (createError) {
            console.error("Error creating user profile:", createError);
          } else {
            setProfile(createdProfile);
          }
        }
      }
      setLoading(false);
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        fetchProfile(currentUser.id);
        
        // Subscribe to profile changes
        const channel = supabase
          .channel(`profile-${currentUser.id}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'usuarios',
              filter: `uid=eq.${currentUser.id}`,
            },
            (payload) => {
              setProfile(payload.new);
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        // Trigger generic getSession to ensure state is updated
        supabase.auth.getSession();
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          skipBrowserRedirect: true,
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, 'oauth_popup', 'width=600,height=700');
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Email Login Error:", error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });
      if (error) throw error;
      
      // Optionally alert the user if email confirmation is required by Supabase settings:
      // alert("Verifique seu e-mail para confirmar a conta.");
    } catch (error: any) {
      console.error("Email Sign Up Error:", error);
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, logout, hasPermission, hasPlanFeature }}>
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
