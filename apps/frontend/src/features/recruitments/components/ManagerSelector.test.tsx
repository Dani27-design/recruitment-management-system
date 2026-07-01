import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ManagerSelector } from './ManagerSelector';

describe('ManagerSelector', () => {
  it('selects a manager', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <ManagerSelector
        managers={[{ id: 'manager-1', email: 'manager@rms.local', role: 'MANAGER' }]}
        value=""
        onChange={onChange}
      />,
    );

    await user.selectOptions(screen.getByLabelText('Assigned manager'), 'manager-1');

    expect(onChange).toHaveBeenCalledWith('manager-1');
  });
});
