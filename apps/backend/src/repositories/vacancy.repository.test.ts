import { describe, expect, it, vi } from 'vitest';
import { VacancyRepository } from './vacancy.repository';

describe('VacancyRepository', () => {
  it('creates vacancies through Prisma', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'vacancy-1' });
    const repository = new VacancyRepository({ vacancy: { create } } as any);
    const input = {
      position_name: 'Software Engineer',
      department: 'Engineering',
      hiring_needed: 2,
      status: 'ACTIVE' as const,
    };

    await expect(repository.create(input)).resolves.toEqual({ id: 'vacancy-1' });
    expect(create).toHaveBeenCalledWith({ data: input });
  });

  it('updates vacancies through Prisma', async () => {
    const update = vi.fn().mockResolvedValue({ id: 'vacancy-1', status: 'INACTIVE' });
    const repository = new VacancyRepository({ vacancy: { update } } as any);

    await expect(repository.update('vacancy-1', { status: 'INACTIVE' })).resolves.toEqual({
      id: 'vacancy-1',
      status: 'INACTIVE',
    });
    expect(update).toHaveBeenCalledWith({
      where: { id: 'vacancy-1' },
      data: { status: 'INACTIVE' },
    });
  });

  it('deletes and finds vacancies through Prisma', async () => {
    const deleteVacancy = vi.fn().mockResolvedValue({ id: 'vacancy-1' });
    const findUnique = vi.fn().mockResolvedValue({ id: 'vacancy-1' });
    const repository = new VacancyRepository({
      vacancy: {
        delete: deleteVacancy,
        findUnique,
      },
    } as any);

    await expect(repository.delete('vacancy-1')).resolves.toEqual({ id: 'vacancy-1' });
    await expect(repository.findById('vacancy-1')).resolves.toEqual({ id: 'vacancy-1' });

    expect(deleteVacancy).toHaveBeenCalledWith({ where: { id: 'vacancy-1' } });
    expect(findUnique).toHaveBeenCalledWith({ where: { id: 'vacancy-1' } });
  });

  it('lists vacancies ordered by newest first', async () => {
    const findMany = vi.fn().mockResolvedValue([]);
    const repository = new VacancyRepository({ vacancy: { findMany } } as any);

    await repository.list();

    expect(findMany).toHaveBeenCalledWith({
      orderBy: { created_at: 'desc' },
    });
  });
});
