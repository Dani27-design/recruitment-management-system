import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { DashboardPage } from './DashboardPage';

const mocks = vi.hoisted(() => ({
  getDashboardSummary: vi.fn(),
}));

vi.mock('../layouts/AppLayout', () => ({
  AppLayout: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock('../services/dashboard-service', () => ({
  getDashboardSummary: mocks.getDashboardSummary,
}));

function renderDashboard() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <DashboardPage />
    </QueryClientProvider>,
  );
}

describe('DashboardPage', () => {
  it('renders dashboard summary statistics and panels', async () => {
    mocks.getDashboardSummary.mockResolvedValue({
      total_candidates: 4,
      total_active_vacancies: 2,
      total_recruitments: 3,
      recruitment_count_by_current_stage: {
        ACCEPTANCE: 0,
        APPLIED: 1,
        INTERVIEW: 0,
        SCREENING: 1,
        TECHNICAL_TEST: 1,
      },
      recruitment_count_by_current_status: {
        PASSED: 1,
        PENDING: 1,
        REJECTED: 1,
      },
    });

    renderDashboard();

    expect(await screen.findByText('Dashboard')).toBeInTheDocument();
    expect(await screen.findByText('Total Candidates')).toBeInTheDocument();
    expect(screen.getByText('Total Active Vacancies')).toBeInTheDocument();
    expect(screen.getByText('Total Recruitments')).toBeInTheDocument();
    expect(screen.getByText('Recruitment Count by Current Stage')).toBeInTheDocument();
    expect(screen.getByText('Technical Test')).toBeInTheDocument();
    expect(screen.getByText('Recruitment Count by Current Status')).toBeInTheDocument();
    expect(screen.getByText('Rejected')).toBeInTheDocument();
  });

  it('renders dashboard empty state', async () => {
    mocks.getDashboardSummary.mockResolvedValue({
      total_candidates: 0,
      total_active_vacancies: 0,
      total_recruitments: 0,
      recruitment_count_by_current_stage: {
        ACCEPTANCE: 0,
        APPLIED: 0,
        INTERVIEW: 0,
        SCREENING: 0,
        TECHNICAL_TEST: 0,
      },
      recruitment_count_by_current_status: {
        PASSED: 0,
        PENDING: 0,
        REJECTED: 0,
      },
    });

    renderDashboard();

    expect(await screen.findByText('No dashboard data available.')).toBeInTheDocument();
  });

  it('renders dashboard API errors', async () => {
    mocks.getDashboardSummary.mockRejectedValue(new Error('Failed'));

    renderDashboard();

    expect(await screen.findByText('Unable to load dashboard summary.')).toBeInTheDocument();
  });
});
