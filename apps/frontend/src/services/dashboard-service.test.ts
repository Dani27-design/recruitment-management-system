import { describe, expect, it, vi } from 'vitest';

vi.mock('../api/http', () => ({
  http: {
    get: vi.fn(),
  },
}));

const summary = {
  total_candidates: 4,
  total_active_vacancies: 2,
  total_recruitments: 3,
  recruitment_count_by_current_stage: {
    ACCEPTANCE: 0,
    APPLIED: 1,
    INTERVIEW: 0,
    SCREENING: 1,
    TECHNICAL_TEST: 1,
  },
  recruitment_count_by_current_status: {
    PASSED: 1,
    PENDING: 1,
    REJECTED: 1,
  },
};

describe('dashboard-service', () => {
  it('gets dashboard summary data', async () => {
    const { http } = await import('../api/http');
    const { getDashboardSummary } = await import('./dashboard-service');
    vi.mocked(http.get).mockResolvedValue({
      data: { success: true, message: 'OK', data: summary },
    });

    await expect(getDashboardSummary()).resolves.toEqual(summary);
    expect(http.get).toHaveBeenCalledWith('/dashboard/summary');
  });
});
