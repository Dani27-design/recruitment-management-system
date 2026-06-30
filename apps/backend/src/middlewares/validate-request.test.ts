import { z } from 'zod';
import { describe, expect, it, vi } from 'vitest';
import { validateRequest } from './validate-request';

describe('validateRequest', () => {
  it('passes valid requests to the next middleware', () => {
    const next = vi.fn();
    const middleware = validateRequest(
      z.object({
        body: z.object({ email: z.string().email() }),
      }),
    );

    middleware({ body: { email: 'admin@rms.local' }, params: {}, query: {} } as any, {} as any, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it('throws validation errors for invalid requests', () => {
    const middleware = validateRequest(
      z.object({
        body: z.object({ email: z.string().email() }),
      }),
    );

    expect(() =>
      middleware({ body: { email: 'invalid' }, params: {}, query: {} } as any, {} as any, vi.fn()),
    ).toThrow();
  });
});
