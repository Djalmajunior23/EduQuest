// src/services/sessionService.ts
import { supabase } from '../lib/supabase';

export interface ClassSession {
  id?: string;
  tenantId: string;
  professorId: string;
  turmaId: string;
  atividadeId: string; // Pode ser Lab, Simulador, Questão, Caso
  tipoAtividade: 'LAB' | 'SIMULADOR' | 'CASO' | 'EXAM';
  status: 'ACTIVE' | 'FINISHED';
  startedAt: any;
  studentsProgress: {
    [studentId: string]: {
      nome: string;
      currentStep?: string;
      status: 'WORKING' | 'HELP_NEEDED' | 'FINISHED';
      lastUpdate: any;
      performanceScore?: number;
    }
  };
}

export const sessionService = {
  async startSession(session: Omit<ClassSession, 'id' | 'startedAt' | 'studentsProgress'>) {
    const { data, error } = await supabase
      .from('sessoes_ativas')
      .insert({
        ...session,
        started_at: new Date().toISOString(),
        students_progress: {}
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  },

  async finishSession(sessionId: string) {
    const { error } = await supabase
      .from('sessoes_ativas')
      .update({ 
        status: 'FINISHED', 
        finished_at: new Date().toISOString() 
      })
      .eq('id', sessionId);
    
    if (error) throw error;
  },

  subscribeToSession(sessionId: string, callback: (session: ClassSession) => void) {
    const fetchSession = async () => {
      const { data } = await supabase
        .from('sessoes_ativas')
        .select('*')
        .eq('id', sessionId)
        .single();
      if (data) callback(data as ClassSession);
    };

    fetchSession();

    const channel = supabase
      .channel(`session-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sessoes_ativas',
          filter: `id=eq.${sessionId}`,
        },
        (payload) => {
          callback(payload.new as ClassSession);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  async updateStudentProgress(sessionId: string, studentId: string, progress: any) {
    // Para atualizar JSONB parcial em Supabase sem RPC complexo, 
    // o ideal é buscar e atualizar ou usar a lógica de merge no cliente
    const { data: session } = await supabase
      .from('sessoes_ativas')
      .select('students_progress')
      .eq('id', sessionId)
      .single();

    const currentProgress = session?.students_progress || {};
    currentProgress[studentId] = {
      ...progress,
      lastUpdate: new Date().toISOString()
    };

    const { error } = await supabase
      .from('sessoes_ativas')
      .update({
        students_progress: currentProgress
      })
      .eq('id', sessionId);
    
    if (error) throw error;
  }
};
