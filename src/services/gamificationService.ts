import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { auth } from '../lib/firebase';

export type GamificationEventType = 
  | 'PRACTICAL_CHALLENGE_COMPLETED'
  | 'BOSS_CHALLENGE_COMPLETED'
  | 'MISSION_COMPLETED'
  | 'STREAK_CHECK'
  | 'DAILY_LOGIN'
  | 'QUIZ_COMPLETED'
  | 'ADAPTIVE_MISSION_COMPLETED';

export interface GamificationEvent {
  alunoId: string;
  tipoEvento: GamificationEventType;
  payload: any;
  createdAt: any;
}

export const gamificationService = {
  /**
   * Logs a gamification event to Firestore.
   * This is the entry point for the n8n automation engine.
   */
  async logEvent(type: GamificationEventType, payload: any = {}) {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const event: GamificationEvent = {
      alunoId: user.uid,
      tipoEvento: type,
      payload,
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, 'eventos_gamificacao'), event);
      // Gamification event successfully logged
      return docRef.id;
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
