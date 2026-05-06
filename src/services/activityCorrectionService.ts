import { AIService } from './aiService';
import { Activity, ActivitySubmission, Rubric } from '../types/activities';
import { supabase } from '../lib/supabase';
import { UniversalActivityCorrectionEngine } from './UniversalActivityCorrectionEngine';
import { CorrectionRequest } from '../types/correction';

export const activityCorrectionService = {
  async correctSubmissionWithAI(
    activity: Activity,
    submission: ActivitySubmission,
    rubric?: Rubric
  ): Promise<any> {
    const request: CorrectionRequest = {
      activityId: activity.id || '',
      submissionId: submission.id || '',
      studentId: submission.studentId,
      teacherId: activity.teacherId,
      activityType: (activity.type as any) || 'free',
      title: activity.title,
      description: activity.description,
      studentAnswer: submission.answerText,
      studentCode: submission.studentCode || submission.codeAnswer,
      programmingLanguage: submission.programmingLanguage as any,
      maxScore: activity.maxScore,
      correctionMode: activity.correctionMode || 'evaluative',
      competencies: activity.competencies,
      skills: activity.skills,
      rubric: rubric ? {
          criteria: (rubric.criteria || []).map((c: any) => ({
          name: c.name || c.nome || c.criterion || 'Critério',
          description: c.description || c.descricao || '',
          maxPoints: c.maxPoints || c.pontos || c.maxScore || 0
        }))
      } : undefined
    };

    const aiResult = await UniversalActivityCorrectionEngine.correct(activity, submission, rubric);
    
    // Save to Supabase
    if (submission.id) {
      const { error: updateError } = await supabase
        .from('activity_submissions')
        .update({
          ai_score: aiResult.finalSuggestedScore,
          ai_feedback: aiResult.studentFeedback,
          teacher_feedback: aiResult.teacherFeedback,
          strengths: aiResult.strengths,
          weaknesses: aiResult.weaknesses,
          improvement_plan: aiResult.improvementPlan,
          competency_results: aiResult.competencyResults || [],
          execution_result: aiResult.executionResult || null,
          code_analysis: aiResult.codeAnalysis || null,
          status: 'corrected',
          corrected_at: new Date().toISOString()
        })
        .eq('id', submission.id);

      if (updateError) console.error('Error updating submission:', updateError);

      // Log action
      const { error: logError } = await supabase
        .from('correction_logs')
        .insert({
          submission_id: submission.id,
          activity_id: activity.id,
          student_id: submission.studentId,
          teacher_id: activity.teacherId,
          action: 'ai_correction',
          new_score: aiResult.finalSuggestedScore,
          details: 'Correção automática com Universal Engine',
          created_at: new Date().toISOString()
        });
      
      if (logError) console.error('Error logging correction:', logError);
    }

    return aiResult;
  },

  async teacherReview(
    submissionId: string, 
    activityId: string, 
    studentId: string,
    teacherId: string, 
    finalScore: number, 
    feedback: string,
    oldScore?: number
  ) {
    const { error: updateError } = await supabase
      .from('activity_submissions')
      .update({
        teacher_score: finalScore,
        final_score: finalScore,
        teacher_feedback: feedback,
        status: 'reviewed',
        reviewed_at: new Date().toISOString()
      })
      .eq('id', submissionId);

    if (updateError) throw updateError;

    const { error: logError } = await supabase
      .from('correction_logs')
      .insert({
        submission_id: submissionId,
        activity_id: activityId,
        student_id: studentId,
        teacher_id: teacherId,
        action: 'teacher_review',
        old_score: oldScore,
        new_score: finalScore,
        details: feedback,
        created_at: new Date().toISOString()
      });
    
    if (logError) console.error('Error logging teacher review:', logError);
  }
};
