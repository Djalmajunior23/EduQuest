// src/services/edujarvis/EduJarvisService.ts
import { supabase } from '../../lib/supabase';
import { EduJarvisOrchestrator } from './Orchestrator';
import { ProfessorAgent } from './agents/ProfessorAgent';
import { RecommenderAgent } from './agents/RecommenderAgent';
import { TutorAgent } from './agents/TutorAgent';
import { NarrativeBIAgent } from './agents/NarrativeBIAgent';
import { GuardAgent } from './agents/GuardAgent';
import { GameAgent } from './agents/GameAgent';
import { CorrectionAgent } from './agents/CorrectionAgent';
import { ProjectGeneratorAgent } from './agents/ProjectGeneratorAgent';
import { RecoveryAgent } from './agents/RecoveryAgent';
import { QuestionBankAgent } from './agents/QuestionBankAgent';
import { FlippedClassroomAgent } from './agents/FlippedClassroomAgent';
import { CodeReviewAgent } from './agents/CodeReviewAgent';
import { DropoutRiskAgent } from './agents/DropoutRiskAgent';
import { DashboardInsightAgent } from './agents/DashboardInsightAgent';
import { LessonCreatorAgent } from './agents/LessonCreatorAgent';
import { AutoInterventionAgent } from './agents/AutoInterventionAgent';
import { LearningPathAgent } from './agents/LearningPathAgent';
import { ContentStudioAgent } from './agents/ContentStudioAgent';
import { GovernanceAgent } from './agents/GovernanceAgent';
import { DigitalTwinAgent } from './agents/DigitalTwinAgent';
import { PredictiveAgent } from './agents/PredictiveAgent';
import { AutonomousTeacherAgent } from './agents/AutonomousTeacherAgent';
import { BehavioralAnalyticsAgent } from './agents/BehavioralAnalyticsAgent';
import { SelfImprovingAgent } from './agents/SelfImprovingAgent';
import { MultimodalTutorAgent } from './agents/MultimodalTutorAgent';
import { RAGAgent } from './agents/RAGAgent';
import { AssessmentAgent } from './agents/AssessmentAgent';
import { CoordinatorCopilotAgent } from './agents/CoordinatorCopilotAgent';
import { AutoReportAgent } from './agents/AutoReportAgent';
import { RealTimeMonitorService } from './RealTimeMonitorService';
import { MotivationService } from './MotivationService';
import { AuditService } from './AuditService';
import { WhiteLabelConfigService } from './WhiteLabelConfigService';
import { WorkflowEngineService } from './WorkflowEngineService';
import { StudentJourneyService } from './StudentJourneyService';
import { AgentQualityService } from './AgentQualityService';
import { SmartNotificationService } from './SmartNotificationService';
import { MonetizationService } from './MonetizationService';
import { ObservabilityService } from './ObservabilityService';
import { BenchmarkService } from './BenchmarkService';
import { AdaptiveLearningEngine } from './AdaptiveLearningEngine';
import { StudentDigitalTwinService } from './StudentDigitalTwinService';
import { PredictiveEducationEngine } from './PredictiveEducationEngine';
import { MarketplaceService } from './MarketplaceService';
import { RAGService } from './RAGService';
import { SafetyGuard } from './SafetyGuard';
import { ModelRouter } from './ModelRouter';
import { AIEvaluationService } from './AIEvaluationService';
import { DataLakeService } from './DataLakeService';
import { AdvancedPersonalizationService } from './AdvancedPersonalizationService';
import { ApprovalWorkflowService } from './ApprovalWorkflowService';
import { GlobalIntelligenceService } from './GlobalIntelligenceService';
import { AnalystIA } from './agents/AnalystIA';
import { EduJarvisMessage, EduJarvisAgentType } from './types';
import { GoogleGenAI } from '@google/genai';

export class EduJarvisService {
  private static COLLECTION = 'edujarvis_conversas';
  private static CACHE_COLLECTION = 'edujarvis_cache';

  /**
   * Envia uma mensagem e obtém a resposta orquestrada.
   */
  public static async sendMessage(
    text: string, 
    userProfile: any, 
    context?: any
  ): Promise<EduJarvisMessage> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("AUTH_REQUIRED");

    const tenantId = userProfile.tenantId;
    const startTime = Date.now();

    // 0. Verificar Créditos (SaaS Monetization Phase 08)
    const { allowed, remaining } = await MonetizationService.checkUsage(tenantId);
    if (!allowed) {
      throw new Error("Sua instituição atingiu o limite de créditos de IA para este mês. Entre em contato com a administração.");
    }

