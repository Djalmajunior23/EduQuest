import { collection, addDoc, doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AIService } from './aiService';

export const studentAiService = {
  /**
   * Generates a pedagogical response for the student, enforcing constraints
   * and deducting tokens.
   */
  async askTutor(userId: string, currentTokens: number, prompt: string, subjectContext: string = "Tecnologia Básica") {
    if (currentTokens < 5) {
       throw new Error("Saldo de Tokens insuficiente para esta consulta.");
    }

    try {
      // Call architectural Socratic layer from central AIService
      const tutorResponse = await AIService.generate(prompt, subjectContext);

      // Record usage and deduct tokens
      const usageRef = collection(db, 'uso_ia');
      await addDoc(usageRef, {
        userId,
        prompt,
        response: tutorResponse,
        tokensConsumed: 5,
        actionType: 'EXPLANATION',
        createdAt: serverTimestamp()
      });

      const userRef = doc(db, 'usuarios', userId);
      await updateDoc(userRef, {
        saldoTokensIA: increment(-5),
        updatedAt: serverTimestamp()
      });

      return tutorResponse;
    } catch (error) {
      console.error("AI Tutor Error:", error);
      throw new Error("Falha na conexão com a rede neural do Cyber-Sensei.");
    }
  },

  async getStudyHelp(userId: string, context: string) {
    // Logic for study orientation based on student performance
  }
};
