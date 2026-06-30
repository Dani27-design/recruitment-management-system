import { describe, expect, it, vi } from 'vitest';

vi.stubEnv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/rms');
vi.stubEnv('JWT_SECRET', 'unit-test-secret');
vi.stubEnv('JWT_EXPIRES_IN', '1h');

describe('jwt utilities', () => {
  it('signs and verifies JWT access tokens', async () => {
    const { signAccessToken, verifyAccessToken } = await import('./jwt');

    const token = signAccessToken({
      id: 'user-1',
      email: 'admin@rms.local',
      role: 'ADMINISTRATOR',
    });

    const payload = verifyAccessToken(token);

    expect(payload.id).toBe('user-1');
    expect(payload.email).toBe('admin@rms.local');
    expect(payload.role).toBe('ADMINISTRATOR');
  });
});
