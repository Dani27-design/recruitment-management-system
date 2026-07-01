import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DownloadButton } from './DownloadButton';

describe('DownloadButton', () => {
  it('triggers document downloads', async () => {
    const user = userEvent.setup();
    const onDownload = vi.fn();

    render(<DownloadButton onDownload={onDownload} />);

    await user.click(screen.getByRole('button', { name: 'Download' }));

    expect(onDownload).toHaveBeenCalled();
  });
});
