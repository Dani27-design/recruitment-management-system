import { describe, expect, it, vi } from 'vitest';
import { RecruitmentStageRepository } from './recruitment-stage.repository';

describe('RecruitmentStageRepository', () => {
  it('creates, finds, lists, and updates stages with assignee relation', async () => {
    const db = {
      recruitmentStage: {
        create: vi.fn().mockResolvedValue({ id: 'stage-1' }),
        findUnique: vi.fn().mockResolvedValue({ id: 'stage-1' }),
        findMany: vi.fn().mockResolvedValue([{ id: 'stage-1' }]),
        update: vi.fn().mockResolvedValue({ id: 'stage-1', notes: 'Updated' }),
      },
    };
    const repository = new RecruitmentStageRepository(db as any);

    await expect(
      repository.create({
        recruitment_id: 'recruitment-1',
        stage: 'APPLIED',
        status: 'PENDING',
      }),
    ).resolves.toEqual({ id: 'stage-1' });
    await expect(repository.findById('stage-1')).resolves.toEqual({ id: 'stage-1' });
    await expect(repository.listByRecruitmentId('recruitment-1')).resolves.toEqual([
      { id: 'stage-1' },
    ]);
    await expect(repository.update('stage-1', { notes: 'Updated' })).resolves.toEqual({
      id: 'stage-1',
      notes: 'Updated',
    });
    await expect(repository.assignManager('stage-1', 'manager-1')).resolves.toEqual({
      id: 'stage-1',
      notes: 'Updated',
    });

    expect(db.recruitmentStage.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { recruitment_id: 'recruitment-1' },
        orderBy: { created_at: 'asc' },
      }),
    );
  });

  it('completes a stage and creates the next stage in one transaction', async () => {
    const tx = {
      recruitmentStage: {
        update: vi.fn().mockResolvedValue({ id: 'stage-1', status: 'PASSED' }),
        create: vi.fn().mockResolvedValue({ id: 'stage-2' }),
      },
    };
    const db = {
      $transaction: vi.fn((callback) => callback(tx)),
    };
    const repository = new RecruitmentStageRepository(db as any);

    await expect(
      repository.completeStage(
        'stage-1',
        { status: 'PASSED', completed_at: new Date('2026-07-01T00:00:00.000Z') },
        {
          recruitment_id: 'recruitment-1',
          stage: 'SCREENING',
          status: 'PENDING',
        },
      ),
    ).resolves.toEqual({ id: 'stage-1', status: 'PASSED' });

    expect(tx.recruitmentStage.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'stage-1' },
      }),
    );
    expect(tx.recruitmentStage.create).toHaveBeenCalledWith({
      data: {
        recruitment_id: 'recruitment-1',
        stage: 'SCREENING',
        status: 'PENDING',
      },
    });
  });
});
