import { describe, expect, it, vi } from 'vitest';

vi.mock('../api/http', () => ({
  http: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const recruitment = {
  id: 'recruitment-1',
  candidate_id: 'candidate-1',
  vacancy_id: 'vacancy-1',
  created_by: 'admin-1',
  created_at: '2026-07-01T00:00:00.000Z',
  updated_at: '2026-07-01T00:00:00.000Z',
  candidate: { full_name: 'Jane Doe' },
  vacancy: { position_name: 'Software Engineer' },
  stages: [{ stage: 'APPLIED', status: 'PENDING' }],
};

describe('recruitment-service', () => {
  it('lists and gets recruitments from the backend API wrapper', async () => {
    const { http } = await import('../api/http');
    const { getRecruitment, listRecruitments } = await import('./recruitment-service');
    vi.mocked(http.get).mockResolvedValue({
      data: { success: true, message: 'OK', data: [recruitment] },
    });

    await expect(listRecruitments()).resolves.toEqual([recruitment]);
    expect(http.get).toHaveBeenCalledWith('/recruitments');

    vi.mocked(http.get).mockResolvedValue({
      data: { success: true, message: 'OK', data: recruitment },
    });
    await expect(getRecruitment('recruitment-1')).resolves.toEqual(recruitment);
  });

  it('creates recruitments', async () => {
    const { http } = await import('../api/http');
    const { createRecruitment } = await import('./recruitment-service');
    vi.mocked(http.post).mockResolvedValue({
      data: { success: true, message: 'OK', data: recruitment },
    });

    await expect(
      createRecruitment({ candidate_id: 'candidate-1', vacancy_id: 'vacancy-1' }),
    ).resolves.toEqual(recruitment);
    expect(http.post).toHaveBeenCalledWith('/recruitments', {
      candidate_id: 'candidate-1',
      vacancy_id: 'vacancy-1',
    });
  });
});
