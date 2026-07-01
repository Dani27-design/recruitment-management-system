import { describe, expect, it, vi } from 'vitest';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  it('finds users by email and id through Prisma', async () => {
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

    await expect(repository.findById('user-1')).resolves.toEqual({
      id: 'user-1',
      email: 'admin@rms.local',
    });
    expect(findUnique).toHaveBeenCalledWith({
      where: { id: 'user-1' },
    });
  });

  it('lists manager users for assignment', async () => {
    const findMany = vi.fn().mockResolvedValue([
      { id: 'manager-1', email: 'manager@rms.local', role: 'MANAGER' },
    ]);
    const repository = new UserRepository({
      user: { findMany },
    } as any);

    await expect(repository.findManagers()).resolves.toEqual([
      { id: 'manager-1', email: 'manager@rms.local', role: 'MANAGER' },
    ]);
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { role: 'MANAGER' },
        orderBy: { email: 'asc' },
      }),
    );
  });
});