    // 0.1 Verificar Cache (Otimização de custo)
    const cacheHash = this.generateHash(text + (context?.ucId || ""));
    const cachedResponse = await this.checkCache(cacheHash);
    if (cachedResponse) {
       return {
         role: 'ASSISTANT',
         content: cachedResponse,
         timestamp: new Date().toISOString(),
         agent: 'CACHE'
       };
    }

    // 0.2 Segurança (SafetyGuard Phase 08 - Neural Guard)
    const safety = await SafetyGuard.analyze(text);
    if (safety.blocked) {
      return {
        role: 'ASSISTANT',
        content: safety.message || "Conteúdo bloqueado por segurança.",
        timestamp: new Date().toISOString(),
        agent: 'GUARD'
      };
    }

    // 1. Identificar intenção
    const intent = await EduJarvisOrchestrator.identifyIntent(text, userProfile.perfil);

    // 1.1 Roteamento de Modelo (ModelRouter Phase 08)
    const modelType = ModelRouter.route({
      complexity: intent.confidence < 0.7 ? 'high' : 'medium',
      isCritical: intent.agent === 'GUARD' || intent.agent === 'GOVERNANCE',
      tenantPlan: 'free' // Em um caso real, buscaria do config do tenant
    });

    // 2. Chamar o agente específico
    let responseContent = "";
    try {
      responseContent = await this.executeAgent(intent.agent, text, userProfile, tenantId, context);
      
      // 2.1 Avaliação Automática de Qualidade (Phase 10 - Enterprise Governance)
      const evaluation = AIEvaluationService.evaluateResponse({
        response: responseContent,
        agentName: intent.agent,
        userRole: userProfile.perfil
      });

      if (evaluation.status === 'blocked') {
        responseContent = "Desculpe, tive um problema ao validar a qualidade da resposta pedagógica. Vamos tentar de novo com outras palavras?";
      }

      // Log de Avaliação (para Dashboard de Observabilidade)
      console.log(`[AI Evaluation] Agent: ${intent.agent}, Score: ${evaluation.score}, Status: ${evaluation.status}`);
      
    } catch (error) {
      console.error("Agent execution failed:", error);
      responseContent = "Desculpe, tive um erro ao processar sua solicitação.";
    }

    const duration = Date.now() - startTime;

    const assistantMessage: EduJarvisMessage = {
      role: 'ASSISTANT',
      content: responseContent,
      timestamp: new Date().toISOString(),
      agent: intent.agent
    };

    // 3. Salvar no histórico e auditoria
    this.saveInteraction(user.id, tenantId, text, assistantMessage);
    
    // 3.1 Log de Observabilidade (Phase 08)
    ObservabilityService.logEvent({
      tenantId,
      agentName: intent.agent,
      modelUsed: modelType,
      latencyMs: duration,
      success: true,
      tokensInput: text.length / 4, // estimativa simples
      tokensOutput: responseContent.length / 4,
      estimatedCost: 0.0001 // estimativa simples
    });

    // 3.2 Track Usage (Monetization Phase 08)
    MonetizationService.trackUsage(tenantId, intent.agent);

    // 3.3 Contribution to Global Intelligence (Phase 11)
    GlobalIntelligenceService.contributeData(tenantId, intent.agent, true, duration);

    // 3.4 Data Lake Entry (Phase 11 Enterprise Data Lake)
    DataLakeService.registerEvent({
      tenantId,
      userId: user.id,
      userRole: userProfile.perfil,
      eventType: 'AI_INTERACTION',
      sourceModule: intent.agent,
      payload: { 
        agentType: intent.agent, 
        confidence: intent.confidence,
        latency: duration,
        status: 'success'
      }
    });

    // 3.5 Personalization Adaptive Loop (Phase 11)
    if (userProfile.perfil === 'student') {
      AdvancedPersonalizationService.updateProfile({
        alunoId: user.id,
        tenantId,
        engagementScore: 10 // Placeholder for real logic
      });
    }

    // 4. Salvar no Cache de forma assíncrona
    this.saveToCache(cacheHash, responseContent);

