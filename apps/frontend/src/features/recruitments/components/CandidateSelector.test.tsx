import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CandidateSelector } from './CandidateSelector';

describe('CandidateSelector', () => {
  it('renders candidates and emits selected id', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <CandidateSelector
        candidates={[
          {
            id: 'candidate-1',
            full_name: 'Jane Doe',
            email: 'jane@example.com',
            phone_number: '+62 812-3456-7890',
            created_at: '',
            updated_at: '',
          },
        ]}
        value=""
        onChange={onChange}
      />,
    );

    await user.selectOptions(screen.getByLabelText('Candidate'), 'candidate-1');

    expect(onChange).toHaveBeenCalledWith('candidate-1');
  });
});
