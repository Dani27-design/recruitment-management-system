import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatisticCard } from './StatisticCard';

describe('StatisticCard', () => {
  it('renders a statistic label and value', () => {
    render(<StatisticCard label="Total Candidates" value={7} />);

    expect(screen.getByText('Total Candidates')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });
});
