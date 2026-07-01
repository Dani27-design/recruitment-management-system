import { describe, expect, it, vi } from 'vitest';
import { RecruitmentStageController } from './recruitment-stage.controller';

function createResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any;
}

describe('RecruitmentStageController', () => {
  it('returns standardized timeline responses', async () => {
    const controller = new RecruitmentStageController({
      listByRecruitmentId: vi.fn().mockResolvedValue([{ id: 'stage-1' }]),
    } as any);
    const res = createResponse();

    await controller.listByRecruitment({ params: { id: 'recruitment-1' } } as any, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Recruitment stages retrieved successfully',
      data: [{ id: 'stage-1' }],
    });
  });

  it('returns standardized update responses', async () => {
    const service = {
      updateStatus: vi.fn().mockResolvedValue({ id: 'stage-1', status: 'PASSED' }),
    };
    const controller = new RecruitmentStageController(service as any);
    const res = createResponse();

    await controller.updateStatus(
      {
        params: { id: 'stage-1' },
        body: { status: 'PASSED', notes: 'Move forward' },
      } as any,
      res,
    );

    expect(service.updateStatus).toHaveBeenCalledWith('stage-1', {
      status: 'PASSED',
      notes: 'Move forward',
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Recruitment stage updated successfully',
      data: { id: 'stage-1', status: 'PASSED' },
    });
  });
});
