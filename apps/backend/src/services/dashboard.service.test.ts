import { describe, expect, it, vi } from 'vitest';
import { DashboardService } from './dashboard.service';

const now = new Date('2026-07-02T00:00:00.000Z');

describe('DashboardService', () => {
  it('builds dashboard summary statistics from current system data', async () => {
    const repository = {
      countActiveVacancies: vi.fn().mockResolvedValue(2),
      countCandidates: vi.fn().mockResolvedValue(4),
      countRecruitments: vi.fn().mockResolvedValue(3),
      listRecruitmentStageSnapshots: vi.fn().mockResolvedValue([
        {
          id: 'recruitment-1',
          stages: [{ stage: 'APPLIED', status: 'PENDING', created_at: now }],
        },
        {
          id: 'recruitment-2',
          stages: [
            { stage: 'APPLIED', status: 'PASSED', created_at: now },
            { stage: 'SCREENING', status: 'PENDING', created_at: now },
          ],
        },
        {
          id: 'recruitment-3',
          stages: [{ stage: 'APPLIED', status: 'REJECTED', created_at: now }],
        },
      ]),
    };
    const service = new DashboardService(repository as any);

    await expect(service.getSummary()).resolves.toEqual({
      total_candidates: 4,
      total_active_vacancies: 2,
      total_recruitments: 3,
      recruitment_count_by_current_stage: {
        ACCEPTANCE: 0,
        APPLIED: 2,
        INTERVIEW: 0,
        SCREENING: 1,
        TECHNICAL_TEST: 0,
      },
      recruitment_count_by_current_status: {
        PASSED: 0,
        PENDING: 2,
        REJECTED: 1,
      },
    });
  });

  it('returns stable zero counts for empty dashboard data', async () => {
    const service = new DashboardService({
      countActiveVacancies: vi.fn().mockResolvedValue(0),
      countCandidates: vi.fn().mockResolvedValue(0),
      countRecruitments: vi.fn().mockResolvedValue(0),
      listRecruitmentStageSnapshots: vi.fn().mockResolvedValue([]),
    } as any);

    await expect(service.getSummary()).resolves.toEqual({
      total_candidates: 0,
      total_active_vacancies: 0,
      total_recruitments: 0,
      recruitment_count_by_current_stage: {
        ACCEPTANCE: 0,
        APPLIED: 0,
        INTERVIEW: 0,
        SCREENING: 0,
        TECHNICAL_TEST: 0,
      },
      recruitment_count_by_current_status: {
        PASSED: 0,
        PENDING: 0,
        REJECTED: 0,
      },
    });
  });
});
