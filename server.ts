import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// Legacy AI Services (Redundant or Deactivated)
// import advancedAIRoutes from './src/server/routes/advancedAI.routes';
// import adaptiveExamRoutes from './src/server/routes/adaptiveExam.routes';

// New Backend Modules (from src/server)
import authRoutes from './src/server/modules/auth/auth.routes';
import turmaRoutes from './src/server/modules/turmas/turmas.routes';
import atividadeRoutes from './src/server/modules/atividades/atividades.routes';
import cursoRoutes from './src/server/modules/cursos/cursos.routes';
import tenantRoutes from './src/server/modules/tenants/tenants.routes';
import simuladoRoutes from './src/server/modules/simulados/simulados.routes';
import usuarioRoutes from './src/server/modules/usuarios/usuarios.routes';
import questoesRoutes from './src/server/modules/questoes/questoes.routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(helmet({
    contentSecurityPolicy: false, // For easier integration with cross-origin assets if needed
  }));
  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Health check route
  app.get('/health', (req, res) => {
    res.status(200).send('UP');
  });

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Modules
  app.use('/api/auth', authRoutes);
  app.use('/api/turmas', turmaRoutes);
  app.use('/api/atividades', atividadeRoutes);
  app.use('/api/cursos', cursoRoutes);
  app.use('/api/tenants', tenantRoutes);
  app.use('/api/simulados', simuladoRoutes);
  app.use('/api/usuarios', usuarioRoutes);
  app.use('/api/questoes', questoesRoutes);

  // IA Routes (New Neural Core API)
  app.post('/api/ai/generate', async (req, res) => {
    try {
      const { model, contents, systemInstruction, config } = req.body;
      const { GoogleGenAI } = await import('@google/genai');
      const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      const result = await genAI.models.generateContent({
        model: model || 'gemini-3-flash-preview',
        systemInstruction: systemInstruction,
        contents: contents,
        config: config
      });

      res.json({ text: result.text });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, profile, context } = req.body;
      const { EduJarvisService } = await import('./src/services/edujarvis-service');
      const response = await EduJarvisService.sendMessage(message, profile, context);
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Legacy/Phase Routes (Deactivated for system cleanup)
  // app.use('/api/advanced-ai', advancedAIRoutes);
  // app.use('/api/adaptive-exam', adaptiveExamRoutes);
  // ...

  // n8n Webhook Proxy
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
    
    // Validate Database Connection AFTER starting the server (non-blocking)
    import('./src/lib/prisma').then(({ prisma }) => {
      prisma.$connect()
        .then(() => console.log('Successfully connected to Neon PostgreSQL'))
        .catch(err => console.error('Failed to connect to database asynchronously:', err));
    }).catch(err => console.error('Failed to load Prisma client:', err));
  });
}

startServer().catch(err => {
  console.error('Critical server error:', err);
  process.exit(1);
});
