import { Activity, ActivitySubmission, Rubric } from '../types/activities';
import { AIService } from './aiService';
import { supabase } from '../lib/supabase';

export interface UniversalCorrectionResult {
  correctionType: string;
  finalSuggestedScore: number;
  confidenceLevel: "baixo" | "médio" | "alto";
  requiresTeacherReview: boolean;
  generalFeedback: string;
  studentFeedback: string;
  teacherFeedback: string;
  strengths: string[];
  weaknesses: string[];
  rubricResults?: {
    criterion: string;
    score: number;
    feedback: string;
  }[];
  competencyResults?: {
    competency: string;
    performance: "baixo" | "médio" | "alto";
    recommendation: string;
    evidence?: string;
  }[];
  codeAnalysis?: {
    linguagemDetectada: string;
    syntaxOk: boolean;
    possuiErroLogico: boolean;
    notaSugerida: number;
    analiseLinhaPorLinha: {
      linha: number;
      codigo: string;
      comentario: string;
      tipo: "erro" | "alerta" | "melhoria" | "correto";
    }[];
    sugestaoCodigoMelhorado?: string;
    goodPractices?: string[];
  };
  executionResult?: {
    executed: boolean;
    passedTests: number;
    totalTests: number;
    testResults: {
      input: string;
      expectedOutput: string;
      actualOutput: string;
      passed: boolean;
      error?: string;
    }[];
  };
  saAnalysis?: {
    compreensaoProblema: string;
    aplicacaoPratica: string;
    evidenciasAprendizagem: string[];
    recomendacoesReentrega: string[];
  };
  improvementPlan: string;
  nextSteps: string[];
}

