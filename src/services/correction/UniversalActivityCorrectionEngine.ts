
import { AIService } from '../aiService';
import { 
  CorrectionRequest, 
  CorrectionResult, 
  ExecutionResult, 
  CodeAnalysis 
} from '../../types/correction';

export class CodeExecutionService {
  async execute(params: {
    language: string;
    code: string;
    testCases: {
      input: string;
      expectedOutput: string;
      weight?: number;
    }[];
  }): Promise<ExecutionResult> {
    if (!params.testCases || params.testCases.length === 0) {
      return { executed: false, passedTests: 0, totalTests: 0, testResults: [] };
    }

    const prompt = `
Você é um interpretador de código sandbox de alta precisão.
Sua tarefa é executar o seguinte código na linguagem ${params.language} contra os casos de teste fornecidos.

CÓDIGO:
${params.code}

CASOS DE TESTE:
${JSON.stringify(params.testCases, null, 2)}

A execução deve ocorrer sem acesso à internet e em ambiente isolado.
Para cada caso de teste:
1. Simule a execução lógica do código linha a linha.
2. Capture a saída standard (stdout).
3. Compare com a saída esperada.
4. Identifique erros de runtime ou loops infinitos.

Retorne EXCLUSIVAMENTE um JSON:
{
  "executed": true,
  "testResults": [
    {
      "input": "...",
      "expectedOutput": "...",
      "actualOutput": "...",
      "passed": boolean,
      "error": "string se falha de runtime"
    }
  ],
  "runtimeError": "string"
}
`;

    try {
      const response = await AIService.generateJSON(prompt, {
        type: "object",
        properties: {
          executed: { type: "boolean" },
          testResults: {
            type: "array",
            items: {
              type: "object",
              properties: {
                input: { type: "string" },
                expectedOutput: { type: "string" },
                actualOutput: { type: "string" },
                passed: { type: "boolean" },
                error: { type: "string" }
              },
              required: ["input", "expectedOutput", "actualOutput", "passed"]
            }
          },
          runtimeError: { type: "string" }
        },
        required: ["executed", "testResults"]
      });

      const result = response as ExecutionResult;
      result.passedTests = result.testResults.filter(r => r.passed).length;
      result.totalTests = result.testResults.length;
      return result;
    } catch (e) {
      console.error("AI Execution failed", e);
      return { executed: false, passedTests: 0, totalTests: params.testCases.length, testResults: [] };
    }
  }
}

export class CodeAnalyzerService {
  async analyze(params: {
    code: string;
    language: string;
    description: string;
    rubric?: any;
  }): Promise<CodeAnalysis> {
    const prompt = `
Analise o código abaixo para a atividade: "${params.description}" na linguagem ${params.language}.
${params.rubric ? `CONSIDERE ESTA RUBRICA NA SUA AVALIAÇÃO:\n${JSON.stringify(params.rubric, null, 2)}` : ''}

CÓDIGO:
${params.code}

Foque em: Sintaxe, Lógica, Boas Práticas, Segurança e Organização.
Gere uma análise linha por linha.
${params.rubric ? "Você deve gerar um campo 'rubricResults' no JSON de retorno com a pontuação e feedback para cada critério da rubrica." : ""}

Retorne JSON:
{
  "languageDetected": "string",
  "syntaxOk": boolean,
  "logicalIssues": ["string"],
  "goodPractices": ["string"],
  "improvements": ["string"],
  "lineByLine": [
    { "line": number, "code": "string", "comment": "string", "type": "erro" | "alerta" | "melhoria" | "correto" }
  ]
  ${params.rubric ? ', "rubricResults": [{"criterion": "string", "score": number, "feedback": "string"}]' : ""}
}
`;
    try {
        const schema: any = {
            type: "object",
            properties: {
                languageDetected: { type: "string" },
                syntaxOk: { type: "boolean" },
                logicalIssues: { type: "array", items: { type: "string" } },
                goodPractices: { type: "array", items: { type: "string" } },
                improvements: { type: "array", items: { type: "string" } },
                lineByLine: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            line: { type: "number" },
                            code: { type: "string" },
                            comment: { type: "string" },
                            type: { type: "string", enum: ["erro", "alerta", "melhoria", "correto"] }
                        }
                    }
                }
            },
            required: ["languageDetected", "syntaxOk", "logicalIssues", "goodPractices", "improvements", "lineByLine"]
        };

        if (params.rubric) {
            schema.properties.rubricResults = {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        criterion: { type: "string" },
                        score: { type: "number" },
                        feedback: { type: "string" }
                    }
                }
            };
        }

        return await AIService.generateJSON(prompt, schema) as CodeAnalysis;
    } catch (e) {
        return { syntaxOk: true, logicalIssues: [], goodPractices: [], improvements: [] } as CodeAnalysis;
    }
  }
}

export class AICorrectionService {
  async correctSA(request: CorrectionRequest): Promise<any> {
    const prompt = `Avalie esta SA: ${request.title}\nDescrição: ${request.description}\nResposta: ${request.studentAnswer || request.studentCode}\nRetorne JSON com suggestedScore, generalFeedback, studentFeedback, teacherFeedback, strengths, weaknesses, improvementPlan, competencyResults, nextSteps.`;
    return AIService.generateJSON(prompt, { type: "object", properties: { suggestedScore: { type: "number" }, generalFeedback: { type: "string" }, studentFeedback: { type: "string" }, teacherFeedback: { type: "string" }, strengths: { type: "array", items: { type: "string" } }, weaknesses: { type: "array", items: { type: "string" } }, improvementPlan: { type: "string" }, competencyResults: { type: "array", items: { type: "object", properties: { competency: { type: "string" }, performance: { type: "string" } } } }, nextSteps: { type: "array", items: { type: "string" } } } });
  }

