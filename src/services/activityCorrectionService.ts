import { AIService } from './aiService';
import { Activity, ActivitySubmission, Rubric } from '../types/activities';
import { db } from '../lib/firebase';
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { universalActivityCorrectionEngine } from './correction/UniversalActivityCorrectionEngine';
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
          criteria: rubric.criteria.map(c => ({
              name: c.criterion,
              description: c.description,
              maxPoints: c.maxScore
          }))
      } : undefined
    };

    const aiResult = await universalActivityCorrectionEngine.correct(request);
    
    // Save to Firestore
    if (submission.id) {
      const docRef = doc(db, 'activity_submissions', submission.id);
      await updateDoc(docRef, {
        aiScore: aiResult.finalSuggestedScore,
        aiFeedback: aiResult.studentFeedback,
        teacherFeedback: aiResult.teacherFeedback,
        strengths: aiResult.strengths,
        weaknesses: aiResult.weaknesses,
        improvementPlan: aiResult.improvementPlan,
        competencyResults: aiResult.competencyResults || [],
        executionResult: aiResult.executionResult || null,
        codeAnalysis: aiResult.codeAnalysis || null,
        status: 'corrected',
        correctedAt: new Date().toISOString()
      });

      // Log action
      await addDoc(collection(db, 'correction_logs'), {
        submissionId: submission.id,
        activityId: activity.id,
        studentId: submission.studentId,
        teacherId: activity.teacherId,
        action: 'ai_correction',
        newScore: aiResult.finalSuggestedScore,
        details: 'Correção automática com Universal Engine',
        createdAt: new Date().toISOString()
      });
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
    const docRef = doc(db, 'activity_submissions', submissionId);
    await updateDoc(docRef, {
      teacherScore: finalScore,
      finalScore: finalScore,
      teacherFeedback: feedback,
      status: 'reviewed',
      reviewedAt: new Date().toISOString()
    });

    await addDoc(collection(db, 'correction_logs'), {
      submissionId,
      activityId,
      studentId,
      teacherId,
      action: 'teacher_review',
      oldScore: oldScore,
      newScore: finalScore,
      details: feedback,
      createdAt: new Date().toISOString()
    });
  }
};
