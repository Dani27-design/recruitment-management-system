import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { StageNotes } from './StageNotes';

describe('StageNotes', () => {
  it('edits and saves active stage notes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onSave = vi.fn();

    render(
      <StageNotes id="notes-stage-1" notes={null} value="" onChange={onChange} onSave={onSave} />,
    );

    await user.type(screen.getByLabelText('Notes'), 'Strong candidate');
    await user.click(screen.getByRole('button', { name: 'Save notes' }));

    expect(onChange).toHaveBeenCalled();
    expect(onSave).toHaveBeenCalled();
  });

  it('renders immutable notes for completed stages', () => {
    render(
      <StageNotes
        notes="Completed"
        id="notes-stage-1"
        value="Completed"
        disabled
        onChange={vi.fn()}
        onSave={vi.fn()}
      />,
    );

    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Save notes' })).not.toBeInTheDocument();
  });
});
