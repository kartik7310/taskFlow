import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/api-error.js';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let { statusCode, message } = err;

  if (err instanceof ZodError) {
    statusCode = 422;
    message = err.issues[0]?.message || 'Validation failed';
  } else if (!(err instanceof ApiError)) {
    statusCode = statusCode || 500;
    message = message || 'Internal Server Error';
  }

  const response = {
    message,
    ...(err instanceof ZodError ? { error: message } : {}),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  if (err instanceof ZodError) {
     return res.status(statusCode).json({
         message: 'Validation failed',
         error: message
     });
  }

  res.status(statusCode).json(response);
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new ApiError(404, `Not found - ${req.originalUrl}`);
  next(error);
};
