import { Activity, ActivitySubmission, Rubric } from '../types/activities';
import { AIService } from './aiService';
import { db } from '../lib/firebase';
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';

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
  rubricResults?: any[];
  competencyResults?: any[];
  codeAnalysis?: {
    linguagemDetectada: string;
    possuiErroSintatico: boolean;
    possuiErroLogico: boolean;
    notaSugerida: number;
    analiseLinhaPorLinha: {
      linha: number;
      codigo: string;
      comentario: string;
      tipo: "erro" | "alerta" | "melhoria" | "correto";
    }[];
    sugestaoCodigoMelhorado?: string;
  };
  saAnalysis?: any;
  improvementPlan: string;
  nextSteps: string[];
}

export const UniversalActivityCorrectionEngine = {
  async correct(
    activity: Activity,
    submission: ActivitySubmission,
    rubric?: Rubric
  ): Promise<UniversalCorrectionResult> {
    const isCode = activity.type === "code";
    const isSA = activity.type === "case_study" || activity.type === "practical";

    const prompt = `
Você é o UniversalActivityCorrectionEngine, um motor avançado de avaliação pedagógica e técnica.

ATIVIDADE:
- Tipo: ${activity.type}
- Título: ${activity.title}
- Descrição: ${activity.description}
- Competências: ${activity.competencies?.join(', ')}
- Skills: ${activity.skills?.join(', ')}
- Modo de Correção: ${activity.correctionMode || 'evaluative'}
- Pontuação Máxima: ${activity.maxScore}

SUBMISSÃO DO ALUNO:
- Resposta Texto: ${submission.answerText || 'Não enviada'}
- Código Fonte: ${submission.studentCode || submission.codeAnswer || 'Não enviado'}
- Linguagem de Programação informada: ${submission.programmingLanguage || 'Não informada'}
- Anexos (URLs): ${submission.fileUrls?.join(', ') || submission.attachments?.join(', ') || 'Nenhum'}

${rubric ? `RUBRICA:\n${JSON.stringify(rubric, null, 2)}` : ''}

REGRAS GERAIS:
1. Avalie de acordo com o "Modo de Correção" absoluto (${activity.correctionMode || 'evaluative'}). Se formativo, foque no processo.
2. A IA NUNCA deve substituir totalmente o professor, sinalize se "requiresTeacherReview" for true (ex: respostas subjetivas complexas).
3. Seja didático, explique erros sem humilhar.

${isCode ? `- Você DEVE retornar a propriedade "codeAnalysis" detalhando funcionamento lógico, sintaxe, boas práticas, segurança e uma análise linha a linha dos erros.
- A propriedade "codeAnalysis" deve seguir a estrutura especificada.` : ''}

${isSA ? `- Avalie: compreensão do problema, requisitos, justificativa técnica, aplicabilidade.
- Você DEVE retornar a propriedade "saAnalysis" com detalhes sobre organização, clareza e aderência ao mundo do trabalho.` : ''}

Retorne ESTRITAMENTE o resultado no seguinte JSON Schema:
{
  "correctionType": "string (ex: 'CODE_EVALUATION', 'SA_EVALUATION', 'DISCURSIVE')",
  "finalSuggestedScore": number,
  "confidenceLevel": "baixo" | "médio" | "alto",
  "requiresTeacherReview": boolean,
  "generalFeedback": "string",
  "studentFeedback": "string",
  "teacherFeedback": "string",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "rubricResults": [{"criterion": "string", "score": number, "feedback": "string"}],
  "competencyResults": [{"competency": "string", "performance": "baixo"| "médio"| "alto", "recommendation": "string"}],
  "improvementPlan": "string",
  "nextSteps": ["string"]
  ${isCode ? `, "codeAnalysis": {
    "linguagemDetectada": "string",
    "possuiErroSintatico": boolean,
    "possuiErroLogico": boolean,
    "notaSugerida": number,
    "analiseLinhaPorLinha": [
      {
        "linha": number,
        "codigo": "string",
        "comentario": "string",
        "tipo": "erro" | "alerta" | "melhoria" | "correto"
      }
    ],
    "sugestaoCodigoMelhorado": "string"
  }` : ''}
  ${isSA ? `, "saAnalysis": {
    "compreensaoProblema": "string",
    "aplicacaoPratica": "string",
    "evidenciasAprendizagem": ["string"],
    "recomendacoesReentrega": ["string"]
  }` : ''}
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
        rubricResults: {
          type: "array",
          items: {
            type: "object",
            properties: {
              criterion: { type: "string" },
              score: { type: "number" },
              feedback: { type: "string" }
            }
          }
        },
        competencyResults: {
          type: "array",
            items: {
              type: "object",
              properties: {
                competency: { type: "string" },
                performance: { type: "string", enum: ["baixo", "médio", "alto"] },
                recommendation: { type: "string" }
              }
            }
        },
        improvementPlan: { type: "string" },
        nextSteps: { type: "array", items: { type: "string" } }
      },
      required: [
        "correctionType", "finalSuggestedScore", "confidenceLevel", "requiresTeacherReview",
        "generalFeedback", "studentFeedback", "teacherFeedback", "strengths", "weaknesses", "improvementPlan", "nextSteps"
      ]
    };

    if (isCode) {
      schema.properties.codeAnalysis = {
        type: "object",
        properties: {
          linguagemDetectada: { type: "string" },
          possuiErroSintatico: { type: "boolean" },
          possuiErroLogico: { type: "boolean" },
          notaSugerida: { type: "number" },
          analiseLinhaPorLinha: {
            type: "array",
            items: {
              type: "object",
              properties: {
                linha: { type: "number" },
                codigo: { type: "string" },
                comentario: { type: "string" },
                tipo: { type: "string", enum: ["erro", "alerta", "melhoria", "correto"] }
              }
            }
          },
          sugestaoCodigoMelhorado: { type: "string" }
        }
      };
    }

    if (isSA) {
       schema.properties.saAnalysis = {
         type: "object",
         properties: {
           compreensaoProblema: { type: "string" },
           aplicacaoPratica: { type: "string" },
           evidenciasAprendizagem: { type: "array", items: { type: "string" } },
           recomendacoesReentrega: { type: "array", items: { type: "string" } }
         }
       };
    }

    const aiResult = await AIService.generateJSON(prompt, schema) as UniversalCorrectionResult;

    if (submission.id) {
       const docRef = doc(db, 'activity_submissions', submission.id);
       await updateDoc(docRef, {
         aiScore: aiResult.finalSuggestedScore,
         aiFeedback: aiResult.studentFeedback,
         teacherFeedback: aiResult.teacherFeedback,
         strengths: aiResult.strengths,
         weaknesses: aiResult.weaknesses,
         improvementPlan: aiResult.improvementPlan,
         competencyResults: aiResult.competencyResults,
         rubricResults: aiResult.rubricResults,
         codeAnalysis: aiResult.codeAnalysis || null,
         saAnalysis: aiResult.saAnalysis || null,
         nextSteps: aiResult.nextSteps || null,
         status: 'corrected',
         correctedAt: new Date().toISOString()
       });

       await addDoc(collection(db, 'correction_logs'), {
         submissionId: submission.id,
         activityId: activity.id,
         studentId: submission.studentId,
         teacherId: activity.teacherId, 
         action: 'ai_correction',
         newScore: aiResult.finalSuggestedScore,
         details: 'Correção automática Universal Engine',
         createdAt: new Date().toISOString()
       });
    }

    return aiResult;
  }
};
