import type { ErrorRequestHandler } from 'express';
import { AppError, TimeoutPdfError, GeneratePdfError } from '../errors';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const requestId = req.requestId;

  if (err instanceof AppError) {
    const body = { requestId, code: err.code, message: err.message, details: err.details };
    console.error(
      JSON.stringify({ level: 'error', requestId, code: err.code, message: err.message, details: err.details }),
    );
    return res.status(err.status).json(body);
  }

  if (err instanceof TimeoutPdfError) {
    const body = { requestId, code: 'TIMEOUT', message: err.message };
    console.error(JSON.stringify({ level: 'error', requestId, code: 'TIMEOUT', message: err.message }));
    return res.status(504).json(body);
  }
  if (err instanceof GeneratePdfError) {
    const body = { requestId, code: 'INTERNAL_ERROR', message: err.message };
    console.error(JSON.stringify({ level: 'error', requestId, code: 'INTERNAL_ERROR', message: err.message }));
    return res.status(500).json(body);
  }

  const body = { requestId, code: 'INTERNAL_ERROR', message: (err as Error).message };
  console.error(JSON.stringify({ level: 'error', requestId, code: 'INTERNAL_ERROR', message: (err as Error).message }));
  return res.status(500).json(body);
};
