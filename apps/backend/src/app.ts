import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { env } from './config/env';
import { auditRoutes } from './routes/audit.routes';
import { authRoutes } from './routes/auth.routes';
import { candidateRoutes } from './routes/candidate.routes';
import { dashboardRoutes } from './routes/dashboard.routes';
import { recruitmentDocumentRoutes } from './routes/recruitment-document.routes';
import { recruitmentStageRoutes } from './routes/recruitment-stage.routes';
import { recruitmentRoutes } from './routes/recruitment.routes';
import { userRoutes } from './routes/user.routes';
import { vacancyRoutes } from './routes/vacancy.routes';
import { errorHandler } from './middlewares/error-handler';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  app.use('/audit-logs', auditRoutes);
  app.use('/auth', authRoutes);
  app.use('/candidates', candidateRoutes);
  app.use('/dashboard', dashboardRoutes);
  app.use('/documents', recruitmentDocumentRoutes);
  app.use('/recruitments', recruitmentRoutes);
  app.use('/stages', recruitmentStageRoutes);
  app.use('/users', userRoutes);
  app.use('/vacancies', vacancyRoutes);

  app.use(errorHandler);

  return app;
}
