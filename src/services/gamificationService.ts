import { api } from '../lib/api';



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
   * Logs a gamification event to Database.
   * This is the entry point for the n8n automation engine.
   */
  async logEvent(type: GamificationEventType, payload: any = {}) {
    const { data: user } = { data: { user: { id: '' } } };
    if (!user.user) throw new Error('User not authenticated');

    const event: GamificationEvent = {
      aluno_id: user.user.id,
      tipo_evento: type,
      payload,
    };

    try {
      const { data, error } = await api
        .from('eventos_gamificacao')
        .insert(event)
        .select()
        .maybeSingle();
        
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
   * Helper for daily login and streak logic
   */
  async trackLogin() {
    const { data: authData } = { data: { user: { id: '' } } };
    if (!authData.user) return;
    
    try {
      // Log the event
      await this.logEvent('DAILY_LOGIN').catch(e => console.error(e));

      // Get current user profile
      const { data: userProfile, error } = await api
        .from('usuarios')
        .select('uid, xp, ai_tokens, streak, last_login_date')
        .eq('uid', authData.user.id)
        .maybeSingle();
        
      if (error || !userProfile) return;

      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      const lastLoginDateStr = userProfile.last_login_date;
      
      let newStreak = userProfile.streak || 0;
      let newXp = userProfile.xp || 0;
      let newAiTokens = userProfile.ai_tokens || 0;
      let updated = false;

      if (!lastLoginDateStr) {
         // First time
         newStreak = 1;
         updated = true;
      } else {
         const lastLoginDate = new Date(lastLoginDateStr);
         const diffTime = today.getTime() - lastLoginDate.getTime();
         const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
         
         if (diffDays === 1) {
            // Consecutive day
            newStreak += 1;
            updated = true;
         } else if (diffDays > 1) {
            // Streak broken
            newStreak = 1;
            updated = true;
         }
      }

      if (updated) {
         // Check for 7-day streak bonus
         if (newStreak > 0 && newStreak % 7 === 0) {
            newXp += 500; // Bonus XP
            newAiTokens += 100; // Bonus AI Tokens
            
            // Log streak bonus 
            await this.logEvent('STREAK_CHECK', { streak: newStreak, bonusXp: 500, bonusTokens: 100 });
         }

         await api
            .from('usuarios')
            .update({ 
               streak: newStreak, 
               last_login_date: todayStr,
               xp: newXp,
               ai_tokens: newAiTokens
            })
            .eq('uid', authData.user.id);
      }
      
      return newStreak;
    } catch (e) {
      console.error('Error updating streak:', e);
    }
  }
};
