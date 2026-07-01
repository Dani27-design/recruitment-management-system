import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { StageCard } from './StageCard';

const stage = {
  id: 'stage-1',
  recruitment_id: 'recruitment-1',
  stage: 'APPLIED' as const,
  status: 'PENDING' as const,
  assigned_user_id: null,
  scheduled_at: null,
  completed_at: null,
  notes: null,
  created_at: '2026-07-01T00:00:00.000Z',
  updated_at: '2026-07-01T00:00:00.000Z',
};

describe('StageCard', () => {
  it('submits active stage pass updates', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();

    render(<StageCard stage={stage} onUpdate={onUpdate} />);

    await user.type(screen.getByLabelText('Notes'), 'Ready');
    await user.click(screen.getByRole('button', { name: 'Mark passed' }));

    expect(onUpdate).toHaveBeenCalledWith('stage-1', {
      status: 'PASSED',
      notes: 'Ready',
    });
  });

  it('hides actions for completed stages', () => {
    render(
      <StageCard
        stage={{
          ...stage,
          status: 'PASSED',
          completed_at: '2026-07-01T10:00:00.000Z',
        }}
        onUpdate={vi.fn()}
      />,
    );

    expect(screen.queryByRole('button', { name: 'Mark passed' })).not.toBeInTheDocument();
  });
});
