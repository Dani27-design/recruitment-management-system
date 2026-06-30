import { ZodError } from 'zod';
import { describe, expect, it, vi } from 'vitest';
import { AppError } from '../utils/app-error';
import { errorHandler } from './error-handler';

function createResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any;
}

describe('errorHandler', () => {
  it('formats Zod validation errors', () => {
    const res = createResponse();
    const error = new ZodError([
      {
        code: 'invalid_type',
        expected: 'string',
        received: 'undefined',
        path: ['body', 'email'],
        message: 'Required',
      },
    ]);

    errorHandler(error, {} as any, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].success).toBe(false);
  });

  it('formats AppError instances', () => {
    const res = createResponse();

    errorHandler(new AppError('Not found', 404), {} as any, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Not found',
    });
  });

  it('formats unknown errors as internal server errors', () => {
    const res = createResponse();

    errorHandler(new Error('boom'), {} as any, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal server error',
    });
  });
});
