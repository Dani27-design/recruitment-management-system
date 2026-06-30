import { describe, expect, it, vi } from 'vitest';
import { AuthController } from './auth.controller';

function createResponse() {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };

  return res as any;
}

describe('AuthController', () => {
  it('returns standardized login responses', async () => {
    const controller = new AuthController({
      login: vi.fn().mockResolvedValue({
        accessToken: 'token',
        user: { id: 'user-1', email: 'admin@rms.local', role: 'ADMINISTRATOR' },
      }),
    } as any);
    const res = createResponse();

    await controller.login(
      { body: { email: 'admin@rms.local', password: 'Admin@12345' } } as any,
      res,
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Login successful',
      data: {
        accessToken: 'token',
        user: { id: 'user-1', email: 'admin@rms.local', role: 'ADMINISTRATOR' },
      },
    });
  });

  it('returns standardized logout responses', async () => {
    const controller = new AuthController({} as any);
    const res = createResponse();

    await controller.logout({} as any, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Logout successful',
      data: null,
    });
  });
});
