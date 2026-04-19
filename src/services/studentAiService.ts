import { GoogleGenAI } from "@google/genai";
import { collection, addDoc, doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const studentAiService = {
  /**
   * Generates a pedagogical response for the student, enforcing constraints
   * and deducting tokens.
   */
  async askTutor(userId: string, currentTokens: number, prompt: string) {
    if (currentTokens < 5) {
       throw new Error("Saldo de Tokens insuficiente para esta consulta.");
    }

    const systemInstruction = `Você é o 'Cyber-Sensei', um tutor de IA especializado para alunos iniciantes em tecnologia do SENAI.
    DIRETRIZES PEDAGÓGICAS:
    1. Nunca dê a resposta pronta. Explique o CONCEITO e oriente o raciocínio.
    2. Use linguagem acessível para adolescentes (gírias leves de tech são ok, mas mantenha o respeito).
    3. Use analogias industriais ou cotidianas.
    4. Se o aluno pedir código, explique a LÓGICA primeiro. Dê apenas trechos pequenos de exemplo, nunca o exercício completo.
    5. Incentive a autonomia: termine com uma pergunta que estimule a reflexão.
    6. Se o aluno estiver frustrado, seja acolhedor e motivador.
    7. Limite a resposta a no máximo 3 parágrafos curtos.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction
        }
      });

      const tutorResponse = response.text || "Desculpe, tive um erro no meu kernel. Tente perguntar de outra forma!";

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
