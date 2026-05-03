import { Router } from "express";
import { CodeReviewAgent } from "../../services/edujarvis/agents/CodeReviewAgent";
import { DropoutRiskAgent } from "../../services/edujarvis/agents/DropoutRiskAgent";
import { DashboardInsightAgent } from "../../services/edujarvis/agents/DashboardInsightAgent";
import { LessonCreatorAgent } from "../../services/edujarvis/agents/LessonCreatorAgent";

const router = Router();

router.post("/code-review", async (req, res) => {
  try {
    const result = await CodeReviewAgent.execute(req.body.message || req.body.codigoAluno, req.body);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/dropout-risk", async (req, res) => {
  try {
    const result = await DropoutRiskAgent.execute(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/dashboard-insight", async (req, res) => {
  try {
    const { tituloGrafico, dados, perfilUsuario } = req.body;
    const insight = await DashboardInsightAgent.execute(tituloGrafico, dados, perfilUsuario);
    res.json({ insight });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/lesson-create", async (req, res) => {
  try {
    const lesson = await LessonCreatorAgent.execute(req.body);
    res.json({ lesson });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
