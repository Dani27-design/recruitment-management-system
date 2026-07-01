import { describe, expect, it, vi } from 'vitest';

vi.mock('../api/http', () => ({
  http: {
    get: vi.fn(),
  },
}));

describe('user-service', () => {
  it('lists managers from the backend API wrapper', async () => {
    const managers = [{ id: 'manager-1', email: 'manager@rms.local', role: 'MANAGER' }];
    const { http } = await import('../api/http');
    const { listManagers } = await import('./user-service');
    vi.mocked(http.get).mockResolvedValue({
      data: { success: true, message: 'OK', data: managers },
    });

    await expect(listManagers()).resolves.toEqual(managers);
    expect(http.get).toHaveBeenCalledWith('/users/managers');
  });
});
