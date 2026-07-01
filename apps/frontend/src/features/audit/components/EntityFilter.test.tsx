import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EntityFilter } from './EntityFilter';

describe('EntityFilter', () => {
  it('selects audit entity filters', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<EntityFilter value="" onChange={onChange} />);

    await user.selectOptions(screen.getByLabelText('Entity'), 'CANDIDATE');

    expect(onChange).toHaveBeenCalledWith('CANDIDATE');
  });
});
