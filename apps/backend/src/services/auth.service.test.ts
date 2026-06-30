import type { User } from '@prisma/client';
import { describe, expect, it, vi } from 'vitest';
import { UnauthorizedError } from '../utils/app-error';
import { AuthService } from './auth.service';

const user: User = {
  id: 'user-1',
  email: 'admin@rms.local',
  password_hash: 'hashed-password',
  role: 'ADMINISTRATOR',
  created_at: new Date(),
  updated_at: new Date(),
};

describe('AuthService', () => {
  it('logs in valid users and returns token plus safe user data', async () => {
    const service = new AuthService(
      { findByEmail: vi.fn().mockResolvedValue(user) } as any,
      vi.fn().mockResolvedValue(true),
      vi.fn().mockReturnValue('signed-token'),
    );

    await expect(
      service.login({ email: 'admin@rms.local', password: 'Admin@12345' }),
    ).resolves.toEqual({
      accessToken: 'signed-token',
      user: {
        id: 'user-1',
        email: 'admin@rms.local',
        role: 'ADMINISTRATOR',
      },
    });
  });

  it('rejects missing users', async () => {
    const service = new AuthService(
      { findByEmail: vi.fn().mockResolvedValue(null) } as any,
      vi.fn(),
      vi.fn(),
    );

    await expect(
      service.login({ email: 'admin@rms.local', password: 'Admin@12345' }),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('rejects invalid passwords', async () => {
    const service = new AuthService(
      { findByEmail: vi.fn().mockResolvedValue(user) } as any,
      vi.fn().mockResolvedValue(false),
      vi.fn(),
    );

    await expect(
      service.login({ email: 'admin@rms.local', password: 'wrong-password' }),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
