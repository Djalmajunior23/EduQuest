// src/server/routes/phase12Advanced.routes.ts
import { Router } from "express";
import { CurriculumAutopilotAdvanced } from "../../services/edujarvis/CurriculumAutopilotAdvanced";
import { AgentMarketplaceService } from "../../services/edujarvis/AgentMarketplaceService";
import { AdvancedSimulationAgent } from "../../services/edujarvis/AdvancedSimulationAgent";
import { CareerDashboardService } from "../../services/edujarvis/CareerDashboardService";
import { SkillsGraphService } from "../../services/edujarvis/SkillsGraphService";
import { PortfolioBuilderAgent } from "../../services/edujarvis/PortfolioBuilderAgent";
import { JobReadinessAgent } from "../../services/edujarvis/JobReadinessAgent";
import { IndustryAlignmentService } from "../../services/edujarvis/IndustryAlignmentService";

const router = Router();

router.post("/curriculum-autopilot", async (req, res) => {
  try {
    const result = await CurriculumAutopilotAdvanced.analyze(req.body);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/agent-marketplace/run", async (req, res) => {
  try {
    const result = await AgentMarketplaceService.runAgent(req.body);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/simulation/advanced/create", async (req, res) => {
  try {
    const result = await AdvancedSimulationAgent.createSimulation(req.body);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/career/dashboard", async (req, res) => {
  try {
    const result = await CareerDashboardService.buildDashboard(req.body);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/skills/path", (req, res) => {
  try {
    const result = SkillsGraphService.recommendPath(req.body);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/portfolio/build", async (req, res) => {
  try {
    const result = await PortfolioBuilderAgent.build(req.body);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/job-readiness", async (req, res) => {
  try {
    const result = await JobReadinessAgent.evaluate(req.body);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/industry-alignment", (req, res) => {
  try {
    const result = IndustryAlignmentService.calculate(req.body);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
