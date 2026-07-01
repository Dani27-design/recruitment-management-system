import { describe, expect, it, vi } from 'vitest';

vi.mock('../api/http', () => ({
  http: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

const stage = {
  id: 'stage-1',
  recruitment_id: 'recruitment-1',
  stage: 'APPLIED',
  status: 'PENDING',
  assigned_user_id: null,
  scheduled_at: null,
  completed_at: null,
  notes: null,
  created_at: '2026-07-01T00:00:00.000Z',
  updated_at: '2026-07-01T00:00:00.000Z',
};

describe('recruitment-stage-service', () => {
  it('lists recruitment stages from the backend API wrapper', async () => {
    const { http } = await import('../api/http');
    const { listRecruitmentStages } = await import('./recruitment-stage-service');
    vi.mocked(http.get).mockResolvedValue({
      data: { success: true, message: 'OK', data: [stage] },
    });

    await expect(listRecruitmentStages('recruitment-1')).resolves.toEqual([stage]);
    expect(http.get).toHaveBeenCalledWith('/recruitments/recruitment-1/stages');
  });

  it('updates recruitment stages through the status endpoint', async () => {
    const { http } = await import('../api/http');
    const { updateRecruitmentStage } = await import('./recruitment-stage-service');
    vi.mocked(http.patch).mockResolvedValue({
      data: { success: true, message: 'OK', data: { ...stage, status: 'PASSED' } },
    });

    await expect(
      updateRecruitmentStage('stage-1', { status: 'PASSED', notes: 'Move forward' }),
    ).resolves.toEqual({ ...stage, status: 'PASSED' });
    expect(http.patch).toHaveBeenCalledWith('/stages/stage-1/status', {
      status: 'PASSED',
      notes: 'Move forward',
    });
  });

  it('assigns managers through the assignment endpoint', async () => {
    const { http } = await import('../api/http');
    const { assignRecruitmentStageManager } = await import('./recruitment-stage-service');
    vi.mocked(http.patch).mockResolvedValue({
      data: {
        success: true,
        message: 'OK',
        data: { ...stage, assigned_user_id: 'manager-1' },
      },
    });

    await expect(assignRecruitmentStageManager('stage-1', 'manager-1')).resolves.toEqual({
      ...stage,
      assigned_user_id: 'manager-1',
    });
    expect(http.patch).toHaveBeenCalledWith('/stages/stage-1/assignment', {
      assigned_user_id: 'manager-1',
    });
  });
});
