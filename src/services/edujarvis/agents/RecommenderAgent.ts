// src/services/edujarvis/agents/RecommenderAgent.ts
import { GoogleGenAI } from "@google/genai";
import { StudentCognitiveMemory } from "../types";

export class RecommenderAgent {
  private static ai: GoogleGenAI;

  private static getAI() {
    if (!this.ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY_MISSING");
      this.ai = new GoogleGenAI({ apiKey });
    }
    return this.ai;
  }

  /**
   * Cria uma trilha de aprendizagem personalizada baseada no perfil cognitivo do aluno.
   */
  public static async execute(message: string, context: { 
    profile: any; 
    digitalTwin?: any; 
    [key: string]: any 
  }) {
    const ai = this.getAI();
    const profile = context.profile;
    const twin = context.digitalTwin;
    
    const systemPrompt = `
Você é o **RecommenderIA** do EduJarvis. 
Sua especialidade é criar trilhas de aprendizagem personalizadas (Learning Paths) de alta eficácia.

### 🎯 SEU OBJETIVO:
Analisar as forças, fraquezas e estilo de aprendizado do aluno para sugerir o caminho mais curto e eficiente até a maestria do conteúdo.

### 📝 ESTRUTURA DA RESPOSTA (Markdown):
1. **Análise de Perfil**: Resumo do que você identificou (pontos fortes e gaps).
2. **Trilha Sugerida**: Sequência lógica de tópicos para estudo.
3. **Plano de Estudo**:
   - Ordem de revisão.
   - Tempo sugerido por tópico.
   - Atividades recomendadas (teoria, prática, desafios).
4. **Dica Especial**: Uma sugestão baseada no estilo de aprendizado do aluno (ex: "Como você é visual, desenhe um mapa mental...").

Seja encorajador, didático e estratégico.
`;

    const prompt = `
${systemPrompt}

### PERFIL DO ALUNO (Digital Twin):
Nível: ${twin?.nivel || profile?.nivel || "Não identificado"}
Estilo: ${twin?.estiloAprendizagem || "Misto"}
Pontos Fortes: ${Array.isArray(twin?.pontosFortes) ? twin.pontosFortes.join(", ") : "Nenhum detalhado"}
Dificuldades: ${Array.isArray(twin?.dificuldades) ? twin.dificuldades.join(", ") : "Nenhuma detalhada"}
Taxa de Acerto Geral: ${twin?.taxaAcerto ? (twin.taxaAcerto * 100).toFixed(1) + "%" : "N/A"}

### OBJETIVO DO ALUNO OU TÓPICO ATUAL:
${message || "Evolução geral no currículo"}

${context.availableContent ? `### CONTEÚDOS DISPONÍVEIS NA INSTITUIÇÃO:\n${JSON.stringify(context.availableContent, null, 2)}` : ""}
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    return result.text || "Não foi possível gerar as recomendações no momento.";
  }
}
