import type { Vacancy } from '@prisma/client';
import { describe, expect, it, vi } from 'vitest';
import { AppError } from '../utils/app-error';
import { VacancyService } from './vacancy.service';

const vacancy: Vacancy = {
  id: 'vacancy-1',
  position_name: 'Software Engineer',
  department: 'Engineering',
  hiring_needed: 2,
  status: 'ACTIVE',
  created_at: new Date(),
  updated_at: new Date(),
};

describe('VacancyService', () => {
  it('creates vacancies through the repository', async () => {
    const repository = {
      create: vi.fn().mockResolvedValue(vacancy),
    };
    const service = new VacancyService(repository as any);

    await expect(
      service.create({
        position_name: 'Software Engineer',
        department: 'Engineering',
        hiring_needed: 2,
        status: 'ACTIVE',
      }),
    ).resolves.toEqual(vacancy);
  });

  it('updates vacancies after checking existence', async () => {
    const repository = {
      findById: vi.fn().mockResolvedValue(vacancy),
      update: vi.fn().mockResolvedValue({ ...vacancy, status: 'INACTIVE' }),
    };
    const service = new VacancyService(repository as any);

    await expect(service.update('vacancy-1', { status: 'INACTIVE' })).resolves.toMatchObject({
      status: 'INACTIVE',
    });
  });

  it('deletes vacancies after checking existence and lists vacancies', async () => {
    const repository = {
      findById: vi.fn().mockResolvedValue(vacancy),
      delete: vi.fn().mockResolvedValue(vacancy),
      list: vi.fn().mockResolvedValue([vacancy]),
    };
    const service = new VacancyService(repository as any);

    await expect(service.delete('vacancy-1')).resolves.toEqual(vacancy);
    await expect(service.list()).resolves.toEqual([vacancy]);
  });

  it('rejects missing vacancies', async () => {
    const service = new VacancyService({
      findById: vi.fn().mockResolvedValue(null),
    } as any);

    await expect(service.getById('vacancy-1')).rejects.toBeInstanceOf(AppError);
  });
});
