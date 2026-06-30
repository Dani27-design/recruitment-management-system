import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { RecruitmentDetailPage } from './RecruitmentDetailPage';

vi.mock('../layouts/AppLayout', () => ({
  AppLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../services/recruitment-service', () => ({
  getRecruitment: vi.fn().mockResolvedValue({
    id: 'recruitment-1',
    candidate: { full_name: 'Jane Doe' },
    vacancy: { position_name: 'Software Engineer' },
    stages: [{ stage: 'APPLIED', status: 'PENDING' }],
  }),
}));

describe('RecruitmentDetailPage', () => {
  it('renders recruitment detail', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/recruitments/recruitment-1']}>
          <Routes>
            <Route path="/recruitments/:id" element={<RecruitmentDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('APPLIED / PENDING')).toBeInTheDocument();
  });
});
