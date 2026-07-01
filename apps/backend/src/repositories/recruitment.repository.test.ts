import { describe, expect, it, vi } from 'vitest';
import { RecruitmentRepository } from './recruitment.repository';

describe('RecruitmentRepository', () => {
  it('creates recruitment and initial applied stage in a transaction', async () => {
    const tx = {
      recruitment: {
        create: vi.fn().mockResolvedValue({ id: 'recruitment-1' }),
        findUniqueOrThrow: vi.fn().mockResolvedValue({
          id: 'recruitment-1',
          stages: [{ stage: 'APPLIED', status: 'PENDING' }],
        }),
      },
      recruitmentStage: {
        create: vi.fn().mockResolvedValue({ id: 'stage-1' }),
      },
    };
    const db = {
      $transaction: vi.fn((callback) => callback(tx)),
    };
    const repository = new RecruitmentRepository(db as any);

    await expect(
      repository.create(
        {
          candidate_id: 'candidate-1',
          vacancy_id: 'vacancy-1',
        },
        'admin-1',
      ),
    ).resolves.toEqual({
      id: 'recruitment-1',
      stages: [{ stage: 'APPLIED', status: 'PENDING' }],
    });
    expect(tx.recruitment.create).toHaveBeenCalledWith({
      data: {
        candidate_id: 'candidate-1',
        vacancy_id: 'vacancy-1',
        created_by: 'admin-1',
      },
    });
    expect(tx.recruitmentStage.create).toHaveBeenCalledWith({
      data: {
        recruitment_id: 'recruitment-1',
        stage: 'APPLIED',
        status: 'PENDING',
      },
    });
  });

  it('finds and lists recruitments with relations', async () => {
    const findUnique = vi.fn().mockResolvedValue({ id: 'recruitment-1' });
    const findFirst = vi.fn().mockResolvedValue({ id: 'recruitment-1' });
    const findMany = vi.fn().mockResolvedValue([{ id: 'recruitment-1' }]);
    const repository = new RecruitmentRepository({
      recruitment: {
        findUnique,
        findFirst,
        findMany,
      },
    } as any);

    await expect(repository.findById('recruitment-1')).resolves.toEqual({ id: 'recruitment-1' });
    await expect(repository.findAssignedById('recruitment-1', 'manager-1')).resolves.toEqual({
      id: 'recruitment-1',
    });
    await expect(repository.list()).resolves.toEqual([{ id: 'recruitment-1' }]);
    await expect(repository.listAssignedToManager('manager-1')).resolves.toEqual([
      { id: 'recruitment-1' },
    ]);

    expect(findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'recruitment-1' },
      }),
    );
    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: 'recruitment-1',
          stages: {
            some: {
              assigned_user_id: 'manager-1',
            },
          },
        },
      }),
    );
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { created_at: 'desc' },
      }),
    );
  });
});
