// src/server/routes/phase12.routes.ts
import { Router } from "express";
import { AutonomousOSService } from "../../services/edujarvis/AutonomousOSService";
import { CurriculumAutopilot } from "../../services/edujarvis/CurriculumAutopilot";
import { CareerSkillsService } from "../../services/edujarvis/CareerSkillsService";
import { DigitalCredentialService } from "../../services/edujarvis/DigitalCredentialService";
import { SimulationLabService } from "../../services/edujarvis/SimulationLabService";

const router = Router();

router.post("/os/orchestrate", async (req, res) => {
  try {
    const result = await AutonomousOSService.orchestrate(req.body.tenantId, req.body.stats);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/curriculum/autopilot", async (req, res) => {
  try {
    const result = await CurriculumAutopilot.analyzeAndPropose(req.body.tenantId, req.body.performanceData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/career/generate", async (req, res) => {
  try {
    const result = await CareerSkillsService.generateCareerPath(req.body.alunoId, req.body.tenantId, req.body.profile);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/career/:tenantId/:alunoId", async (req, res) => {
  try {
    const result = await CareerSkillsService.getCareerPath(req.params.alunoId, req.params.tenantId);
    res.json({ path: result });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/credentials/issue", async (req, res) => {
  try {
    await DigitalCredentialService.issueCredential(req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/credentials/:alunoId", async (req, res) => {
  try {
    const creds = await DigitalCredentialService.getStudentCredentials(req.params.alunoId);
    res.json({ credentials: creds });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/simulation/start", async (req, res) => {
  try {
    const result = await SimulationLabService.startLabSession(req.body.tenantId, req.body.alunoId, req.body.scenario);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/credentials/verify/:code", async (req, res) => {
  try {
    const verification = await DigitalCredentialService.verifyCredential(req.params.code);
    res.json(verification);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
