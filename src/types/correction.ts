
export type ActivityType =
    | "code"
    | "sa"
    | "case_study"
    | "discursive"
    | "practical"
    | "sql"
    | "free";

export interface TestResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  error?: string;
}

export interface ExecutionResult {
  executed: boolean;
  passedTests: number;
  totalTests: number;
  testResults: TestResult[];
  runtimeError?: string;
}

export interface CodeAnalysis {
  languageDetected?: string;
  syntaxOk: boolean;
  logicalIssues: string[];
  goodPractices: string[];
  improvements: string[];
  lineByLine?: {
    line: number;
    code: string;
    comment: string;
    type: "erro" | "alerta" | "melhoria" | "correto";
  }[];
  rubricResults?: {
    criterion: string;
    score: number;
    feedback: string;
  }[];
}

export interface CorrectionRequest {
  activityId: string;
  submissionId: string;
  studentId: string;
  teacherId: string;
  activityType: ActivityType;
  title: string;
  description: string;
  expectedAnswer?: string;
  studentAnswer?: string;
  studentCode?: string;
  programmingLanguage?: "python" | "javascript" | "java" | "cpp" | "c" | "sql" | "portugol";
  maxScore: number;
  correctionMode: "formative" | "evaluative" | "diagnostic";
  testCases?: {
    input: string;
    expectedOutput: string;
    weight?: number;
  }[];
  rubric?: {
    criteria: {
      name: string;
      description: string;
      maxPoints: number;
    }[];
  };
  competencies?: string[];
  skills?: string[];
}

export interface CorrectionResult {
  correctionType: string;
  finalSuggestedScore: number;
  confidenceLevel: "baixo" | "médio" | "alto";
  requiresTeacherReview: boolean;
  executionResult?: ExecutionResult;
  codeAnalysis?: CodeAnalysis;
  generalFeedback: string;
  studentFeedback: string;
  teacherFeedback: string;
  strengths: string[];
  weaknesses: string[];
  improvementPlan: string;
  nextSteps: string[];
  rubricResults?: any[];
  competencyResults?: any[];
}
