import { describe, expect, it, vi } from 'vitest';
import { CandidateRepository } from './candidate.repository';

describe('CandidateRepository', () => {
  it('creates candidates through Prisma', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'candidate-1' });
    const repository = new CandidateRepository({ candidate: { create } } as any);
    const input = {
      full_name: 'Jane Doe',
      email: 'jane@example.com',
      phone_number: '+62 812-3456-7890',
    };

    await expect(repository.create(input)).resolves.toEqual({ id: 'candidate-1' });
    expect(create).toHaveBeenCalledWith({ data: input });
  });

  it('updates candidates through Prisma', async () => {
    const update = vi.fn().mockResolvedValue({ id: 'candidate-1', full_name: 'Jane Updated' });
    const repository = new CandidateRepository({ candidate: { update } } as any);

    await expect(repository.update('candidate-1', { full_name: 'Jane Updated' })).resolves.toEqual({
      id: 'candidate-1',
      full_name: 'Jane Updated',
    });
    expect(update).toHaveBeenCalledWith({
      where: { id: 'candidate-1' },
      data: { full_name: 'Jane Updated' },
    });
  });

  it('deletes and finds candidates through Prisma', async () => {
    const deleteCandidate = vi.fn().mockResolvedValue({ id: 'candidate-1' });
    const findUnique = vi.fn().mockResolvedValue({ id: 'candidate-1' });
    const repository = new CandidateRepository({
      candidate: {
        delete: deleteCandidate,
        findUnique,
      },
    } as any);

    await expect(repository.delete('candidate-1')).resolves.toEqual({ id: 'candidate-1' });
    await expect(repository.findById('candidate-1')).resolves.toEqual({ id: 'candidate-1' });
    await expect(repository.findByEmail('jane@example.com')).resolves.toEqual({ id: 'candidate-1' });

    expect(deleteCandidate).toHaveBeenCalledWith({ where: { id: 'candidate-1' } });
    expect(findUnique).toHaveBeenCalledWith({ where: { id: 'candidate-1' } });
    expect(findUnique).toHaveBeenCalledWith({ where: { email: 'jane@example.com' } });
  });

  it('lists candidates with search filters', async () => {
    const findMany = vi.fn().mockResolvedValue([]);
    const repository = new CandidateRepository({ candidate: { findMany } } as any);

    await repository.list('Jane');

    expect(findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { full_name: { contains: 'Jane', mode: 'insensitive' } },
          { email: { contains: 'Jane', mode: 'insensitive' } },
          { phone_number: { contains: 'Jane', mode: 'insensitive' } },
        ],
      },
      orderBy: { created_at: 'desc' },
    });
  });
});
