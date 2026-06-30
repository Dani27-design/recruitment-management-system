import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { CreateRecruitmentPage } from './CreateRecruitmentPage';

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
      created_at: '',
      updated_at: '',
    },
  ]),
}));

vi.mock('../services/vacancy-service', () => ({
  listVacancies: vi.fn().mockResolvedValue([
    {
      id: 'vacancy-1',
      position_name: 'Software Engineer',
      department: 'Engineering',
      hiring_needed: 2,
      status: 'ACTIVE',
      created_at: '',
      updated_at: '',
    },
    {
      id: 'vacancy-2',
      position_name: 'Inactive Role',
      department: 'Engineering',
      hiring_needed: 1,
      status: 'INACTIVE',
      created_at: '',
      updated_at: '',
    },
  ]),
}));

vi.mock('../services/recruitment-service', () => ({
  createRecruitment: vi.fn(),
}));

describe('CreateRecruitmentPage', () => {
  it('renders candidate and active vacancy selectors', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CreateRecruitmentPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.queryByText('Inactive Role')).not.toBeInTheDocument();
  });
});
