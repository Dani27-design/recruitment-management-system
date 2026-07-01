import { describe, expect, it, vi } from 'vitest';
import { UserController } from './user.controller';

function createResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any;
}

describe('UserController', () => {
  it('returns standardized manager list responses', async () => {
    const managers = [{ id: 'manager-1', email: 'manager@rms.local', role: 'MANAGER' }];
    const controller = new UserController({
      listManagers: vi.fn().mockResolvedValue(managers),
    } as any);
    const res = createResponse();

    await controller.listManagers({} as any, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Managers retrieved successfully',
      data: managers,
    });
  });
});
