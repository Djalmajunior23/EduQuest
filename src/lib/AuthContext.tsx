import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';
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
    // 1. Checa as permissões granulares de exceção do usuário
    if (profile.permissoesGranulares && profile.permissoesGranulares.includes(permissionName)) {
       return true;
    }
    // 2. Checa as permissões padrão do cargo associado
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
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (user) {
        const docRef = doc(db, 'usuarios', user.uid);
        
        // Listen to profile changes in real-time
        unsubscribeProfile = onSnapshot(docRef, async (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data());
            setLoading(false);
          } else {
            // Create profile for new users based on official blueprint
            const adminEmails = [
              'djalmabatistajunior@gmail.com', 
              'djalmabatistabarbosajunior@gmail.com'
            ];
            const isAdmin = user.email && adminEmails.includes(user.email);
            
            const newProfile = {
              uid: user.uid,
              email: user.email,
              nome: user.displayName || 'Usuário',
              perfil: isAdmin ? 'ADMIN' : 'ALUNO',
              plano: 'FREE',
              tenantId: isAdmin ? 'nexus_master' : 'nexus_default',
              status: 'ATIVO',
              saldoTokensIA: 50,
              xp: 0,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            };
            
            try {
              await setDoc(docRef, newProfile);
              // Profile state will be updated by onSnapshot
            } catch (err) {
              console.error("Error creating user profile:", err);
              setLoading(false);
            }
          }
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/unauthorized-domain') {
        const domain = window.location.hostname;
        const msg = `ERRO DE CONFIGURAÇÃO: O domínio "${domain}" não está autorizado no Console do Firebase. ` +
                    `Por favor, acesse o Console do Firebase -> Authentication -> Settings -> Authorized domains e adicione "${domain}".`;
        console.error(msg);
        alert(msg);
      } else {
        console.error("Login Error:", error);
        throw error;
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, logout, hasPermission, hasPlanFeature }}>
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
