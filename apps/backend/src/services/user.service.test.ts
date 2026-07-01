import { describe, expect, it, vi } from 'vitest';
import { UserService } from './user.service';

describe('UserService', () => {
  it('lists manager users', async () => {
    const managers = [{ id: 'manager-1', email: 'manager@rms.local', role: 'MANAGER' }];
    const service = new UserService({
      findManagers: vi.fn().mockResolvedValue(managers),
    } as any);

    await expect(service.listManagers()).resolves.toEqual(managers);
  });
});
