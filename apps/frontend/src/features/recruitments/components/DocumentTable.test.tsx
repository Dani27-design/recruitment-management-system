import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DocumentTable } from './DocumentTable';

const documents = [
  {
    id: 'document-1',
    recruitment_id: 'recruitment-1',
    document_type: 'CV' as const,
    original_filename: 'cv.pdf',
    stored_filename: 'stored.pdf',
    mime_type: 'application/pdf',
    file_size: 100,
    storage_provider: 'database',
    storage_path: 'recruitment-1/stored.pdf',
    uploaded_by: 'admin-1',
    created_at: '2026-07-02T00:00:00.000Z',
    updated_at: '2026-07-02T00:00:00.000Z',
    deleted_at: null,
    uploader: { id: 'admin-1', email: 'admin@rms.local', role: 'ADMINISTRATOR' },
  },
];

describe('DocumentTable', () => {
  it('renders document rows and actions', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const onDownload = vi.fn();

    render(
      <DocumentTable
        documents={documents}
        canDelete
        onDelete={onDelete}
        onDownload={onDownload}
      />,
    );

    expect(screen.getByText('cv.pdf')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Download' }));
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(onDownload).toHaveBeenCalledWith('document-1');
    expect(onDelete).toHaveBeenCalledWith('document-1');
  });

  it('hides delete actions when users cannot delete documents', () => {
    render(
      <DocumentTable
        documents={documents}
        canDelete={false}
        onDelete={vi.fn()}
        onDownload={vi.fn()}
      />,
    );

    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
  });
});
