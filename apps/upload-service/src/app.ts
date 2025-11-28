import express from 'express';
import cors from 'cors';
import { requestContext, requestLogger, errorHandler } from '@web-infra/shared';
import { UploadService } from './services/uploadService';
import { createUploadRouter } from './routes/upload';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(requestContext);
  app.use(requestLogger);
  app.use(express.json());

  const uploadService = new UploadService();

  // Health check
  app.get('/', (_req, res) => {
    res.send('Upload Service is running!');
  });

  // Upload Routes
  app.use('/api/v1', createUploadRouter(uploadService));

  app.use(errorHandler);

  return app;
}
