// src/server/routes/mvp.routes.ts
import { Router } from "express";
import { GoogleGenAI } from '@google/genai';

const router = Router();

router.post("/analisar", async (req, res) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
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
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    const parsed = JSON.parse(result.text || "{}");
    res.json(parsed);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post("/edujarvis", async (req, res) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: `Atue como Tutor EduJarvis: ${req.body.message}` }] }]
    });

    const responseText = result.text;
    
    // Log to Supabase
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
      const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
      if (supabaseUrl && supabaseKey) {
         const supabase = createClient(supabaseUrl, supabaseKey);
         await supabase.rpc("registrar_log_edujarvis", {
            p_tenant_id: null,
            p_user_id: null, // Depending on auth setup
            p_role: "aluno",
            p_agente: "TutorIA",
            p_modelo: "gemini-2.0-flash",
            p_mensagem: req.body.message,
            p_resposta: responseText,
            p_custo_estimado: 0
         });
      }
    } catch(e) {
      console.warn("Failed to log to Supabase", e);
    }

    res.json({ response: responseText });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

export default router;
