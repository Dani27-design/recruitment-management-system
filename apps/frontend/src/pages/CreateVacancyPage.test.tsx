import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { CreateVacancyPage } from './CreateVacancyPage';

vi.mock('../layouts/AppLayout', () => ({
  AppLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../services/vacancy-service', () => ({
  createVacancy: vi.fn(),
}));

describe('CreateVacancyPage', () => {
  it('renders create vacancy form', () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CreateVacancyPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByRole('heading', { name: 'Create Vacancy' })).toBeInTheDocument();
    expect(screen.getByLabelText('Position name')).toBeInTheDocument();
  });
});
