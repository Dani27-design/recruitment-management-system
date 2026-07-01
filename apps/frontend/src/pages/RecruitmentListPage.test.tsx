import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { RecruitmentListPage } from './RecruitmentListPage';

vi.mock('../layouts/AppLayout', () => ({
  AppLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../features/auth/AuthProvider', () => ({
  useAuth: () => ({
    user: { id: 'admin-1', email: 'admin@rms.local', role: 'ADMINISTRATOR' },
  }),
}));

vi.mock('../services/recruitment-service', () => ({
  listRecruitments: vi.fn().mockResolvedValue([
    {
      id: 'recruitment-1',
      candidate: { full_name: 'Jane Doe' },
      vacancy: { position_name: 'Software Engineer' },
      stages: [{ stage: 'APPLIED', status: 'PENDING' }],
    },
  ]),
}));

describe('RecruitmentListPage', () => {
  it('renders recruitment rows', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecruitmentListPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('APPLIED / PENDING')).toBeInTheDocument();
  });
});
