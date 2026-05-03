// src/services/edujarvis/types.ts

export type EduJarvisRole = 'USER' | 'ASSISTANT' | 'SYSTEM';

export interface EduJarvisMessage {
  role: EduJarvisRole;
  content: string;
  timestamp: any;
  agent?: string;
}

export interface EduJarvisConversation {
  id: string;
  userId: string;
  tenantId: string;
  messages: EduJarvisMessage[];
  lastUpdate: any;
  context: {
    perfil: string;
    turmaId?: string;
    ucAtual?: string;
  };
}

export type EduJarvisAgentType = 
  | 'TUTOR' 
  | 'PROFESSOR' 
  | 'ANALYST' 
  | 'RECOMMENDER' 
  | 'GAME' 
  | 'CORRECTOR'
  | 'PROJECTS'
  | 'RECOVERY'
  | 'QUESTION_BANK'
  | 'FLIPPED'
  | 'CODE_REVIEW'
  | 'DROPOUT_RISK'
  | 'DASHBOARD_INSIGHT'
  | 'LESSON_CREATOR'
  | 'ADAPTIVE_EXAM'
  | 'INTERVENTION'
  | 'LEARNING_PATH'
  | 'CONTENT_STUDIO'
  | 'GOVERNANCE'
  | 'DIGITAL_TWIN'
  | 'PREDICTIVE_ENGINE'
  | 'AUTONOMOUS_TEACHER'
  | 'BEHAVIORAL_ANALYTICS'
  | 'SELF_IMPROVING'
  | 'MULTIMODAL_TUTOR'
  | 'RAG_INSTITUTIONAL'
  | 'ASSESSMENT_ENGINE'
  | 'MOTIVATION_ENGINE'
  | 'MARKETPLACE'
  | 'COORDINATOR_COPILOT'
  | 'REPORT_GENERATOR'
  | 'WORKFLOW_ENGINE'
  | 'GUARD'
  | 'ORCHESTRATOR'
  | 'CACHE';

export interface TenantAIConfig {
  tenantId: string;
  assistantName: string;
  tone: 'didatico' | 'tecnico' | 'motivacional';
  primaryModel: string;
  enabledAgents: EduJarvisAgentType[];
  safetyLevel: 'low' | 'medium' | 'high';
  creditsUsed: number;
  creditLimit: number;
  branding: {
    primaryColor?: string;
    logoUrl?: string;
  };
}

export interface AssessmentRubric {
  criteria: Array<{
    name: string;
    weight: number;
    levels: {
      excellent: string;
      good: string;
      basic: string;
      insufficient: string;
    };
  }>;
}

export interface EduJarvisIntent {
  agent: EduJarvisAgentType;
  confidence: number;
  reason: string;
  suggestedAction?: string;
}

export interface StudentCognitiveMemory {
  alunoId: string;
  nivel: "iniciante" | "intermediario" | "avancado";
  estiloAprendizagem: "visual" | "pratico" | "teorico" | "misto";
  dificuldades: string[];
  pontosFortes: string[];
  errosFrequentes: string[];
  taxaAcerto: number;
  tempoMedioResposta: number;
  totalEventos: number;
  ultimaInteracao: any;
  perfilMetadata?: Record<string, any>;
}

export interface LearningEvent {
  alunoId: string;
  conteudo: string;
  disciplina: string;
  turmaId: string;
  acertou: boolean;
  tempoRespostaSegundos: number;
  dificuldadeQuestao: "facil" | "media" | "dificil";
  tipoErro?: string;
}
