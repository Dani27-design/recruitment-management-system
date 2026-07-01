import { describe, expect, it, vi } from 'vitest';
import { DashboardController } from './dashboard.controller';

describe('DashboardController', () => {
  it('returns dashboard summary responses', async () => {
    const summary = {
      total_candidates: 0,
      total_active_vacancies: 0,
      total_recruitments: 0,
      recruitment_count_by_current_stage: {},
      recruitment_count_by_current_status: {},
    };
    const controller = new DashboardController({
      getSummary: vi.fn().mockResolvedValue(summary),
    } as any);
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };

    await controller.summary({} as any, res as any);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Dashboard summary retrieved successfully',
      data: summary,
    });
  });
});
