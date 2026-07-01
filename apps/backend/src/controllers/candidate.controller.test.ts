import { describe, expect, it, vi } from 'vitest';
import { CandidateController } from './candidate.controller';

function createResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any;
}

describe('CandidateController', () => {
  it('returns standardized list responses', async () => {
    const controller = new CandidateController({
      list: vi.fn().mockResolvedValue([{ id: 'candidate-1' }]),
    } as any);
    const res = createResponse();

    await controller.list({ query: { search: 'Jane' } } as any, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Candidates retrieved successfully',
      data: [{ id: 'candidate-1' }],
    });
  });

  it('returns standardized detail and write responses', async () => {
    const candidate = { id: 'candidate-1' };
    const service = {
      getById: vi.fn().mockResolvedValue(candidate),
      create: vi.fn().mockResolvedValue(candidate),
      update: vi.fn().mockResolvedValue(candidate),
      delete: vi.fn().mockResolvedValue(candidate),
    };
    const controller = new CandidateController(service as any);

    for (const action of [
      () => controller.getById({ params: { id: 'candidate-1' } } as any, createResponse()),
      () => controller.create({ body: candidate, user: { id: 'admin-1' } } as any, createResponse()),
      () =>
        controller.update(
          { params: { id: 'candidate-1' }, body: { full_name: 'Jane' }, user: { id: 'admin-1' } } as any,
          createResponse(),
        ),
      () => controller.delete({ params: { id: 'candidate-1' }, user: { id: 'admin-1' } } as any, createResponse()),
    ]) {
      await expect(action()).resolves.toBeDefined();
    }

    expect(service.getById).toHaveBeenCalledWith('candidate-1');
    expect(service.create).toHaveBeenCalledWith(candidate, 'admin-1');
    expect(service.update).toHaveBeenCalledWith('candidate-1', { full_name: 'Jane' }, 'admin-1');
    expect(service.delete).toHaveBeenCalledWith('candidate-1', 'admin-1');
  });
});