export const UniversalActivityCorrectionEngine = {
  async correct(
    activity: Activity,
    submission: ActivitySubmission,
    rubric?: Rubric
  ): Promise<UniversalCorrectionResult> {
    const isCode = activity.type === "code" || activity.type === "database";
    const isSA = activity.type === "case_study" || activity.type === "practical";

    const prompt = `
Você é o UniversalActivityCorrectionEngine, um motor avançado de avaliação pedagógica e técnica baseado em Inteligência Artificial.
Sua missão é fornecer uma correção precisa, justa e altamente educativa.

ATIVIDADE:
- Tipo: ${activity.type}
- Título: ${activity.title}
- Descrição: ${activity.description}
- Competências Alvo: ${activity.competencies?.join(', ')}
- Skills Relacionadas: ${activity.skills?.join(', ')}
- Modo de Correção: ${activity.correctionMode || 'evaluative'}
- Pontuação Máxima: ${activity.maxScore}
${activity.testCases ? `- Casos de Teste Esperados: ${JSON.stringify(activity.testCases)}` : ''}

SUBMISSÃO DO ALUNO:
- Resposta em Texto: ${submission.answerText || 'Nenhuma'}
- Código Fonte Enviado: ${submission.studentCode || submission.codeAnswer || 'Nenhum'}
- Linguagem Informada: ${submission.programmingLanguage || 'Nenhuma'}
- Links/Anexos: ${submission.fileUrls?.join(', ') || 'Nenhum'}

${rubric ? `RUBRICA DE AVALIAÇÃO:\n${JSON.stringify(rubric, null, 2)}` : ''}

DIRETRIZES DE CORREÇÃO:
1. Se for CÓDIGO/SQL: 
   - Simule a execução lógica contra os casos de teste (se houver).
   - Analise sintaxe, lógica, segurança e legibilidade.
   - Forneça uma análise linha a linha dos pontos críticos.
   - Sugira melhorias de refatoração.
2. Se for SITUAÇÃO DE APRENDIZAGEM / PROJETO:
   - Avalie a profundidade da solução, aplicabilidade no mercado e conexão com as competências.
   - Verifique se as entregas solicitadas foram atendidas.
3. Se for DISCURSIVA / RELATÓRIO:
   - Avalie clareza, coerção, domínio técnico e argumentação.
4. GERAL:
   - Calcule uma nota sugerida de 0 a ${activity.maxScore}.
   - Identifique pontos fortes e gaps (weaknesses).
   - Crie um plano de melhoria personalizado.
   - Defina se a revisão humana é obrigatória (requiresTeacherReview).

RETORNE UM JSON SEGUINDO ESTE SCHEMA:
{
  "correctionType": "string",
  "finalSuggestedScore": number,
  "confidenceLevel": "baixo" | "médio" | "alto",
  "requiresTeacherReview": boolean,
  "generalFeedback": "string sumário",
  "studentFeedback": "string motivadora e clara em Markdown",
  "teacherFeedback": "string técnica para o professor",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "rubricResults": [{"criterion": "string", "score": number, "feedback": "string"}],
  "competencyResults": [{"competency": "string", "performance": "baixo"|"médio"|"alto", "recommendation": "string", "evidence": "string"}],
  "improvementPlan": "string",
  "nextSteps": ["string"],
  "codeAnalysis": { // SOMENTE SE FOR CÓDIGO
    "linguagemDetectada": "string",
    "syntaxOk": boolean,
    "possuiErroLogico": boolean,
    "notaSugerida": number,
    "analiseLinhaPorLinha": [{"linha": number, "codigo": "string", "comentario": "string", "tipo": "erro"|"alerta"|"melhoria"|"correto"}],
    "sugestaoCodigoMelhorado": "string",
    "goodPractices": ["string"]
  },
  "executionResult": { // SOMENTE SE HOUVER CASOS DE TESTE OU FOR CÓDIGO
    "executed": true,
    "passedTests": number,
    "totalTests": number,
    "testResults": [{"input": "string", "expectedOutput": "string", "actualOutput": "string", "passed": boolean, "error": "string"}]
  },
  "saAnalysis": { // SOMENTE SE FOR SA/PROJETO
    "compreensaoProblema": "string",
    "aplicacaoPratica": "string",
    "evidenciasAprendizagem": ["string"],
    "recomendacoesReentrega": ["string"]
  }
}
`;

    const schema: any = {
      type: "object",
      properties: {
        correctionType: { type: "string" },
        finalSuggestedScore: { type: "number" },
        confidenceLevel: { type: "string", enum: ["baixo", "médio", "alto"] },
        requiresTeacherReview: { type: "boolean" },
        generalFeedback: { type: "string" },
        studentFeedback: { type: "string" },
        teacherFeedback: { type: "string" },
        strengths: { type: "array", items: { type: "string" } },
        weaknesses: { type: "array", items: { type: "string" } },
        improvementPlan: { type: "string" },
        nextSteps: { type: "array", items: { type: "string" } }
      },
      required: [
        "correctionType", "finalSuggestedScore", "confidenceLevel", "requiresTeacherReview",
        "generalFeedback", "studentFeedback", "teacherFeedback", "strengths", "weaknesses", "improvementPlan", "nextSteps"
      ]
    };

    try {
      // Se houver uma URL de microserviço configurada, tenta usar ela
      const envObj = (typeof import.meta !== 'undefined' && (import.meta as any).env) ? (import.meta as any).env : (typeof process !== 'undefined' ? process.env : {});
      const correctionUrl = envObj.VITE_CORRECTION_ENGINE_URL || (import.meta as any).env?.VITE_CORRECTION_ENGINE_URL;
      
      if (correctionUrl) {
        try {
          const response = await fetch(`${correctionUrl}/api/correction/evaluate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              aluno_id: submission.studentId,
              atividade_id: activity.id,
              tipo: activity.type,
              linguagem: submission.programmingLanguage,
              resposta: submission.studentCode || submission.answerText,
              criterios: rubric?.criteria.map(c => c.name) || []
            })
          });
          
          if (response.ok) {
            const remoteResult = await response.json();
            // Adaptar o resultado remoto para o formato interno se necessário
            // Aqui estamos mantendo a lógica interna como fallback ou complementar
          }
        } catch (e) {
          console.warn("External correction engine unavailable, falling back to internal AI:", e);
        }
      }

      const aiResult = await AIService.generateJSON(prompt, schema) as UniversalCorrectionResult;

      if (submission.id) {
        // Salvar correção no Supabase
        const { error: updateError } = await supabase
          .from('activity_submissions')
          .update({
            ai_score: aiResult.finalSuggestedScore,
            ai_feedback: aiResult.studentFeedback,
            teacher_feedback: aiResult.teacherFeedback,
            strengths: aiResult.strengths,
            weaknesses: aiResult.weaknesses,
            improvement_plan: aiResult.improvementPlan,
            competency_results: aiResult.competencyResults,
            rubric_results: aiResult.rubricResults,
            code_analysis: aiResult.codeAnalysis || null,
            execution_result: aiResult.executionResult || null,
            sa_analysis: aiResult.saAnalysis || null,
            next_steps: aiResult.nextSteps || null,
            status: 'corrected',
            corrected_at: new Date().toISOString()
          })
          .eq('id', submission.id);

        if (updateError) console.error('Error updating submission:', updateError);

        // Gerar log de correção
        await supabase
          .from('correction_logs')
          .insert({
            submission_id: submission.id,
            activity_id: activity.id,
            student_id: submission.studentId,
            teacher_id: activity.teacherId,
            action: 'ai_correction',
            new_score: aiResult.finalSuggestedScore,
            details: `Correção automática finalizada pelo Universal Engine. Confiança: ${aiResult.confidenceLevel}`,
            created_at: new Date().toISOString()
          });
      }

      return aiResult;
    } catch (error) {
      console.error("Critical error in Universal Correction Engine:", error);
      throw error;
    }
  }
};
