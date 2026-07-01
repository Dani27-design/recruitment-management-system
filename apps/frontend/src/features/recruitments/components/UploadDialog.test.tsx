import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { UploadDialog } from './UploadDialog';

describe('UploadDialog', () => {
  it('submits selected document files', async () => {
    const user = userEvent.setup();
    const onUpload = vi.fn();
    const file = new File(['pdf'], 'cv.pdf', { type: 'application/pdf' });

    render(<UploadDialog onUpload={onUpload} />);

    await user.selectOptions(screen.getByLabelText('Document type'), 'CV');
    await user.upload(screen.getByLabelText('File'), file);
    await user.click(screen.getByRole('button', { name: 'Upload' }));

    expect(onUpload).toHaveBeenCalledWith({
      document_type: 'CV',
      file,
    });
  });
});
