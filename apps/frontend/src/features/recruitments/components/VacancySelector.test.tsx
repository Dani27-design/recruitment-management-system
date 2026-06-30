import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { VacancySelector } from './VacancySelector';

describe('VacancySelector', () => {
  it('renders vacancies and emits selected id', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <VacancySelector
        vacancies={[
          {
            id: 'vacancy-1',
            position_name: 'Software Engineer',
            department: 'Engineering',
            hiring_needed: 2,
            status: 'ACTIVE',
            created_at: '',
            updated_at: '',
          },
        ]}
        value=""
        onChange={onChange}
      />,
    );

    await user.selectOptions(screen.getByLabelText('Vacancy'), 'vacancy-1');

    expect(onChange).toHaveBeenCalledWith('vacancy-1');
  });
});
