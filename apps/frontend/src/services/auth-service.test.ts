import { describe, expect, it, vi } from 'vitest';

vi.mock('../api/http', () => ({
  http: {
    post: vi.fn(),
  },
}));

describe('auth-service', () => {
  it('returns login response data from the backend API wrapper', async () => {
    const { http } = await import('../api/http');
    const { loginRequest } = await import('./auth-service');

    vi.mocked(http.post).mockResolvedValue({
      data: {
        success: true,
        message: 'Login successful',
        data: {
          accessToken: 'token',
          user: { id: '1', email: 'admin@rms.local', role: 'ADMINISTRATOR' },
        },
      },
    });

    await expect(
      loginRequest({ email: 'admin@rms.local', password: 'Admin@12345' }),
    ).resolves.toEqual({
      accessToken: 'token',
      user: { id: '1', email: 'admin@rms.local', role: 'ADMINISTRATOR' },
    });
  });
});
