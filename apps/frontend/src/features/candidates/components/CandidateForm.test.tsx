import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CandidateForm } from './CandidateForm';

describe('CandidateForm', () => {
  it('renders candidate fields and submits values', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<CandidateForm submitLabel="Save candidate" onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Full name'), 'Jane Doe');
    await user.type(screen.getByLabelText('Email'), 'jane@example.com');
    await user.type(screen.getByLabelText('Phone number'), '+62 812-3456-7890');
    await user.click(screen.getByRole('button', { name: 'Save candidate' }));

    expect(onSubmit).toHaveBeenCalledWith(
      {
        full_name: 'Jane Doe',
        email: 'jane@example.com',
        phone_number: '+62 812-3456-7890',
      },
      expect.anything(),
    );
  });
});
