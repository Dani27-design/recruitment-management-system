import { describe, expect, it, vi } from 'vitest';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  it('finds a user by email through Prisma', async () => {
    const findUnique = vi.fn().mockResolvedValue({ id: 'user-1', email: 'admin@rms.local' });
    const repository = new UserRepository({
      user: { findUnique },
    } as any);

    await expect(repository.findByEmail('admin@rms.local')).resolves.toEqual({
      id: 'user-1',
      email: 'admin@rms.local',
    });
    expect(findUnique).toHaveBeenCalledWith({
      where: { email: 'admin@rms.local' },
    });
  });
});
