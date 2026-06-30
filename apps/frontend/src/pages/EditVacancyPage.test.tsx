import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { EditVacancyPage } from './EditVacancyPage';

vi.mock('../layouts/AppLayout', () => ({
  AppLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../services/vacancy-service', () => ({
  getVacancy: vi.fn().mockResolvedValue({
    id: 'vacancy-1',
    position_name: 'Software Engineer',
    department: 'Engineering',
    hiring_needed: 2,
    status: 'ACTIVE',
    created_at: '2026-07-01T00:00:00.000Z',
    updated_at: '2026-07-01T00:00:00.000Z',
  }),
  updateVacancy: vi.fn(),
}));

describe('EditVacancyPage', () => {
  it('renders vacancy edit form with existing values', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/vacancies/vacancy-1/edit']}>
          <Routes>
            <Route path="/vacancies/:id/edit" element={<EditVacancyPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByDisplayValue('Software Engineer')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Engineering')).toBeInTheDocument();
  });
});
