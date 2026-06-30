import type { Response } from 'express';

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiFailure {
  success: false;
  message: string;
  errors?: unknown;
}

export function buildSuccessResponse<T>(message: string, data: T): ApiSuccess<T> {
  return {
    success: true,
    message,
    data,
  };
}

export function buildErrorResponse(message: string, errors?: unknown): ApiFailure {
  return {
    success: false,
    message,
    ...(errors === undefined ? {} : { errors }),
  };
}

export function sendSuccess<T>(res: Response, statusCode: number, message: string, data: T) {
  return res.status(statusCode).json(buildSuccessResponse(message, data));
}
