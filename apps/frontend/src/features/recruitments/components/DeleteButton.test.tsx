import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DeleteButton } from './DeleteButton';

describe('DeleteButton', () => {
  it('triggers document deletion', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(<DeleteButton onDelete={onDelete} />);

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(onDelete).toHaveBeenCalled();
  });
});
