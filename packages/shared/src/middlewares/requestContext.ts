import type { RequestHandler } from 'express';
import { randomUUID } from 'crypto';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      requestId?: string;
      startTime?: number;
    }
  }
}

export const requestContext: RequestHandler = (req, _res, next) => {
  req.requestId = req.headers['x-request-id']?.toString() || randomUUID();
  req.startTime = Date.now();
  next();
};
