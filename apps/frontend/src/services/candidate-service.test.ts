import { describe, expect, it, vi } from 'vitest';

vi.mock('../api/http', () => ({
  http: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const candidate = {
  id: 'candidate-1',
  full_name: 'Jane Doe',
  email: 'jane@example.com',
  phone_number: '+62 812-3456-7890',
  created_at: '2026-07-01T00:00:00.000Z',
  updated_at: '2026-07-01T00:00:00.000Z',
};

describe('candidate-service', () => {
  it('lists candidates with search params', async () => {
    const { http } = await import('../api/http');
    const { listCandidates } = await import('./candidate-service');
    vi.mocked(http.get).mockResolvedValue({
      data: { success: true, message: 'OK', data: [candidate] },
    });

    await expect(listCandidates({ search: 'Jane' })).resolves.toEqual([candidate]);
    expect(http.get).toHaveBeenCalledWith('/candidates', { params: { search: 'Jane' } });
  });

  it('wraps candidate CRUD API calls', async () => {
    const { http } = await import('../api/http');
    const { createCandidate, deleteCandidate, getCandidate, updateCandidate } = await import(
      './candidate-service'
    );
    vi.mocked(http.get).mockResolvedValue({
      data: { success: true, message: 'OK', data: candidate },
    });
    vi.mocked(http.post).mockResolvedValue({
      data: { success: true, message: 'OK', data: candidate },
    });
    vi.mocked(http.put).mockResolvedValue({
      data: { success: true, message: 'OK', data: candidate },
    });
    vi.mocked(http.delete).mockResolvedValue({
      data: { success: true, message: 'OK', data: candidate },
    });

    await expect(getCandidate('candidate-1')).resolves.toEqual(candidate);
    await expect(
      createCandidate({
        full_name: 'Jane Doe',
        email: 'jane@example.com',
        phone_number: '+62 812-3456-7890',
      }),
    ).resolves.toEqual(candidate);
    await expect(updateCandidate('candidate-1', { full_name: 'Jane Updated' })).resolves.toEqual(
      candidate,
    );
    await expect(deleteCandidate('candidate-1')).resolves.toEqual(candidate);
  });
});
