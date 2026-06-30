import { describe, expect, it, vi } from 'vitest';

vi.mock('../api/http', () => ({
  http: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const vacancy = {
  id: 'vacancy-1',
  position_name: 'Software Engineer',
  department: 'Engineering',
  hiring_needed: 2,
  status: 'ACTIVE',
  created_at: '2026-07-01T00:00:00.000Z',
  updated_at: '2026-07-01T00:00:00.000Z',
};

describe('vacancy-service', () => {
  it('lists vacancies from the backend API wrapper', async () => {
    const { http } = await import('../api/http');
    const { listVacancies } = await import('./vacancy-service');
    vi.mocked(http.get).mockResolvedValue({
      data: { success: true, message: 'OK', data: [vacancy] },
    });

    await expect(listVacancies()).resolves.toEqual([vacancy]);
    expect(http.get).toHaveBeenCalledWith('/vacancies');
  });

  it('wraps vacancy CRUD API calls', async () => {
    const { http } = await import('../api/http');
    const { createVacancy, deleteVacancy, getVacancy, updateVacancy } = await import(
      './vacancy-service'
    );
    vi.mocked(http.get).mockResolvedValue({
      data: { success: true, message: 'OK', data: vacancy },
    });
    vi.mocked(http.post).mockResolvedValue({
      data: { success: true, message: 'OK', data: vacancy },
    });
    vi.mocked(http.put).mockResolvedValue({
      data: { success: true, message: 'OK', data: vacancy },
    });
    vi.mocked(http.delete).mockResolvedValue({
      data: { success: true, message: 'OK', data: vacancy },
    });

    await expect(getVacancy('vacancy-1')).resolves.toEqual(vacancy);
    await expect(
      createVacancy({
        position_name: 'Software Engineer',
        department: 'Engineering',
        hiring_needed: 2,
        status: 'ACTIVE',
      }),
    ).resolves.toEqual(vacancy);
    await expect(updateVacancy('vacancy-1', { status: 'INACTIVE' })).resolves.toEqual(vacancy);
    await expect(deleteVacancy('vacancy-1')).resolves.toEqual(vacancy);
  });
});
