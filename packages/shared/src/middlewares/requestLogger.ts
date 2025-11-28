import type { RequestHandler } from 'express';

export const requestLogger: RequestHandler = (req, res, next) => {
  const id = req.requestId;
  const start = req.startTime || Date.now();
  const { method, originalUrl } = req;

  res.on('finish', () => {
    const ms = Date.now() - start;
    const log = {
      level: 'info',
      requestId: id,
      method,
      url: originalUrl,
      status: res.statusCode,
      durationMs: ms,
    };
    console.log(JSON.stringify(log));
  });

  next();
};
