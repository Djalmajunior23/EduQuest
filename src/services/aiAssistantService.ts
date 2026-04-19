import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

const MODEL_NAME = "gemini-1.5-flash";

export async function generateQuestions(prompt: string) {
  const ai = getAiClient();
  const fullPrompt = `
    Você é um assistente pedagógico especializado em Taxonomia de Bloom para alunos do SENAI.
    Gere 5 questões de múltipla escolha baseadas no seguinte tema ou competência: "${prompt}".
    
    Para cada questão, forneça:
    1. O enunciado.
    2. 4 opções (A, B, C, D).
    3. O índice da opção correta (0-3).
    4. Uma explicação pedagógica.
    5. O nível da Taxonomia de Bloom.
    6. A dificuldade (easy, medium, hard).

    Retorne APENAS um array JSON válido no formato especificado.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: fullPrompt
    });
    
    const text = response.text || "";
    const jsonText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error("Failed to generate questions. Please try again.");
  }
}

export async function generateSA(context: {
  tema: string;
  conhecimentos: string[];
  capacidades: string[];
  objetivos: string;
}) {
  const ai = getAiClient();
  const prompt = `
    Como um arquiteto pedagógico do SENAI, crie uma Situação de Aprendizagem (SA) completa e estruturada para:
    Tema: ${context.tema}
    Conhecimentos Técnicos: ${context.conhecimentos.join(', ')}
    Capacidades Técnicas: ${context.capacidades.join(', ')}
    Objetivos: ${context.objetivos}

    Estruture a SA com:
    1. Contexto (Problema real do mercado)
    2. Desafio (O que o aluno deve resolver)
    3. Entregas (O que deve ser produzido)
    4. Critérios de Avaliação (Baseado no SENAI)
    5. Rubrica de Avaliação
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt
    });
    return response.text || "";
  } catch (error) {
    console.error("Error generating SA:", error);
    throw new Error("Failed to generate SA. Please try again.");
  }
}

export async function generateStudySuggestions(performanceData: any) {
  const ai = getAiClient();
  const prompt = `
    Como um tutor pedagógico inteligente, analise o desempenho do aluno:
    ${JSON.stringify(performanceData)}
    
    Com base nas questões erradas e no tempo de resposta, gere 3 sugestões de estudo personalizadas e acionáveis.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt
    });
    return response.text || "";
  } catch (error) {
    console.error("Error generating study suggestions:", error);
    throw new Error("Failed to generate study suggestions.");
  }
}

export async function analyzePedagogicalResults(results: any) {
  const ai = getAiClient();
  const prompt = `
    Analise os seguintes resultados de desempenho de uma turma e sugira intervenções pedagógicas:
    ${JSON.stringify(results)}
    
    Forneça uma análise detalhada dos pontos fortes, fracos e sugestões de plano de aula para recuperação.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt
    });
    return response.text || "";
  } catch (error) {
    console.error("Error analyzing results:", error);
    throw new Error("Failed to analyze pedagogical results.");
  }
}
