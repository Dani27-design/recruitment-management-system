import type { Candidate } from '@prisma/client';
import { describe, expect, it, vi } from 'vitest';
import { AppError } from '../utils/app-error';
import { CandidateService } from './candidate.service';

const candidate: Candidate = {
  id: 'candidate-1',
  full_name: 'Jane Doe',
  email: 'jane@example.com',
  phone_number: '+62 812-3456-7890',
  created_at: new Date(),
  updated_at: new Date(),
};

describe('CandidateService', () => {
  it('creates candidates when email is unique', async () => {
    const repository = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue(candidate),
    };
    const service = new CandidateService(repository as any);

    await expect(
      service.create({
        full_name: 'Jane Doe',
        email: 'jane@example.com',
        phone_number: '+62 812-3456-7890',
      }),
    ).resolves.toEqual(candidate);
    expect(repository.create).toHaveBeenCalledOnce();
  });

  it('rejects duplicate emails on create', async () => {
    const service = new CandidateService({
      findByEmail: vi.fn().mockResolvedValue(candidate),
    } as any);

    await expect(
      service.create({
        full_name: 'Jane Doe',
        email: 'jane@example.com',
        phone_number: '+62 812-3456-7890',
      }),
    ).rejects.toMatchObject({ statusCode: 409 });
  });

  it('updates candidates after not-found and email checks', async () => {
    const repository = {
      findById: vi.fn().mockResolvedValue(candidate),
      findByEmail: vi.fn().mockResolvedValue(null),
      update: vi.fn().mockResolvedValue({ ...candidate, full_name: 'Jane Updated' }),
    };
    const service = new CandidateService(repository as any);

    await expect(
      service.update('candidate-1', {
        full_name: 'Jane Updated',
        email: 'jane.updated@example.com',
      }),
    ).resolves.toMatchObject({ full_name: 'Jane Updated' });
  });

  it('allows updating a candidate with its existing email', async () => {
    const repository = {
      findById: vi.fn().mockResolvedValue(candidate),
      findByEmail: vi.fn().mockResolvedValue(candidate),
      update: vi.fn().mockResolvedValue(candidate),
    };
    const service = new CandidateService(repository as any);

    await expect(service.update('candidate-1', { email: 'jane@example.com' })).resolves.toEqual(
      candidate,
    );
  });

  it('rejects missing candidates', async () => {
    const service = new CandidateService({
      findById: vi.fn().mockResolvedValue(null),
    } as any);

    await expect(service.getById('candidate-1')).rejects.toBeInstanceOf(AppError);
  });

  it('deletes candidates after existence checks and lists by search query', async () => {
    const repository = {
      findById: vi.fn().mockResolvedValue(candidate),
      delete: vi.fn().mockResolvedValue(candidate),
      list: vi.fn().mockResolvedValue([candidate]),
    };
    const service = new CandidateService(repository as any);

    await expect(service.delete('candidate-1')).resolves.toEqual(candidate);
    await expect(service.list({ search: 'Jane' })).resolves.toEqual([candidate]);
    expect(repository.list).toHaveBeenCalledWith('Jane');
  });
});
