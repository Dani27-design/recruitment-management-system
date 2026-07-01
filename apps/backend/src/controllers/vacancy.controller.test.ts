import { describe, expect, it, vi } from 'vitest';
import { VacancyController } from './vacancy.controller';

function createResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any;
}

describe('VacancyController', () => {
  it('returns standardized list responses', async () => {
    const controller = new VacancyController({
      list: vi.fn().mockResolvedValue([{ id: 'vacancy-1' }]),
    } as any);
    const res = createResponse();

    await controller.list({} as any, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Vacancies retrieved successfully',
      data: [{ id: 'vacancy-1' }],
    });
  });

  it('returns standardized detail and write responses', async () => {
    const vacancy = { id: 'vacancy-1' };
    const service = {
      getById: vi.fn().mockResolvedValue(vacancy),
      create: vi.fn().mockResolvedValue(vacancy),
      update: vi.fn().mockResolvedValue(vacancy),
      delete: vi.fn().mockResolvedValue(vacancy),
    };
    const controller = new VacancyController(service as any);

    for (const action of [
      () => controller.getById({ params: { id: 'vacancy-1' } } as any, createResponse()),
      () => controller.create({ body: vacancy, user: { id: 'admin-1' } } as any, createResponse()),
      () =>
        controller.update(
          { params: { id: 'vacancy-1' }, body: { status: 'INACTIVE' }, user: { id: 'admin-1' } } as any,
          createResponse(),
        ),
      () => controller.delete({ params: { id: 'vacancy-1' }, user: { id: 'admin-1' } } as any, createResponse()),
    ]) {
      await expect(action()).resolves.toBeDefined();
    }

    expect(service.getById).toHaveBeenCalledWith('vacancy-1');
    expect(service.create).toHaveBeenCalledWith(vacancy, 'admin-1');
    expect(service.update).toHaveBeenCalledWith('vacancy-1', { status: 'INACTIVE' }, 'admin-1');
    expect(service.delete).toHaveBeenCalledWith('vacancy-1', 'admin-1');
  });
});