  async correctText(request: CorrectionRequest): Promise<any> {
    const prompt = `Avalie esta resposta discursiva: ${request.title}\nResposta: ${request.studentAnswer}\nRetorne JSON com suggestedScore, generalFeedback, studentFeedback, teacherFeedback, strengths, weaknesses, improvementPlan, nextSteps.`;
    return AIService.generateJSON(prompt, { type: "object", properties: { suggestedScore: { type: "number" }, generalFeedback: { type: "string" }, studentFeedback: { type: "string" }, teacherFeedback: { type: "string" }, strengths: { type: "array", items: { type: "string" } }, weaknesses: { type: "array", items: { type: "string" } }, improvementPlan: { type: "string" }, nextSteps: { type: "array", items: { type: "string" } } } });
  }
}

export class UniversalActivityCorrectionEngine {
  constructor(
    private codeExecutionService: CodeExecutionService,
    private codeAnalyzerService: CodeAnalyzerService,
    private aiCorrectionService: AICorrectionService
  ) {}

  async correct(request: CorrectionRequest): Promise<CorrectionResult> {
    const technicalTypes = ["code", "sql", "database", "cybersecurity", "network", "iot", "modeling"];
    if (technicalTypes.includes(request.activityType)) {
      // For technical activities, if studentCode is present, use code evaluation
      if (request.studentCode || (request.studentAnswer && (request.studentAnswer.includes('```') || request.studentAnswer.length > 50))) {
         return this.correctCodeActivity(request);
      }
    }

    if (request.activityType === "sa" || request.activityType === "case_study" || request.activityType === "practical") {
      return this.correctSAActivity(request);
    }

    return this.correctTextActivity(request);
  }

  private async correctCodeActivity(request: CorrectionRequest): Promise<CorrectionResult> {
    const executionResult = await this.codeExecutionService.execute({
      language: request.programmingLanguage || 'javascript',
      code: request.studentCode || request.studentAnswer || '',
      testCases: request.testCases || []
    });

    const codeAnalysis = await this.codeAnalyzerService.analyze({
      code: request.studentCode || request.studentAnswer || '',
      language: request.programmingLanguage || 'javascript',
      description: request.description,
      rubric: request.rubric
    });

    const testScore =
      executionResult.totalTests > 0
        ? (executionResult.passedTests / executionResult.totalTests) * request.maxScore * 0.7
        : 0;

    const qualityScore = codeAnalysis.syntaxOk ? request.maxScore * 0.3 : request.maxScore * 0.1;

    const finalSuggestedScore = Math.min(request.maxScore, Math.round((testScore + qualityScore) * 10) / 10);

    return {
      correctionType: "code_execution",
      finalSuggestedScore,
      confidenceLevel: executionResult.totalTests > 0 ? "alto" : "médio",
      requiresTeacherReview: true,
      executionResult,
      codeAnalysis,
      rubricResults: codeAnalysis.rubricResults,
      generalFeedback: "Correção realizada com execução simulada de código e análise pedagógica baseada em IA.",
      studentFeedback: this.generateStudentCodeFeedback(executionResult, codeAnalysis),
      teacherFeedback: "Revise a nota sugerida. Os testes foram validados por simulação lógica de IA.",
      strengths: codeAnalysis.goodPractices,
      weaknesses: codeAnalysis.logicalIssues,
      improvementPlan: "Revisar os testes que falharam e melhorar a organização do código acompanhando a análise linha a linha.",
      nextSteps: [
        "Corrigir erros apontados",
        "Executar novamente os testes mentalmente",
        "Comparar saída esperada com saída real"
      ]
    };
  }

  private async correctSAActivity(request: CorrectionRequest): Promise<CorrectionResult> {
    const aiResult = await this.aiCorrectionService.correctSA(request);

    return {
      correctionType: "sa_pedagogical_analysis",
      finalSuggestedScore: aiResult.suggestedScore,
      confidenceLevel: "médio",
      requiresTeacherReview: true,
      generalFeedback: aiResult.generalFeedback,
      studentFeedback: aiResult.studentFeedback,
      teacherFeedback: aiResult.teacherFeedback,
      strengths: aiResult.strengths,
      weaknesses: aiResult.weaknesses,
      improvementPlan: aiResult.improvementPlan,
      nextSteps: aiResult.nextSteps,
      competencyResults: aiResult.competencyResults
    };
  }

  private async correctTextActivity(request: CorrectionRequest): Promise<CorrectionResult> {
    const aiResult = await this.aiCorrectionService.correctText(request);

    return {
      correctionType: "textual_ai_analysis",
      finalSuggestedScore: aiResult.suggestedScore,
      confidenceLevel: "médio",
      requiresTeacherReview: true,
      generalFeedback: aiResult.generalFeedback,
      studentFeedback: aiResult.studentFeedback,
      teacherFeedback: aiResult.teacherFeedback,
      strengths: aiResult.strengths,
      weaknesses: aiResult.weaknesses,
      improvementPlan: aiResult.improvementPlan,
      nextSteps: aiResult.nextSteps
    };
  }

  private generateStudentCodeFeedback(execution: any, analysis: any): string {
    return `
Seu código foi testado. Passou em ${execution.passedTests} de ${execution.totalTests} testes.

Pontos positivos:
${analysis.goodPractices.map((p: string) => `- ${p}`).join("\n")}

Observações Técnicas:
${analysis.logicalIssues.map((p: string) => `- ${p}`).join("\n")}
`;
  }
}

export const universalActivityCorrectionEngine = new UniversalActivityCorrectionEngine(
    new CodeExecutionService(),
    new CodeAnalyzerService(),
    new AICorrectionService()
);
