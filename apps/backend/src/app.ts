import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { env } from './config/env';
import { authRoutes } from './routes/auth.routes';
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

  app.use('/auth', authRoutes);

  app.use(errorHandler);

  return app;
}
