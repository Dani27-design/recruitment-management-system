import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SummaryPanel } from './SummaryPanel';

describe('SummaryPanel', () => {
  it('renders summary items', () => {
    render(
      <SummaryPanel
        title="Recruitment Count by Current Stage"
        items={[
          { label: 'Applied', value: 2 },
          { label: 'Screening', value: 1 },
        ]}
      />,
    );

    expect(screen.getByText('Recruitment Count by Current Stage')).toBeInTheDocument();
    expect(screen.getByText('Applied')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders an empty summary state', () => {
    render(<SummaryPanel title="Empty" items={[]} />);

    expect(screen.getByText('No summary data available.')).toBeInTheDocument();
  });
});
