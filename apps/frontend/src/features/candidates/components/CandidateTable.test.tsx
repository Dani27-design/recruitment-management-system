import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { CandidateTable } from './CandidateTable';

const candidates = [
  {
    id: 'candidate-1',
    full_name: 'Jane Doe',
    email: 'jane@example.com',
    phone_number: '+62 812-3456-7890',
    created_at: '2026-07-01T00:00:00.000Z',
    updated_at: '2026-07-01T00:00:00.000Z',
  },
];

describe('CandidateTable', () => {
  it('renders candidate rows and management actions', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <MemoryRouter>
        <CandidateTable candidates={candidates} canManage onDelete={onDelete} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onDelete).toHaveBeenCalledWith(candidates[0]);
  });

  it('hides management actions when users cannot manage candidates', () => {
    render(
      <MemoryRouter>
        <CandidateTable candidates={candidates} canManage={false} onDelete={vi.fn()} />
      </MemoryRouter>,
    );

    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });
});
