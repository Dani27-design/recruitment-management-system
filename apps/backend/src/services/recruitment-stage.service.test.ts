import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppError } from '../utils/app-error';
import { RecruitmentStageService } from './recruitment-stage.service';

const baseStage = {
  id: 'stage-1',
  recruitment_id: 'recruitment-1',
  stage: 'APPLIED' as const,
  status: 'PENDING' as const,
  assigned_user_id: null,
  scheduled_at: null,
  completed_at: null,
  notes: null,
  created_at: new Date('2026-07-01T00:00:00.000Z'),
  updated_at: new Date('2026-07-01T00:00:00.000Z'),
  assigned_user: null,
};

describe('RecruitmentStageService', () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it('lists stages only when the recruitment exists and sorts by workflow order', async () => {
    const screeningStage = { ...baseStage, id: 'stage-2', stage: 'SCREENING' as const };
    const service = new RecruitmentStageService(
      {
        listByRecruitmentId: vi.fn().mockResolvedValue([screeningStage, baseStage]),
      } as any,
      { findById: vi.fn().mockResolvedValue({ id: 'recruitment-1' }) } as any,
    );

    await expect(service.listByRecruitmentId('recruitment-1')).resolves.toEqual([
      baseStage,
      screeningStage,
    ]);
  });

  it('rejects timeline requests for missing recruitments', async () => {
    const service = new RecruitmentStageService(
      { listByRecruitmentId: vi.fn() } as any,
      { findById: vi.fn().mockResolvedValue(null) } as any,
    );

    await expect(service.listByRecruitmentId('recruitment-1')).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it('marks a passed stage complete and creates the next pending stage', async () => {
    const now = new Date('2026-07-01T10:00:00.000Z');
    vi.useFakeTimers();
    vi.setSystemTime(now);

    const repository = {
      findById: vi.fn().mockResolvedValue(baseStage),
      listByRecruitmentId: vi.fn().mockResolvedValue([baseStage]),
      completeStage: vi.fn().mockResolvedValue({ ...baseStage, status: 'PASSED' }),
    };
    const service = new RecruitmentStageService(repository as any, {} as any);

    await service.updateStatus('stage-1', { status: 'PASSED', notes: 'Move forward' });

    expect(repository.completeStage).toHaveBeenCalledWith(
      'stage-1',
      {
        status: 'PASSED',
        completed_at: now,
        notes: 'Move forward',
      },
      {
        recruitment_id: 'recruitment-1',
        stage: 'SCREENING',
        status: 'PENDING',
      },
    );
  });

  it('does not create a next stage after acceptance is passed', async () => {
    const acceptanceStage = { ...baseStage, stage: 'ACCEPTANCE' as const };
    const repository = {
      findById: vi.fn().mockResolvedValue(acceptanceStage),
      listByRecruitmentId: vi.fn().mockResolvedValue([
        { ...baseStage, id: 'stage-1', stage: 'APPLIED' as const, status: 'PASSED' as const },
        { ...baseStage, id: 'stage-2', stage: 'SCREENING' as const, status: 'PASSED' as const },
        {
          ...baseStage,
          id: 'stage-3',
          stage: 'TECHNICAL_TEST' as const,
          status: 'PASSED' as const,
        },
        { ...baseStage, id: 'stage-4', stage: 'INTERVIEW' as const, status: 'PASSED' as const },
        acceptanceStage,
      ]),
      completeStage: vi.fn().mockResolvedValue({ ...acceptanceStage, status: 'PASSED' }),
    };
    const service = new RecruitmentStageService(repository as any, {} as any);

    await service.updateStatus('stage-5', { status: 'PASSED' });

    expect(repository.completeStage).toHaveBeenCalledWith(
      'stage-1',
      expect.objectContaining({ status: 'PASSED' }),
      undefined,
    );
  });

  it('marks rejected stages complete without creating another stage', async () => {
    const repository = {
      findById: vi.fn().mockResolvedValue(baseStage),
      listByRecruitmentId: vi.fn().mockResolvedValue([baseStage]),
      completeStage: vi.fn().mockResolvedValue({ ...baseStage, status: 'REJECTED' }),
    };
    const service = new RecruitmentStageService(repository as any, {} as any);

    await service.updateStatus('stage-1', { status: 'REJECTED' });

    expect(repository.completeStage).toHaveBeenCalledWith(
      'stage-1',
      expect.objectContaining({ status: 'REJECTED' }),
    );
  });

  it('allows notes updates while a stage is active', async () => {
    const repository = {
      findById: vi.fn().mockResolvedValue(baseStage),
      listByRecruitmentId: vi.fn().mockResolvedValue([baseStage]),
      update: vi.fn().mockResolvedValue({ ...baseStage, notes: 'Updated notes' }),
    };
    const service = new RecruitmentStageService(repository as any, {} as any);

    await service.updateStatus('stage-1', { notes: 'Updated notes' });

    expect(repository.update).toHaveBeenCalledWith('stage-1', { notes: 'Updated notes' });
  });

  it('prevents completed stages from being modified', async () => {
    const completedStage = {
      ...baseStage,
      status: 'PASSED' as const,
      completed_at: new Date('2026-07-01T10:00:00.000Z'),
    };
    const service = new RecruitmentStageService(
      {
        findById: vi.fn().mockResolvedValue(completedStage),
        listByRecruitmentId: vi.fn().mockResolvedValue([completedStage]),
      } as any,
      {} as any,
    );

    await expect(service.updateStatus('stage-1', { notes: 'No change' })).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('prevents invalid sequence and multiple pending stages', async () => {
    const serviceWithMissingPrevious = new RecruitmentStageService(
      {
        findById: vi.fn().mockResolvedValue({ ...baseStage, stage: 'SCREENING' as const }),
        listByRecruitmentId: vi.fn().mockResolvedValue([
          { ...baseStage, id: 'stage-2', stage: 'SCREENING' as const },
        ]),
      } as any,
      {} as any,
    );

    await expect(
      serviceWithMissingPrevious.updateStatus('stage-2', { status: 'PASSED' }),
    ).rejects.toMatchObject({ statusCode: 400 });

    const serviceWithDuplicatePending = new RecruitmentStageService(
      {
        findById: vi.fn().mockResolvedValue(baseStage),
        listByRecruitmentId: vi.fn().mockResolvedValue([
          baseStage,
          { ...baseStage, id: 'stage-2', stage: 'SCREENING' as const },
        ]),
      } as any,
      {} as any,
    );

    await expect(
      serviceWithDuplicatePending.updateStatus('stage-1', { status: 'PASSED' }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });
});
