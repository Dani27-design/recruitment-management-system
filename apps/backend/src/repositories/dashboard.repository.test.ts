import { describe, expect, it, vi } from 'vitest';
import { DashboardRepository } from './dashboard.repository';

describe('DashboardRepository', () => {
  it('counts candidates, active vacancies, and recruitments', async () => {
    const db = {
      candidate: { count: vi.fn().mockResolvedValue(3) },
      recruitment: { count: vi.fn().mockResolvedValue(5) },
      vacancy: { count: vi.fn().mockResolvedValue(2) },
    };
    const repository = new DashboardRepository(db as any);

    await expect(repository.countCandidates()).resolves.toBe(3);
    await expect(repository.countActiveVacancies()).resolves.toBe(2);
    await expect(repository.countRecruitments()).resolves.toBe(5);
    expect(db.vacancy.count).toHaveBeenCalledWith({ where: { status: 'ACTIVE' } });
  });

  it('lists recruitment stage snapshots for current status aggregation', async () => {
    const snapshots = [{ id: 'recruitment-1', stages: [] }];
    const db = {
      recruitment: {
        findMany: vi.fn().mockResolvedValue(snapshots),
      },
    };
    const repository = new DashboardRepository(db as any);

    await expect(repository.listRecruitmentStageSnapshots()).resolves.toEqual(snapshots);
    expect(db.recruitment.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        stages: {
          select: {
            stage: true,
            status: true,
            created_at: true,
          },
          orderBy: {
            created_at: 'asc',
          },
        },
      },
    });
  });
});
