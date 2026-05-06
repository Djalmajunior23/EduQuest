import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateQuestions, generateSA } from './src/services/aiAssistantService';
import advancedAIRoutes from './src/server/routes/advancedAI.routes';
import adaptiveExamRoutes from './src/server/routes/adaptiveExam.routes';
import phase07Routes from './src/server/routes/phase07.routes';
import phase11Routes from './src/server/routes/phase11.routes';
import phase12Routes from './src/server/routes/phase12.routes';
import phase12AdvancedRoutes from './src/server/routes/phase12Advanced.routes';
import phase13Routes from './src/server/routes/phase13.routes';
import mvpRoutes from './src/server/routes/mvp.routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check route for Nginx/Traefik
  app.get('/health', (req, res) => {
    res.status(200).send('UP');
  });

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // IA Routes (Server-side to protect GEMINI_API_KEY)

  app.post('/api/ai/generate-questions', async (req, res) => {
    try {
      const { prompt } = req.body;
      const questions = await generateQuestions(prompt);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post('/api/ai/generate-sa', async (req, res) => {
    try {
      const { context } = req.body;
      const sa = await generateSA(context);
      res.json({ content: sa });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Fase 4 Routes
  app.use('/api/advanced-ai', advancedAIRoutes);
  app.use('/api/adaptive-exam', adaptiveExamRoutes);
  app.use('/api/phase07', phase07Routes);
  app.use('/api/phase11', phase11Routes);
  app.use('/api/phase12', phase12Routes);
  app.use('/api/phase12-advanced', phase12AdvancedRoutes);
  app.use('/api/phase13', phase13Routes);
  app.use('/api/mvp', mvpRoutes);

  // n8n Webhook Proxy (Optional, but useful for keeping keys server-side)
  app.post('/api/webhook/n8n', async (req, res) => {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      return res.status(500).json({ error: 'N8N_WEBHOOK_URL not configured' });
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to trigger n8n webhook' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
