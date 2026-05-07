import { api } from '../lib/api';


import { Activity, ActivitySubmission } from '../types/activities';const ACTIVITIES_TABLE = 'activities';
const SUBMISSIONS_TABLE = 'activity_submissions';

export const activityService = {
  async createActivity(activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date().toISOString();
    const { data, error } = await api
      .from(ACTIVITIES_TABLE)
      .insert({
        title: activity.title,
        description: activity.description,
        type: activity.type,
        course_id: activity.courseId,
        class_id: activity.classId,
        teacher_id: activity.teacherId,
        subject: activity.subject,
        unit: activity.unit,
        competencies: activity.competencies,
        skills: activity.skills,
        bloom_level: activity.bloomLevel,
        max_score: activity.maxScore,
        due_date: activity.dueDate,
        allow_resubmission: activity.allowResubmission,
        status: activity.status,
        rubric_id: activity.rubricId,
        correction_mode: activity.correctionMode,
        test_cases: activity.testCases,
        created_at: now,
        updated_at: now
      })
      .select()
      .maybeSingle();

    if (error) throw error;
    return data.id;
  },

  async updateActivity(id: string, updates: Partial<Activity>): Promise<void> {
    const mappedUpdates: any = {
      updated_at: new Date().toISOString()
    };
    if (updates.title !== undefined) mappedUpdates.title = updates.title;
    if (updates.description !== undefined) mappedUpdates.description = updates.description;
    if (updates.type !== undefined) mappedUpdates.type = updates.type;
    if (updates.courseId !== undefined) mappedUpdates.course_id = updates.courseId;
    if (updates.classId !== undefined) mappedUpdates.class_id = updates.classId;
    if (updates.status !== undefined) mappedUpdates.status = updates.status;
    if (updates.bloomLevel !== undefined) mappedUpdates.bloom_level = updates.bloomLevel;
    if (updates.maxScore !== undefined) mappedUpdates.max_score = updates.maxScore;
    if (updates.dueDate !== undefined) mappedUpdates.due_date = updates.dueDate;
    if (updates.allowResubmission !== undefined) mappedUpdates.allow_resubmission = updates.allowResubmission;
    if (updates.rubricId !== undefined) mappedUpdates.rubric_id = updates.rubricId;
    if (updates.correctionMode !== undefined) mappedUpdates.correction_mode = updates.correctionMode;
    if (updates.testCases !== undefined) mappedUpdates.test_cases = updates.testCases;

    const { error } = await api
      .from(ACTIVITIES_TABLE)
      .update(mappedUpdates)
      .eq('id', id);

    if (error) throw error;
  },

  async getActivitiesByTeacher(teacherId: string): Promise<Activity[]> {
    const { data, error } = await api
      .from(ACTIVITIES_TABLE)
      .select('*')
      .eq('teacher_id', teacherId);

    if (error) throw error;
    return (data || []).map(d => ({
      ...d,
      courseId: d.course_id,
      classId: d.class_id,
      teacherId: d.teacher_id,
      bloomLevel: d.bloom_level,
      maxScore: d.max_score,
      dueDate: d.due_date,
      allowResubmission: d.allow_resubmission,
      rubricId: d.rubric_id,
      correctionMode: d.correction_mode,
      testCases: d.test_cases,
      createdAt: d.created_at,
      updatedAt: d.updated_at
    })) as Activity[];
  },

  async getActivitiesByClass(classId: string): Promise<Activity[]> {
    const { data, error } = await api
      .from(ACTIVITIES_TABLE)
      .select('*')
      .eq('class_id', classId)
      .eq('status', 'published');

    if (error) throw error;
    return (data || []).map(d => ({
      ...d,
      courseId: d.course_id,
      classId: d.class_id,
      teacherId: d.teacher_id,
      bloomLevel: d.bloom_level,
      maxScore: d.max_score,
      dueDate: d.due_date,
      allowResubmission: d.allow_resubmission,
      rubricId: d.rubric_id,
      correctionMode: d.correction_mode,
      testCases: d.test_cases,
      createdAt: d.created_at,
      updatedAt: d.updated_at
    })) as Activity[];
  },

  async submitActivity(submission: Omit<ActivitySubmission, 'id' | 'createdAt'>): Promise<string> {
    const now = new Date().toISOString();
    const { data, error } = await api
      .from(SUBMISSIONS_TABLE)
      .insert({
        activity_id: submission.activityId,
        student_id: submission.studentId,
        class_id: submission.classId,
        answer_text: submission.answerText,
        code_answer: submission.codeAnswer,
        student_code: submission.studentCode,
        programming_language: submission.programmingLanguage,
        file_urls: submission.fileUrls,
        attachments: submission.attachments,
        status: submission.status,
        attempt_number: submission.attemptNumber,
        created_at: now
      })
      .select()
      .maybeSingle();

    if (error) throw error;
    return data.id;
  },

  async getSubmissionsByActivity(activityId: string): Promise<ActivitySubmission[]> {
    const { data, error } = await api
      .from(SUBMISSIONS_TABLE)
      .select('*')
      .eq('activity_id', activityId);

    if (error) throw error;
    return (data || []).map(d => ({
      ...d,
      activityId: d.activity_id,
      studentId: d.student_id,
      classId: d.class_id,
      answerText: d.answer_text,
      codeAnswer: d.code_answer,
      studentCode: d.student_code,
      programmingLanguage: d.programming_language,
      fileUrls: d.file_urls,
      aiScore: d.ai_score,
      teacherScore: d.teacher_score,
      finalScore: d.final_score,
      aiFeedback: d.ai_feedback,
      teacherFeedback: d.teacher_feedback,
      improvementPlan: d.improvement_plan,
      competencyResults: d.competency_results,
      rubricResults: d.rubric_results,
      codeAnalysis: d.code_analysis,
      executionResult: d.execution_result,
      saAnalysis: d.sa_analysis,
      nextSteps: d.next_steps,
      createdAt: d.created_at,
      correctedAt: d.corrected_at,
      reviewedAt: d.reviewed_at,
      attemptNumber: d.attempt_number
    })) as ActivitySubmission[];
  },

  async getStudentSubmissions(studentId: string): Promise<ActivitySubmission[]> {
    const { data, error } = await api
      .from(SUBMISSIONS_TABLE)
      .select('*')
      .eq('student_id', studentId);

    if (error) throw error;
    return (data || []).map(d => ({
      ...d,
      activityId: d.activity_id,
      studentId: d.student_id,
      classId: d.class_id,
      answerText: d.answer_text,
      codeAnswer: d.code_answer,
      studentCode: d.student_code,
      programmingLanguage: d.programming_language,
      fileUrls: d.file_urls,
      aiScore: d.ai_score,
      teacherScore: d.teacher_score,
      finalScore: d.final_score,
      aiFeedback: d.ai_feedback,
      teacherFeedback: d.teacher_feedback,
      improvementPlan: d.improvement_plan,
      competencyResults: d.competency_results,
      rubricResults: d.rubric_results,
      codeAnalysis: d.code_analysis,
      executionResult: d.execution_result,
      saAnalysis: d.sa_analysis,
      nextSteps: d.next_steps,
      createdAt: d.created_at,
      correctedAt: d.corrected_at,
      reviewedAt: d.reviewed_at,
      attemptNumber: d.attempt_number
    })) as ActivitySubmission[];
  }
};
