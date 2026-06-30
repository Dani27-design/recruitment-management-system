import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { VacancyTable } from './VacancyTable';

const vacancies = [
  {
    id: 'vacancy-1',
    position_name: 'Software Engineer',
    department: 'Engineering',
    hiring_needed: 2,
    status: 'ACTIVE' as const,
    created_at: '2026-07-01T00:00:00.000Z',
    updated_at: '2026-07-01T00:00:00.000Z',
  },
];

describe('VacancyTable', () => {
  it('renders vacancy rows and management actions', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <MemoryRouter>
        <VacancyTable vacancies={vacancies} canManage onDelete={onDelete} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onDelete).toHaveBeenCalledWith(vacancies[0]);
  });

  it('hides management actions when users cannot manage vacancies', () => {
    render(
      <MemoryRouter>
        <VacancyTable vacancies={vacancies} canManage={false} onDelete={vi.fn()} />
      </MemoryRouter>,
    );

    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });
});
