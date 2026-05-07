// src/server/routes/mvp.routes.ts
import { Router } from "express";
import { GoogleGenAI } from "@/services/aiClient";const router = Router();

router.post("/analisar", async (req, res) => {
  try {
    const ai = new GoogleGenAI({});
    const prompt = `
    Você é o EduJarvis. Analise o desempenho do aluno. 
    Score: ${req.body.score}
    Retorne em JSON:
    {
      "pontosFortes": [],
      "pontosFracos": [],
      "conteudosRevisao": [],
      "planoEstudoContextual": ""
    }
    `;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    const parsed = JSON.parse(result.text || "{}");
    res.json(parsed);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post("/edujarvis", async (req, res) => {
  try {
    const ai = new GoogleGenAI({});
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: `Atue como Tutor EduJarvis: ${req.body.message}` }] }]
    });

    const responseText = result.text;
    
    // Log to API/DB (to be implemented via backend service)
    try {
      // API Call could go here
    } catch(e) {
      console.warn("Failed to log EduJarvis interaction", e);
    }

    res.json({ response: responseText });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

export default router;
