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
import notificationRoutes from './src/server/modules/notifications/notifications.routes';
import adminCommRoutes from './src/server/modules/admin/communication.routes';
import emailRoutes from './src/server/modules/email/email.routes';

import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import { sanitize } from './src/server/lib/security';
import { authMiddleware, authorize } from './src/server/middlewares/auth.middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.set('trust proxy', true); // Trust all proxies in AI Studio/Cloud Run environment
  const PORT = 3000; // Hardcoded for AI Studio compatibility

  // Security Middlewares
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://apis.google.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "https://images.unsplash.com"],
        connectSrc: ["'self'", "https://generativelanguage.googleapis.com", "*.google-analytics.com"],
        frameAncestors: ["'self'", "https://aistudio.google.com", "https://ai.studio"], // AI Studio support
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // CORS Restriction (Whitelist in production)
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['*'];
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS access denied'), false);
      }
    },
    credentials: true
  }));

  app.use(morgan('dev')); // Use dev format for better readability
  app.use(express.json({ limit: '1mb' })); 
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cookieParser());
  app.use(hpp()); // HTTP Parameter Pollution protection

  // Global Sanitization Middleware
  app.use((req, res, next) => {
    if (req.body) req.body = sanitize(req.body);
    if (req.query) req.query = sanitize(req.query);
    if (req.params) req.params = sanitize(req.params);
    next();
  });

  // Rate Limiting
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: any) => req.user?.id || req.ip || 'anonymous',
    validate: false, // Silence startup validation warnings
    message: { error: 'Muitas solicitações, por favor tente mais tarde.' }
  });
  app.use('/api/', apiLimiter);

  // Health check route
  app.get('/health', (req, res) => {
    res.status(200).send('UP');
  });

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      environment: process.env.NODE_ENV || 'development',
      database: 'connected',
      email: process.env.RESEND_API_KEY ? 'configured' : 'disabled',
      version: '1.0.0',
      uptime: process.uptime()
    });
  });

  // API Modules
  app.use('/api/auth', authRoutes);
  
  // Protected Routes
  app.use('/api/turmas', authMiddleware, turmaRoutes);
  app.use('/api/atividades', authMiddleware, atividadeRoutes);
  app.use('/api/cursos', authMiddleware, cursoRoutes);
  app.use('/api/tenants', authMiddleware, tenantRoutes);
  app.use('/api/simulados', authMiddleware, simuladoRoutes);
  app.use('/api/usuarios', authMiddleware, usuarioRoutes);
  app.use('/api/questoes', authMiddleware, questoesRoutes);
  app.use('/api/notifications', authMiddleware, notificationRoutes);
  app.use('/api/admin/communication', authMiddleware, authorize(['ADMIN']), adminCommRoutes);
  app.use('/api/email', emailRoutes);

  // IA Routes - Highly Secured
  const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // Max 20 IA calls per hour per user
    keyGenerator: (req: any) => req.user?.id || req.ip || 'anonymous',
    validate: false,
    message: { error: 'Limite de IA excedido para este período.' }
  });

  app.post('/api/ai/generate', authMiddleware, aiLimiter, async (req, res) => {
    try {
      const { model, contents, systemInstruction, config } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is required');
      }
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      
      const responseModel = genAI.getGenerativeModel({ 
        model: model || 'gemini-1.5-flash',
        systemInstruction: systemInstruction 
      });
      
      const result = await responseModel.generateContent({
        contents: contents,
        ...config
      });

      res.json({ text: result.response.text() });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post('/api/edujarvis/chat', authMiddleware, aiLimiter, async (req, res) => {
    try {
      const { message, profile, context, action, agentId } = req.body;
      const { EduJarvisService } = await import('./src/services/edujarvis-service');
      
      const response = await EduJarvisService.sendMessage(message, profile, { ...context, agentId, action });
      res.json({ ...response, success: true, source: 'ai' });
    } catch (error: any) {
      console.error("[EduJarvis] Erro real:", {
        message: error?.message,
        stack: error?.stack,
        url: req.url,
      });

      // Fallback response
      const fallbackMessage = getLocalEduJarvisFallback(action, message);
      res.json({
        success: true,
        source: 'fallback',
        message: fallbackMessage,
        role: 'ASSISTANT',
        timestamp: new Date().toISOString(),
      });
    }
  });

  function getLocalEduJarvisFallback(action: string, userMessage: string) {
    const actions: Record<string, string> = {
      criar_atividade:
        "Posso ajudar a estruturar uma atividade prática. Informe tema, turma, duração e objetivo.",
      gerar_estudo_caso:
        "Para gerar um estudo de caso, informe o curso, contexto, problema e competências avaliadas.",
      criar_aula_invertida:
        "Para criar uma aula invertida, informe tema, recursos disponíveis e produto esperado.",
      gerar_questoes:
        "Informe tema, quantidade de questões, nível de dificuldade e tipo de questão.",
      analisar_desempenho:
        "Para analisar desempenho, preciso dos dados da turma, notas ou resultados do simulado.",
      corrigir_codigo:
        "Envie o código do aluno, linguagem usada e critérios de avaliação.",
      risco_evasao:
        "Para analisar risco de evasão, preciso de presença, notas, entregas e participação.",
      plano_recuperacao:
        "Informe a dificuldade do aluno, competência não atingida e prazo disponível.",
      aula_completa:
        "Informe tema, carga horária, perfil da turma e objetivo da aula."
    };
    return actions[action] || "Estou em modo seguro. A IA externa não respondeu, mas posso orientar seu processo pedagógico. Descreva o que deseja fazer.";
  }

  // Generic/Fallback Routes for table-based calls
  const { default: genericRoutes } = await import('./src/server/modules/generic/generic.routes');
  app.use('/api', authMiddleware, genericRoutes);

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
