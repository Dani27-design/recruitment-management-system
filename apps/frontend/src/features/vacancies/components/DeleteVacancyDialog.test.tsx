import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DeleteVacancyDialog } from './DeleteVacancyDialog';

const vacancy = {
  id: 'vacancy-1',
  position_name: 'Software Engineer',
  department: 'Engineering',
  hiring_needed: 2,
  status: 'ACTIVE' as const,
  created_at: '2026-07-01T00:00:00.000Z',
  updated_at: '2026-07-01T00:00:00.000Z',
};

describe('DeleteVacancyDialog', () => {
  it('renders confirmation actions for selected vacancies', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <DeleteVacancyDialog vacancy={vacancy} onCancel={onCancel} onConfirm={onConfirm} />,
    );

    expect(screen.getByText(/Delete Software Engineer/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onCancel).toHaveBeenCalledOnce();
  });
});
