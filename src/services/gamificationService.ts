import { supabase } from '../lib/supabase';

export type GamificationEventType = 
  | 'PRACTICAL_CHALLENGE_COMPLETED'
  | 'BOSS_CHALLENGE_COMPLETED'
  | 'MISSION_COMPLETED'
  | 'STREAK_CHECK'
  | 'DAILY_LOGIN'
  | 'QUIZ_COMPLETED'
  | 'ADAPTIVE_MISSION_COMPLETED';

export interface GamificationEvent {
  aluno_id: string;
  tipo_evento: GamificationEventType;
  payload: any;
  created_at?: string;
}

export const gamificationService = {
  /**
   * Logs a gamification event to Supabase.
   * This is the entry point for the n8n automation engine.
   */
  async logEvent(type: GamificationEventType, payload: any = {}) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const event: GamificationEvent = {
      aluno_id: user.user.id,
      tipo_evento: type,
      payload,
    };

    try {
      const { data, error } = await supabase
        .from('eventos_gamificacao')
        .insert(event)
        .select()
        .single();
        
      if (error) {
         console.error('Error logging gamification event:', error);
         throw error;
      }
      
      // Gamification event successfully logged
      return data?.id;
    } catch (error) {
      console.error('Error logging gamification event:', error);
      throw error;
    }
  },

  /**
   * Helper to finish a challenge
   */
  async completeChallenge(challengeId: string) {
    return this.logEvent('PRACTICAL_CHALLENGE_COMPLETED', { challengeId });
  },

  /**
   * Helper for daily login
   */
  async trackLogin() {
    return this.logEvent('DAILY_LOGIN');
  }
};
