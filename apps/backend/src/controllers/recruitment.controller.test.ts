import { describe, expect, it, vi } from 'vitest';
import { RecruitmentController } from './recruitment.controller';

function createResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any;
}

describe('RecruitmentController', () => {
  it('returns standardized list responses', async () => {
    const controller = new RecruitmentController({
      list: vi.fn().mockResolvedValue([{ id: 'recruitment-1' }]),
    } as any);
    const res = createResponse();

    await controller.list({ user: { id: 'admin-1', role: 'ADMINISTRATOR' } } as any, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Recruitments retrieved successfully',
      data: [{ id: 'recruitment-1' }],
    });
  });

  it('returns standardized detail and create responses', async () => {
    const recruitment = { id: 'recruitment-1' };
    const service = {
      getById: vi.fn().mockResolvedValue(recruitment),
      create: vi.fn().mockResolvedValue(recruitment),
    };
    const controller = new RecruitmentController(service as any);

    await controller.getById(
      { params: { id: 'recruitment-1' }, user: { id: 'admin-1', role: 'ADMINISTRATOR' } } as any,
      createResponse(),
    );
    await controller.create(
      {
        body: { candidate_id: 'candidate-1', vacancy_id: 'vacancy-1' },
        user: { id: 'admin-1' },
      } as any,
      createResponse(),
    );

    expect(service.getById).toHaveBeenCalledWith('recruitment-1', {
      id: 'admin-1',
      role: 'ADMINISTRATOR',
    });
    expect(service.create).toHaveBeenCalledWith(
      { candidate_id: 'candidate-1', vacancy_id: 'vacancy-1' },
      'admin-1',
    );
  });
});
