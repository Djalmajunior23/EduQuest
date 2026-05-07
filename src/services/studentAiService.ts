import { api } from '../lib/api';


import { AIService } from './aiService';export const studentAiService = {
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

      // Record usage and deduct tokens in Database
      const { error: usageError } = await api
        .from('uso_ia')
        .insert({
          user_id: userId,
          prompt,
          response: tutorResponse,
          tokens_consumed: 5,
          action_type: 'EXPLANATION',
          created_at: new Date().toISOString()
        });
      
      if (usageError) console.error("Error logging AI usage:", usageError);

      const { error: userError } = await api
        .from('usuarios')
        .update({
          saldo_tokens_ia: currentTokens - 5,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (userError) throw userError;

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
