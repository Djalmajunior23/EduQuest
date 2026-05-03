// src/server/routes/phase11.routes.ts
import { Router } from "express";
import { DataLakeService } from "../../services/edujarvis/DataLakeService";
import { GlobalIntelligenceService } from "../../services/edujarvis/GlobalIntelligenceService";
import { AdvancedPersonalizationService } from "../../services/edujarvis/AdvancedPersonalizationService";
import { AutoImprovementService } from "../../services/edujarvis/AutoImprovementService";
import { StrategicDecisionIA } from "../../services/edujarvis/StrategicDecisionIA";
import { GlobalMentorAgent } from "../../services/edujarvis/agents/GlobalMentorAgent";

const router = Router();

router.post("/data-lake/event", async (req, res) => {
  try {
    await DataLakeService.registerEvent(req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/data-lake/:tenantId/summary", async (req, res) => {
  try {
    const summary = await DataLakeService.getTenantSummary(req.params.tenantId);
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/personalization/recommend", async (req, res) => {
  try {
    const recommendation = await AdvancedPersonalizationService.getPersonalizedRecommendation(req.body.profile, req.body.topic);
    res.json({ recommendation });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/auto-improvement/experiment", async (req, res) => {
  try {
    await AutoImprovementService.createExperiment(req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/strategic-decision", async (req, res) => {
  try {
    const report = await StrategicDecisionIA.generateInsights(req.body);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/mentor", async (req, res) => {
  try {
    const { expertise, message, context } = req.body;
    const response = await GlobalMentorAgent.execute(expertise, message, context);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
