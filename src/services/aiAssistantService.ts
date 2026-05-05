import { AIService } from './aiService';

export async function generateQuestions(params: {
  topic: string;
  difficulty: string;
  bloomTaxonomy: string;
  subject: string;
}): Promise<any> {
  const fullPrompt = `
    [SISTEMA]: Você é um assistente pedagógico especializado em Taxonomia de Bloom para alunos da Plataforma.
    Gere 5 questões de múltipla escolha baseadas nas seguintes diretrizes:
    - Tema / Competência: "${params.topic}"
    - Disciplina / Assunto: "${params.subject}"
    - Dificuldade Alvo: "${params.difficulty}"
    - Nível da Taxonomia de Bloom Predominante: "${params.bloomTaxonomy}"
    
    É OBRIGATÓRIO que as 5 questões respeitem o nível de dificuldade e o nível da Taxonomia solicitados.
    
    Para cada questão, forneça:
    1. O enunciado.
    2. 4 opções (A, B, C, D) e que sejam plausíveis e coerentes.
    3. O índice da opção correta (0-3).
    4. Uma explicação pedagógica detalhada sobre a resposta correta e os distratores.
    5. O nível da Taxonomia de Bloom.
    6. A dificuldade (easy, medium, hard).
  `;

  const schema = {
    type: "array",
    description: "Lista de 5 questões estruturadas conforme a taxonomia de Bloom.",
    items: {
      type: "object",
      properties: {
        text: { type: "string" },
        options: { type: "array", items: { type: "string" } },
        correctOptionIndex: { type: "number" },
        explanation: { type: "string" },
        bloomTaxonomy: { type: "string" },
        difficulty: { type: "string" }
      },
      required: ["text", "options", "correctOptionIndex", "explanation", "bloomTaxonomy", "difficulty"]
    }
  };

  try {
    return await AIService.generateJSON(fullPrompt, schema, 'PREMIUM');
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
}): Promise<string> {
  const prompt = `
    Como um arquiteto pedagógico, crie uma Situação de Aprendizagem (SA) completa e estruturada para:
    Tema: ${context.tema}
    Conhecimentos Técnicos: ${context.conhecimentos.join(', ')}
    Capacidades Técnicas: ${context.capacidades.join(', ')}
    Objetivos: ${context.objetivos}

    Estruture a SA no formato Markdown contendo:
    1. Contexto (Problema real do mercado)
    2. Desafio (O que o aluno deve resolver)
    3. Entregas (O que deve ser produzido)
    4. Critérios de Avaliação (Baseado na Inteligência Educacional Interativa)
    5. Rubrica de Avaliação
  `;

  try {
    return await AIService.generate(prompt);
  } catch (error) {
    console.error("Error generating SA:", error);
    throw new Error("Failed to generate SA. Please try again.");
  }
}

export async function generateStudySuggestions(performanceData: any): Promise<string> {
  const prompt = `
    [SISTEMA]: Você é um tutor pedagógico inteligente e cirúrgico em sua comunicação.
    [TAREFA]: Analise o desempenho do aluno: ${JSON.stringify(performanceData)}
    Com base nas questões erradas e no tempo de resposta, gere 3 sugestões de estudo personalizadas e acionáveis dirigidas ao aluno. Use Markdown.
  `;

  try {
    return await AIService.generate(prompt);
  } catch (error) {
    console.error("Error generating study suggestions:", error);
    throw new Error("Failed to generate study suggestions.");
  }
}

export async function analyzePedagogicalResults(results: any): Promise<string> {
  const prompt = `
    [SISTEMA]: Você é o motor analítico sênior do Nexus Institucional.
    [TAREFA]: Analise os resultados de desempenho da turma: ${JSON.stringify(results)}
    Retorne de forma densa e tática os pontos fortes, pontos fracos e estratégias de intervenção direta com base em competências não dominadas.
  `;

  try {
    return await AIService.generate(prompt);
  } catch (error) {
    console.error("Error analyzing results:", error);
    throw new Error("Failed to analyze pedagogical results.");
  }
}

