export type ActivityType = "discursive" | "short_answer" | "case_study" | "code" | "practical" | "file_upload" | "database" | "modeling" | "cybersecurity" | "network" | "iot" | "free";
export type ActivityStatus = "draft" | "published" | "closed";
export type SubmissionStatus = "submitted" | "corrected" | "reviewed" | "returned";
export type CorrectionMode = "formative" | "evaluative" | "diagnostic";

export interface Activity {
  id?: string;
  title: string;
  description: string;
  type: ActivityType;
  courseId: string;
  classId: string;
  teacherId: string;
  subject?: string;
  unit?: string;
  competencies: string[];
  skills: string[];
  bloomLevel?: string;
  maxScore: number;
  dueDate?: string;
  allowResubmission: boolean;
  status: ActivityStatus;
  rubricId?: string;
  correctionMode?: CorrectionMode;
  testCases?: {
    input: string;
    expectedOutput: string;
    weight?: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ActivitySubmission {
  id?: string;
  activityId: string;
  studentId: string;
  classId: string;
  answerText?: string;
  codeAnswer?: string;
  studentCode?: string;
  programmingLanguage?: string;
  fileUrls?: string[];
  attachments?: string[];
  status: SubmissionStatus;
  attemptNumber: number;
  aiScore?: number;
  teacherScore?: number;
  finalScore?: number;
  aiFeedback?: string;
  teacherFeedback?: string;
  strengths?: string[];
  weaknesses?: string[];
  improvementPlan?: string;
  competencyAnalysis?: {
    competency: string;
    performance: "baixo" | "médio" | "alto";
    evidence: string;
    recommendation: string;
  }[];
  rubricResults?: any[];
  competencyResults?: any[];
  codeAnalysis?: any;
  executionResult?: any;
  saAnalysis?: any;
  nextSteps?: string[];
  createdAt: string;
  correctedAt?: string;
  reviewedAt?: string;
}

export interface RubricLevel {
  label: string;
  description: string;
  points: number;
}

export interface RubricCriterion {
  name: string;
  description: string;
  maxPoints: number;
  levels: RubricLevel[];
}

export interface Rubric {
  id?: string;
  title: string;
  teacherId: string;
  criteria: RubricCriterion[];
  createdAt: string;
}

export interface CorrectionLog {
  id?: string;
  submissionId: string;
  activityId: string;
  studentId: string;
  teacherId: string;
  action: "ai_correction" | "teacher_review" | "score_change" | "feedback_returned";
  oldScore?: number;
  newScore?: number;
  details?: string;
  createdAt: string;
}
