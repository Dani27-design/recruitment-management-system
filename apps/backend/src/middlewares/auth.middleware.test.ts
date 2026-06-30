import { describe, expect, it, vi } from 'vitest';
import { signAccessToken } from '../utils/jwt';
import { UnauthorizedError } from '../utils/app-error';
import { authenticate } from './auth.middleware';

describe('authenticate', () => {
  it('attaches verified token payload to the request user', () => {
    const token = signAccessToken({
      id: 'user-1',
      email: 'admin@rms.local',
      role: 'ADMINISTRATOR',
    });
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as any;
    const next = vi.fn();

    authenticate(req, {} as any, next);

    expect(req.user).toMatchObject({
      id: 'user-1',
      email: 'admin@rms.local',
      role: 'ADMINISTRATOR',
    });
    expect(next).toHaveBeenCalledOnce();
  });

  it('rejects requests without bearer tokens', () => {
    expect(() => authenticate({ headers: {} } as any, {} as any, vi.fn())).toThrow(
      UnauthorizedError,
    );
  });
});
