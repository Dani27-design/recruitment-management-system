import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { CandidateDetailPage } from './CandidateDetailPage';

vi.mock('../layouts/AppLayout', () => ({
  AppLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../services/candidate-service', () => ({
  getCandidate: vi.fn().mockResolvedValue({
    id: 'candidate-1',
    full_name: 'Jane Doe',
    email: 'jane@example.com',
    phone_number: '+62 812-3456-7890',
    created_at: '2026-07-01T00:00:00.000Z',
    updated_at: '2026-07-01T00:00:00.000Z',
  }),
}));

describe('CandidateDetailPage', () => {
  it('renders candidate detail', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/candidates/candidate-1']}>
          <Routes>
            <Route path="/candidates/:id" element={<CandidateDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });
});
