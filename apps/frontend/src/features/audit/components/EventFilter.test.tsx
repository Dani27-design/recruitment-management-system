import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EventFilter } from './EventFilter';

describe('EventFilter', () => {
  it('selects audit event filters', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<EventFilter value="" onChange={onChange} />);

    await user.selectOptions(screen.getByLabelText('Event'), 'UPDATE');

    expect(onChange).toHaveBeenCalledWith('UPDATE');
  });
});
