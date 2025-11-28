import express from 'express';
import cors from 'cors';
import { requestContext, requestLogger, errorHandler } from '@web-infra/shared';
import { getBrowser } from './browser';
import { PdfService } from './services/pdfService';
import { createPdfRouter } from './routes/pdf';

export async function createApp() {
  const app = express();
  app.use(cors());
  app.use(requestContext);
  app.use(requestLogger);
  app.use(express.json());

  const browser = await getBrowser();
  const pdfService = new PdfService(browser);

  // Health check
  app.get('/', (_req, res) => {
    res.send('PDF Service is running!');
  });

  // PDF Routes
  app.use('/api/v1', createPdfRouter(pdfService));

  app.use(errorHandler);

  return app;
}
