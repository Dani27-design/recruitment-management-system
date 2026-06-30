import { describe, expect, it, vi } from 'vitest';
import { asyncHandler } from './async-handler';

describe('asyncHandler', () => {
  it('passes rejected errors to next', async () => {
    const error = new Error('failure');
    const next = vi.fn();
    const handler = asyncHandler(async () => {
      throw error;
    });

    handler({} as any, {} as any, next);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(next).toHaveBeenCalledWith(error);
  });
});
