import { describe, expect, it, vi } from 'vitest';
import { AppError } from '../utils/app-error';
import { RecruitmentService } from './recruitment.service';

const candidate = {
  id: 'candidate-1',
};

const activeVacancy = {
  id: 'vacancy-1',
  status: 'ACTIVE',
};

describe('RecruitmentService', () => {
  it('creates recruitments after candidate and active vacancy validation', async () => {
    const recruitmentRepository = {
      create: vi.fn().mockResolvedValue({
        id: 'recruitment-1',
        stages: [{ stage: 'APPLIED', status: 'PENDING' }],
      }),
    };
    const service = new RecruitmentService(
      recruitmentRepository as any,
      { findById: vi.fn().mockResolvedValue(candidate) } as any,
      { findById: vi.fn().mockResolvedValue(activeVacancy) } as any,
    );

    await expect(
      service.create({ candidate_id: 'candidate-1', vacancy_id: 'vacancy-1' }, 'admin-1'),
    ).resolves.toEqual({
      id: 'recruitment-1',
      stages: [{ stage: 'APPLIED', status: 'PENDING' }],
    });
    expect(recruitmentRepository.create).toHaveBeenCalledWith(
      { candidate_id: 'candidate-1', vacancy_id: 'vacancy-1' },
      'admin-1',
    );
  });

  it('rejects missing candidates', async () => {
    const service = new RecruitmentService(
      { create: vi.fn() } as any,
      { findById: vi.fn().mockResolvedValue(null) } as any,
      { findById: vi.fn() } as any,
    );

    await expect(
      service.create({ candidate_id: 'candidate-1', vacancy_id: 'vacancy-1' }, 'admin-1'),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('rejects missing vacancies and inactive vacancies', async () => {
    const missingVacancyService = new RecruitmentService(
      { create: vi.fn() } as any,
      { findById: vi.fn().mockResolvedValue(candidate) } as any,
      { findById: vi.fn().mockResolvedValue(null) } as any,
    );
    await expect(
      missingVacancyService.create(
        { candidate_id: 'candidate-1', vacancy_id: 'vacancy-1' },
        'admin-1',
      ),
    ).rejects.toBeInstanceOf(AppError);

    const inactiveVacancyService = new RecruitmentService(
      { create: vi.fn() } as any,
      { findById: vi.fn().mockResolvedValue(candidate) } as any,
      { findById: vi.fn().mockResolvedValue({ id: 'vacancy-1', status: 'INACTIVE' }) } as any,
    );
    await expect(
      inactiveVacancyService.create(
        { candidate_id: 'candidate-1', vacancy_id: 'vacancy-1' },
        'admin-1',
      ),
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it('gets and lists recruitments', async () => {
    const recruitment = { id: 'recruitment-1' };
    const service = new RecruitmentService(
      {
        findById: vi.fn().mockResolvedValue(recruitment),
        list: vi.fn().mockResolvedValue([recruitment]),
      } as any,
      {} as any,
      {} as any,
    );

    await expect(service.getById('recruitment-1')).resolves.toEqual(recruitment);
    await expect(service.list()).resolves.toEqual([recruitment]);
  });
});
