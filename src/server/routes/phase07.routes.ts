// src/server/routes/phase07.routes.ts
import { Router } from "express";
import { AuditService } from "../../services/edujarvis/AuditService";
import { WhiteLabelConfigService } from "../../services/edujarvis/WhiteLabelConfigService";
import { RAGService } from "../../services/edujarvis/RAGService";
import { MarketplaceService } from "../../services/edujarvis/MarketplaceService";
import { RealTimeMonitorService } from "../../services/edujarvis/RealTimeMonitorService";
import { MotivationService } from "../../services/edujarvis/MotivationService";
import { MultimodalTutorAgent } from "../../services/edujarvis/agents/MultimodalTutorAgent";
import { AssessmentAgent } from "../../services/edujarvis/agents/AssessmentAgent";
import { AgentQualityService } from "../../services/edujarvis/AgentQualityService";
import { StudentJourneyService } from "../../services/edujarvis/StudentJourneyService";
import { WorkflowEngineService } from "../../services/edujarvis/WorkflowEngineService";
import { SmartNotificationService } from "../../services/edujarvis/SmartNotificationService";
import { MonetizationService } from "../../services/edujarvis/MonetizationService";
import { ObservabilityService } from "../../services/edujarvis/ObservabilityService";
import { BenchmarkService } from "../../services/edujarvis/BenchmarkService";
import { EvaluationResult, AIEvaluationService } from "../../services/edujarvis/AIEvaluationService";
import { ApprovalWorkflowService } from "../../services/edujarvis/ApprovalWorkflowService";
import { PromptVersioningService } from "../../services/edujarvis/PromptVersioningService";
import { PluginService } from "../../services/edujarvis/PluginService";
import { PublicApiService } from "../../services/edujarvis/PublicApiService";
import { ModelVersioningService } from "../../services/edujarvis/ModelVersioningService";
import { GlobalIntelligenceService } from "../../services/edujarvis/GlobalIntelligenceService";
import { ResearchEngineService } from "../../services/edujarvis/ResearchEngineService";
import { StrategicDecisionIA } from "../../services/edujarvis/StrategicDecisionIA";

const router = Router();

// --- MIDDLEWARE DE API PÚBLICA (ENTERPRISE) ---
const publicApiAuth = async (req: any, res: any, next: any) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) return res.status(401).json({ error: "API Key missing" });
  
  const tenantId = await PublicApiService.validateKey(apiKey as string);
  if (!tenantId) return res.status(401).json({ error: "Invalid API Key" });
  
  req.tenantId = tenantId;
  next();
};

router.post("/public/v1/chat", publicApiAuth, async (req, res) => {
  // Simulação de endpoint público
  res.json({ message: "Request received via Enterprise Public API Gateway" });
});

router.post("/audit", async (req, res) => {
  try {
    await AuditService.logInteraction(req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/audit/summary", async (req, res) => {
  try {
    const summary = await AuditService.getTenantAuditSummary(req.query.tenantId as string);
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/tenant-config/:tenantId", async (req, res) => {
  try {
    const config = await WhiteLabelConfigService.getConfig(req.params.tenantId);
    res.json({ config });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/tenant-config", async (req, res) => {
  try {
    const config = await WhiteLabelConfigService.updateConfig(req.body.tenantId, req.body);
    res.json({ config });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/rag/document", async (req, res) => {
  try {
    const result = await RAGService.ingestDocument(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/rag/ask", async (req, res) => {
  try {
    const chunks = await RAGService.searchContext(req.body.question, req.body.tenantId);
    res.json({ chunks });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/assessment", async (req, res) => {
  try {
    const result = await AssessmentAgent.execute(req.body);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/classroom-monitor", async (req, res) => {
  try {
    const result = RealTimeMonitorService.analyzeClassroom(req.body.events || []);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/multimodal", async (req, res) => {
  try {
    const result = await MultimodalTutorAgent.execute(req.body);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/marketplace", async (req, res) => {
  try {
    const result = await MarketplaceService.createContent(req.body);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/marketplace/search", async (req, res) => {
  try {
    const result = await MarketplaceService.searchContent({
      queryText: req.query.q as string,
      tenantId: req.query.tenantId as string,
      visibility: req.query.visibility as any || 'public'
    });
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/motivation", async (req, res) => {
  try {
    const message = MotivationService.generateMotivationMessage(req.body);
    const mission = MotivationService.suggestMission(req.body);
    res.json({ message, mission });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/workflow/run", async (req, res) => {
  try {
    const result = await WorkflowEngineService.runEducationalWorkflow(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/journey/analyze", async (req, res) => {
  try {
    const result = StudentJourneyService.analyzeJourney(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/metrics/quality", async (req, res) => {
  try {
    const logs: any[] = []; // In real app, fetch from AuditService or direct query
    const report = AgentQualityService.analyzeQuality(logs);
    res.json({ report });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/notifications/generate", async (req, res) => {
  try {
    const notification = SmartNotificationService.generateNotification(req.body);
    res.json({ notification });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/monetization/check", async (req, res) => {
  try {
    const status = await MonetizationService.checkUsage(req.query.tenantId as string);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/benchmark", async (req, res) => {
  try {
    const result = BenchmarkService.generateBenchmark(req.body.groups || []);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// --- PHASE 10 ENTERPRISE ROUTES ---

router.get("/approvals", async (req, res) => {
  try {
    const requests = await ApprovalWorkflowService.getPendingRequests(req.query.tenantId as string);
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/approvals/process", async (req, res) => {
  try {
    const { requestId, status, userId } = req.body;
    await ApprovalWorkflowService.processRequest(requestId, status, userId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/plugins", async (req, res) => {
  try {
    const plugins = PluginService.getActivePlugins();
    res.json({ plugins });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/prompts/version", async (req, res) => {
  try {
    await PromptVersioningService.saveVersion(req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/evaluate", async (req, res) => {
  try {
    const evaluation = AIEvaluationService.evaluateResponse(req.body);
    res.json(evaluation);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// --- PHASE 11 INTELLIGENCE ROUTES ---

router.get("/intelligence/global-benchmarks", async (req, res) => {
  try {
    const data = await GlobalIntelligenceService.getGlobalBenchmarks(req.query.topic as string);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/intelligence/research", async (req, res) => {
  try {
    const insights = await ResearchEngineService.getInsights();
    res.json({ insights });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/intelligence/strategic", async (req, res) => {
  try {
    const insights = await StrategicDecisionIA.generateInsights(req.body);
    res.json(insights);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
