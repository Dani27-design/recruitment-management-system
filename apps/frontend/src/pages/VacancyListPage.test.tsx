import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { VacancyListPage } from './VacancyListPage';

vi.mock('../features/auth/AuthProvider', () => ({
  useAuth: () => ({
    user: { id: '1', email: 'admin@rms.local', role: 'ADMINISTRATOR' },
  }),
}));

vi.mock('../layouts/AppLayout', () => ({
  AppLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../services/vacancy-service', () => ({
  listVacancies: vi.fn().mockResolvedValue([
    {
      id: 'vacancy-1',
      position_name: 'Software Engineer',
      department: 'Engineering',
      hiring_needed: 2,
      status: 'ACTIVE',
      created_at: '2026-07-01T00:00:00.000Z',
      updated_at: '2026-07-01T00:00:00.000Z',
    },
  ]),
  deleteVacancy: vi.fn(),
}));

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <VacancyListPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('VacancyListPage', () => {
  it('renders vacancies and create action for administrators', async () => {
    renderPage();

    expect(await screen.findByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Create Vacancy')).toBeInTheDocument();
  });
});
