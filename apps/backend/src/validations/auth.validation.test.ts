import { describe, expect, it } from 'vitest';
import { loginSchema } from './auth.validation';

describe('loginSchema', () => {
  it('accepts valid login payloads', () => {
    const parsed = loginSchema.parse({
      body: {
        email: 'admin@rms.local',
        password: 'Admin@12345',
      },
    });

    expect(parsed.body.email).toBe('admin@rms.local');
  });

  it('rejects invalid email payloads', () => {
    expect(() =>
      loginSchema.parse({
        body: {
          email: 'not-an-email',
          password: 'Admin@12345',
        },
      }),
    ).toThrow();
  });
});
