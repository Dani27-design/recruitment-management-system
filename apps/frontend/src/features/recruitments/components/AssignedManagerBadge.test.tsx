import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AssignedManagerBadge } from './AssignedManagerBadge';

describe('AssignedManagerBadge', () => {
  it('renders assigned manager email or an unassigned label', () => {
    const { rerender } = render(
      <AssignedManagerBadge manager={{ id: 'manager-1', email: 'manager@rms.local', role: 'MANAGER' }} />,
    );

    expect(screen.getByText('manager@rms.local')).toBeInTheDocument();

    rerender(<AssignedManagerBadge manager={null} />);

    expect(screen.getByText('Unassigned')).toBeInTheDocument();
  });
});
