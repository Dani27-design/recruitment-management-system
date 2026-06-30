import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { VacancyForm } from './VacancyForm';

describe('VacancyForm', () => {
  it('renders vacancy fields and submits values', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<VacancyForm submitLabel="Save vacancy" onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Position name'), 'Software Engineer');
    await user.type(screen.getByLabelText('Department'), 'Engineering');
    await user.clear(screen.getByLabelText('Hiring needed'));
    await user.type(screen.getByLabelText('Hiring needed'), '2');
    await user.selectOptions(screen.getByLabelText('Status'), 'INACTIVE');
    await user.click(screen.getByRole('button', { name: 'Save vacancy' }));

    expect(onSubmit).toHaveBeenCalledWith(
      {
        position_name: 'Software Engineer',
        department: 'Engineering',
        hiring_needed: 2,
        status: 'INACTIVE',
      },
      expect.anything(),
    );
  });
});