export async function suggestQuestionMetadata(questionData: { text: string; options: string[]; correctIndex: number }): Promise<any> {
  const prompt = `
    Analise a seguinte questão de múltipla escolha e classifique pedagogicamente.

    Questão: ${questionData.text}
    Opções:
    ${questionData.options.map((opt, i) => `${String.fromCharCode(65 + i)}) ${opt}`).join('\n')}
    Alternativa Correta: ${String.fromCharCode(65 + questionData.correctIndex)}
  `;

  const schema = {
    type: "object",
    properties: {
      bloomTaxonomy: { type: "string" },
      difficulty: { type: "string" },
      explanation: { type: "string" }
    },
    required: ["bloomTaxonomy", "difficulty", "explanation"]
  };

  try {
    return await AIService.generateJSON(prompt, schema, 'PREMIUM');
  } catch (error) {
    console.error("Error suggesting metadata:", error);
    throw new Error("Failed to suggest metadata.");
  }
}

export async function generateLessonPlan(context: { unit: string; theme: string; level: string; classInsights: any }): Promise<any> {
  const prompt = `
    [SISTEMA]: Você é um arquiteto pedagógico sênior.
    [TAREFA]: Crie um plano de aula detalhado e estruturado.
    
    Unidade Curricular: ${context.unit}
    Tema da Aula: ${context.theme}
    Nível Desejado: ${context.level}
    
    Insights da turma (Desempenho e Fragilidades): ${JSON.stringify(context.classInsights)}

    O plano deve ser criativo, engajador para alunos de tecnologia e focado em competências práticas.
    
    Retorne um JSON contendo:
    {
      "duration": "Tempo total estimado",
      "activities": [
        { "activity": "nome da atividade", "time": "duração (ex: 20min)", "focus": "objetivo específico desta etapa" }
      ],
      "aiRecommendation": "recomendações pedagógicas baseadas nos insights da turma para este tema específico"
    }
  `;

  const schema = {
    type: "object",
    properties: {
      duration: { type: "string" },
      activities: { 
        type: "array", 
        items: { 
          type: "object", 
          properties: {
            activity: { type: "string" },
            time: { type: "string" },
            focus: { type: "string" }
          },
          required: ["activity", "time", "focus"]
        } 
      },
      aiRecommendation: { type: "string" }
    },
    required: ["duration", "activities", "aiRecommendation"]
  };

  try {
    return await AIService.generateJSON(prompt, schema, 'PREMIUM');
  } catch (error) {
    console.error("Error generating lesson plan:", error);
    throw new Error("Failed to generate lesson plan.");
  }
}

export async function getVirtualMentorAdvice(messageContext: any, userMessage?: string): Promise<string> {
  const prompt = `
    [SISTEMA]: Você é um Mentor Virtual motivador para escolas técnicas.
    [INFO ALUNO]: ${JSON.stringify(messageContext)}
    [MENSAGEM DO ALUNO]: ${userMessage || ''}
    
    Responda ao aluno de forma encorajadora, concisa e focada no desenvolvimento profissional e técnico dele. Use Markdown.
  `;

  try {
    return await AIService.generate(prompt);
  } catch (error) {
    console.error("Error getting mentor advice:", error);
    throw new Error("Failed to get mentor advice.");
  }
}

export async function predictStudentRisk(studentData: any): Promise<any> {
  const prompt = `
    Analise o dossiê do aluno para detectar antecipadamente o risco biológico e evasão escolar técnica:
    ${JSON.stringify(studentData)}
  `;

  const schema = {
    type: "object",
    properties: {
      riskLevel: { type: "string", description: "LOW, MEDIUM, HIGH, CRITICAL" },
      reason: { type: "string" },
      difficultyPrediction: { type: "string" },
      suggestedIntervention: { type: "string" },
      learningProfile: { type: "array", items: { type: "string" } }
    },
    required: ["riskLevel", "reason", "difficultyPrediction", "suggestedIntervention", "learningProfile"]
  };

  try {
    return await AIService.generateJSON(prompt, schema, 'PREMIUM');
  } catch (error) {
    console.error("Error predicting risk:", error);
    throw new Error("Failed to predict student risk.");
  }
}
