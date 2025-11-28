import { Router } from 'express';
import { asyncHandler } from '@web-infra/shared';
import { PdfService } from '../services/pdfService';
import { PdfController } from '../controllers/pdfController';
import { validatePdfRequest } from '../validators/pdfValidator';

export function createPdfRouter(pdfService: PdfService): Router {
  const router = Router();
  const controller = new PdfController(pdfService);

  router.post('/pdf', validatePdfRequest, asyncHandler(controller.generate));

  return router;
}
