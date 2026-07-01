import { describe, expect, it, vi } from 'vitest';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('returns a standardized health check response', () => {
    const controller = new HealthController();
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };

    controller.check({} as any, res as any);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Health check passed',
      data: {
        status: 'ok',
      },
    });
  });
});
