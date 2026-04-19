import { GoogleGenAI } from "@google/genai";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const professorAiService = {
  /**
   * Generates complex pedagogical content based on type and context.
   */
  async generateContent(type: string, description: string, context?: any) {
    const systemInstruction = `Você é o 'Cérebro do Professor', uma IA de alta performance para docentes do SENAI.
    SUA MISSÃO: Apoiar o professor na criação de materiais de excelência técnica e pedagógica.
    DIRETRIZES:
    1. Seja técnico, preciso e alinhado com a Indústria 4.0.
    2. Siga a metodologia SENAI baseada em competências (KTs e CTs).
    3. Para Materiais Didáticos: Use Markdown rico e bem estruturado.
    4. Para Análise de Turma: Seja interpretativo e sugira intervenções práticas.
    5. Formate a saída de acordo com o pedido (JSON para dados estruturados, Markdown para textos).`;

    const modelName = "gemini-3-flash-preview";

    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: `Gere um(a) ${type} sobre: ${description}. Contexto Adicional: ${JSON.stringify(context || {})}`,
        config: {
          systemInstruction
        }
      });

      return response.text;
    } catch (error) {
      console.error("Professor AI Error:", error);
      throw new Error("Falha ao processar inteligência pedagógica.");
    }
  },

  async analyzeClassPerformance(turmaId: string, performanceData: any) {
    const prompt = `Analise o seguinte desempenho da turma ${turmaId}: ${JSON.stringify(performanceData)}.
    Identifique padrões de erro, alunos em risco e sugira um plano de intervenção semanal.
    Retorne um JSON com: summary, criticalPoints (array), suggestedActions (array).`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
         systemInstruction: "Você é um Analista Pedagógico Sênior do SENAI. Retorne APENAS JSON."
      }
    });

    const text = response.text;
    try {
      const cleanJson = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.error("Parse Error:", text);
      return { summary: text };
    }
  }
};
