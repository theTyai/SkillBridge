import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

// Security & Logging Middlewares
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
// @ts-ignore
import xss from 'xss-clean';

// Routes & Custom Middlewares
import authRoutes from './src/routes/auth.routes.js';
import aiRoutes from './src/routes/ai.routes.js';
import studentRoutes from './src/routes/student.routes.js';
import opportunityRoutes from './src/routes/opportunity.routes.js';
import applicationRoutes from './src/routes/application.routes.js';
import institutionRoutes from './src/routes/institution.routes.js';
import storageRoutes from './src/routes/storage.routes.js';
import notificationRoutes from './src/routes/notification.routes.js';
import { errorHandler, notFoundHandler } from './src/middleware/errorHandler.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// 1. Global Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for Vite dev server compatibility
  crossOriginEmbedderPolicy: false
}));
app.use(xss());
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// 2. API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SkillBridge Backend API',
    version: '1.0.0',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY')
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/opportunities', opportunityRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/institutions', institutionRoutes);
app.use('/api/v1/storage', storageRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// 3. Frontend Static Serving / Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) return next();
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 4. Error Handling (Must be last)
  app.use('/api/*', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SkillBridge server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
