import { describe, expect, it } from 'vitest';
import { AppError, ForbiddenError, UnauthorizedError } from './app-error';

describe('AppError', () => {
  it('stores status code and details', () => {
    const error = new AppError('Invalid request', 400, { field: 'email' });

    expect(error.message).toBe('Invalid request');
    expect(error.statusCode).toBe(400);
    expect(error.details).toEqual({ field: 'email' });
  });

  it('creates authorization errors with documented HTTP status codes', () => {
    expect(new UnauthorizedError().statusCode).toBe(401);
    expect(new ForbiddenError().statusCode).toBe(403);
  });
});
