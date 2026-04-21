import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AIService } from './aiService';

export const professorAiService = {
  /**
   * Generates complex pedagogical content based on type and context.
   * Utilizes the PREMIUM tier for heavy reasoning tasks typical for educators.
   */
  async generateContent(type: string, description: string, context?: any) {
    const systemInstruction = `Você é o 'Cérebro do Professor', uma IA de alta performance para docentes da Plataforma.
    SUA MISSÃO: Apoiar o professor na criação de materiais de excelência técnica e pedagógica.
    DIRETRIZES:
    1. Seja técnico, preciso e alinhado com a Indústria 4.0.
    2. Siga a metodologia baseada em competências (KTs e CTs).
    3. Para Materiais Didáticos: Use Markdown rico e bem estruturado.
    4. Para Análise de Turma: Seja interpretativo e sugira intervenções práticas.`;

    const prompt = `[SISTEMA]: ${systemInstruction}\n\n[TAREFA]: Gere um(a) ${type} sobre: ${description}. Contexto Adicional: ${JSON.stringify(context || {})}`;

    try {
      // Usando o PREMIUM Tier conforme definido pela Arquitetura para Planejamento/Criação Densa
      return await AIService.generateText(prompt, 'PREMIUM');
    } catch (error) {
      console.error("Professor AI Error:", error);
      throw new Error("Falha ao processar inteligência pedagógica do Professor.");
    }
  },

  /**
   * Analyzes student group performance
   */
  async analyzeClassPerformance(turmaId: string, performanceData: any) {
    const prompt = `[SISTEMA]: Você é um Analista Pedagógico Sênior. Entregue a resposta seguindo ESTRITAMENTE a estrutura JSON exigida.
    
    [TAREFA]: Analise o seguinte desempenho da turma ${turmaId}: ${JSON.stringify(performanceData)}.
    Identifique padrões de erro, alunos em risco e sugira um plano de intervenção semanal.
    A Saída deve seguir EXATAMENTE essa estrutura de variáveis json:
    { "summary": string, "criticalPoints": string[], "suggestedActions": string[] }`;

    try {
      // Chamando a engine estruturada do aiService (usando PREMIUM tier pela análise)
      const data = await AIService.generateText(prompt, 'PREMIUM');
      // Limpeza tradicional previnindo strings ```json soltas mesmo não usando o Type Enum no SDK ainda
      const cleanJson = data.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.error("Parse/Generation Error:", e);
      return { summary: "Falha na análise dos dados informados.", criticalPoints: [], suggestedActions: [] };
    }
  }
};