    return assistantMessage;
  }

  private static async saveToCache(hash: string, response: string) {
    try {
      await supabase.from(this.CACHE_COLLECTION).upsert({
        id: hash,
        response,
        created_at: new Date().toISOString()
      });
    } catch (e) {
      console.error("Error saving to cache", e);
    }
  }

  private static ai: GoogleGenAI;

  private static getAI() {
    if (!this.ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY_MISSING");
      this.ai = new GoogleGenAI({ apiKey });
    }
    return this.ai;
  }

  private static async executeAgent(
    agent: EduJarvisAgentType, 
    message: string, 
    profile: any, 
    tenantId: string,
    context: any
  ): Promise<string> {
    const ai = this.getAI();

    let systemInstruction = "";

    switch (agent) {
      case 'TUTOR':
        const { data: { user: tutorUser } } = await supabase.auth.getUser();
        const alunoId = profile.id || tutorUser?.id;
        let adaptiveInstruction = "Aluno sem memória cognitiva registrada. Use abordagem iniciante e diagnóstica.";
        
        if (alunoId && profile.perfil === 'ALUNO') {
          const memory = await AdaptiveLearningEngine.getStudentMemory(alunoId);
          if (memory) {
            adaptiveInstruction = AdaptiveLearningEngine.generateAdaptiveInstruction(memory);
          }
        }

        return await TutorAgent.execute(message, { 
          adaptiveInstruction, 
          metadata: { ...context, profile } 
        });
      case 'PROFESSOR':
        return await ProfessorAgent.execute(message, { ...context, profile });
      case 'ANALYST':
        const tid = profile.turmaId || context?.turmaId || "TURMA-Geral";
        return await AnalystIA.execute(tid, tenantId, message);
      case 'RECOMMENDER':
        const { data: { user: recUser } } = await supabase.auth.getUser();
        const studentId = profile.id || recUser?.id;
        let digitalTwin = null;
        if (studentId) {
          digitalTwin = await StudentDigitalTwinService.getTwin(studentId);
        }
        return await RecommenderAgent.execute(message, { ...context, profile, digitalTwin });
      case 'GAME':
        return await GameAgent.execute(message, { ...context, profile });
      case 'CORRECTOR':
        return await CorrectionAgent.execute(message, { ...context, profile });
      case 'PROJECTS':
        return await ProjectGeneratorAgent.execute(message, { ...context, profile });
      case 'RECOVERY':
        return await RecoveryAgent.execute(message, { ...context, profile });
      case 'QUESTION_BANK':
        return await QuestionBankAgent.execute(message, { ...context, profile });
      case 'FLIPPED':
        return await FlippedClassroomAgent.execute(message, { ...context, profile });
      case 'CODE_REVIEW':
        return await CodeReviewAgent.execute(message, { ...context, profile });
      case 'DROPOUT_RISK':
        return await DropoutRiskAgent.execute({ ...context, profile });
      case 'DASHBOARD_INSIGHT':
        return await DashboardInsightAgent.execute(context?.titulo || "Novo Gráfico", context?.dados || {}, profile.perfil);
      case 'LESSON_CREATOR':
        return await LessonCreatorAgent.execute({ 
          tema: message, 
          cargaHoraria: context?.cargaHoraria || "4h",
          perfilTurma: context?.perfilTurma || "Técnico Iniciante",
          unidadeCurricular: context?.uc || "Geral"
        });
      case 'ADAPTIVE_EXAM':
        return "Simulado Adaptativo Iniciado! Prepare-se para as questões.";
      case 'INTERVENTION':
        return await AutoInterventionAgent.execute({ message, ...context });
      case 'LEARNING_PATH':
        return await LearningPathAgent.execute(message, context);
      case 'CONTENT_STUDIO':
        return await ContentStudioAgent.execute(message, context?.format || "exercise_sheet");
      case 'GOVERNANCE':
        return await GovernanceAgent.execute({ message, context });
      case 'DIGITAL_TWIN':
        return await DigitalTwinAgent.execute(profile.id);
      case 'PREDICTIVE_ENGINE':
        return await PredictiveAgent.execute(profile.id);
      case 'AUTONOMOUS_TEACHER':
        const twinDT = await StudentDigitalTwinService.getTwin(profile.id);
        const prediction = twinDT ? PredictiveEducationEngine.analyze(twinDT) : {};
        return await AutonomousTeacherAgent.execute(prediction, twinDT || {});
      case 'BEHAVIORAL_ANALYTICS':
        return await BehavioralAnalyticsAgent.execute(profile.id);
      case 'SELF_IMPROVING':
        return await SelfImprovingAgent.execute(context?.targetAgent || "TUTOR");
      case 'MULTIMODAL_TUTOR':
        return await MultimodalTutorAgent.execute({
          userRole: profile.role === 'professor' ? 'teacher' : 'student',
          textPrompt: message,
          imageDescription: context?.imageDescription,
          imageData: context?.imageData
        });
      case 'RAG_INSTITUTIONAL':
        const chunks = await RAGService.searchContext(message, profile.tenantId);
        return await RAGAgent.execute(message, chunks);
      case 'MARKETPLACE':
        const marketplaceResults = await MarketplaceService.searchContent({
          queryText: message,
          tenantId: profile.tenantId,
          visibility: 'public'
        });
        return `Encontrei ${marketplaceResults.length} conteúdos no marketplace relacionados a sua busca. Como posso te ajudar a utilizá-los?`;
      case 'ASSESSMENT_ENGINE':
        return await AssessmentAgent.execute({
          activityDescription: context?.activityDescription || "Atividade Geral",
          studentSubmission: message,
          rubric: context?.rubric || { criteria: [] }
        });
      case 'MOTIVATION_ENGINE':
        const twinMot = await StudentDigitalTwinService.getTwin(profile.id);
        const motivationText = MotivationService.generateMotivationMessage({
          nivel: twinMot?.nivel || 'iniciante',
          evolucao: twinMot?.engajamento || 0,
          dificuldadeAtual: twinMot?.dificuldades?.[0]
        });
        return motivationText;
      case 'COORDINATOR_COPILOT':
        return await CoordinatorCopilotAgent.execute({
          periodo: context?.periodo || "Mensal",
          turmasSummary: context?.turmas || [],
          indicadoresGerais: context?.metrics || {}
        });
      case 'REPORT_GENERATOR':
        // Ações Críticas: Exige aprovação se for para 'institution'
        if (context?.reportType === 'institution') {
          await ApprovalWorkflowService.requestApproval({
            tenantId,
            requestedBy: profile.id,
            type: 'critical_report',
            payload: { context, profile }
          });
          return "Esta solicitação exige aprovação da gerência acadêmica. O pedido foi enviado para o fluxo de Human-in-the-Loop.";
        }
        return await AutoReportAgent.execute({
          reportType: context?.reportType || 'student',
          targetName: context?.targetName || profile.name,
          indicators: context?.indicators || {}
        });
      case 'WORKFLOW_ENGINE':
        const wfResult = await WorkflowEngineService.runEducationalWorkflow({
          type: context?.eventType || "low_performance_detected",
          alunoId: profile.id,
          payload: context?.payload || {}
        });
        return `Workflow [${wfResult.workflow}] iniciado. Passos: ${wfResult.steps.join(' -> ')}`;
      case 'GUARD':
        systemInstruction = `Você é o GuardIA. Responsabilidades:
        1. Bloquear mensagens ofensivas ou inadequadas.
        2. Impedir que o aluno use a IA para "colar" em exames oficiais.
        3. Manter as conversas dentro do escopo educacional da plataforma.
        Linguagem: Firme, neutra e protetiva.`;
        break;
      default:
        systemInstruction = `Você é o EduJarvis, o cérebro neural da plataforma educacional.`;
    }

    const fullPrompt = `${systemInstruction}\n\n[CONTEXTO]: ${JSON.stringify(context || {})}\n\n[MENSAGEM DO USUÁRIO]: ${message}`;
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }]
      });
      return response.text || "Sem resposta.";
    } catch (error) {
      console.error("Agent Execution Error:", error);
      return "Desculpe, tive um erro ao processar sua solicitação.";
    }
  }

  private static async saveInteraction(userId: string, tenantId: string, userText: string, assistantMsg: EduJarvisMessage) {
    try {
      await supabase.from(this.COLLECTION).insert({
        user_id: userId,
        tenant_id: tenantId,
        user_message: userText,
        assistant_message: assistantMsg,
        created_at: new Date().toISOString()
      });
    } catch (e) {
      console.error("Error saving interaction", e);
    }
  }

  private static generateHash(str: string): string {
     let hash = 0;
     for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; 
     }
     return "h_" + Math.abs(hash);
  }

  private static async checkCache(hash: string): Promise<string | null> {
     try {
       const { data, error } = await supabase
         .from(this.CACHE_COLLECTION)
         .select('*')
         .eq('id', hash)
         .single();
       
       if (data) {
          // TTL de 24 horas por padrão para cache global
          const now = Date.now();
          const createdAt = new Date(data.created_at).getTime() || 0;
          if (now - createdAt < 86400000) {
             return data.response;
          }
       }
     } catch (e) {
       console.error("Cache check error", e);
     }
     return null;
  }
}
