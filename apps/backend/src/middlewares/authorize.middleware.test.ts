import { describe, expect, it, vi } from 'vitest';
import { ForbiddenError, UnauthorizedError } from '../utils/app-error';
import { authorize } from './authorize.middleware';

describe('authorize', () => {
  it('allows users with permitted roles', () => {
    const next = vi.fn();
    const middleware = authorize('ADMINISTRATOR');

    middleware({ user: { id: '1', email: 'admin@rms.local', role: 'ADMINISTRATOR' } } as any, {} as any, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it('rejects unauthenticated requests', () => {
    expect(() => authorize('ADMINISTRATOR')({} as any, {} as any, vi.fn())).toThrow(
      UnauthorizedError,
    );
  });

  it('rejects users without permitted roles', () => {
    expect(() =>
      authorize('ADMINISTRATOR')(
        { user: { id: '1', email: 'manager@rms.local', role: 'MANAGER' } } as any,
        {} as any,
        vi.fn(),
      ),
    ).toThrow(ForbiddenError);
  });
});
