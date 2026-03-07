import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    logger.info(
      {
        method: req.method,
        path: req.originalUrl || req.path,
        statusCode: res.statusCode,
        durationMs: Date.now() - start,
      },
      'http_request'
    );
  });

  next();
};