import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CandidateSearchBar } from './CandidateSearchBar';

describe('CandidateSearchBar', () => {
  it('submits trimmed search terms', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<CandidateSearchBar onSearch={onSearch} />);

    await user.type(screen.getByLabelText('Search candidates'), ' Jane ');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(onSearch).toHaveBeenCalledWith('Jane');
  });
});
