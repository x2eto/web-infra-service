import type { RequestHandler } from 'express';
import type { PdfRequestBody } from '@web-infra/shared';

export const validatePdfRequest: RequestHandler<Record<string, any>, any, PdfRequestBody, any> = (req, res, next) => {
  const { url } = req.body || ({} as PdfRequestBody);
  if (!url) return res.status(400).send({ error: 'URL is required' });
  try {
    new URL(url);
  } catch {
    return res.status(400).send({ error: 'Invalid URL format' });
  }
  next();
};
