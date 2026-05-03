import { Router } from "express";
import { AdaptiveExamService } from "../../services/edujarvis/AdaptiveExamService";

const router = Router();

router.post("/start", async (req, res) => {
  try {
    const { alunoId, turmaId } = req.body;
    const session = await AdaptiveExamService.createSession(alunoId, turmaId);
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/:sessaoId/next-question", async (req, res) => {
  try {
    const question = await AdaptiveExamService.getNextQuestion(
      req.params.sessaoId,
      req.query.tema as string
    );
    res.json({ question });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/answer", async (req, res) => {
  try {
    const result = await AdaptiveExamService.answerQuestion(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
