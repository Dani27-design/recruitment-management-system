import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/app-error';
import { buildErrorResponse } from '../utils/api-response';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    return res.status(400).json(buildErrorResponse('Validation failed', error.flatten()));
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json(buildErrorResponse(error.message, error.details));
  }

  return res.status(500).json(buildErrorResponse('Internal server error'));
};
