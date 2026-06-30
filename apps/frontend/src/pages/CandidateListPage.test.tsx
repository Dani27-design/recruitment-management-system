import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { CandidateListPage } from './CandidateListPage';

vi.mock('../features/auth/AuthProvider', () => ({
  useAuth: () => ({
    user: { id: '1', email: 'admin@rms.local', role: 'ADMINISTRATOR' },
  }),
}));

vi.mock('../layouts/AppLayout', () => ({
  AppLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../services/candidate-service', () => ({
  listCandidates: vi.fn().mockResolvedValue([
    {
      id: 'candidate-1',
      full_name: 'Jane Doe',
      email: 'jane@example.com',
      phone_number: '+62 812-3456-7890',
      created_at: '2026-07-01T00:00:00.000Z',
      updated_at: '2026-07-01T00:00:00.000Z',
    },
  ]),
  deleteCandidate: vi.fn(),
}));

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <CandidateListPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('CandidateListPage', () => {
  it('renders candidates and create action for administrators', async () => {
    renderPage();

    expect(await screen.findByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Create Candidate')).toBeInTheDocument();
  });
});
