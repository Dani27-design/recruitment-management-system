import { describe, expect, it, vi } from 'vitest';

vi.mock('../api/http', () => ({
  http: {
    delete: vi.fn(),
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const document = {
  id: 'document-1',
  recruitment_id: 'recruitment-1',
  document_type: 'CV',
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
};

describe('recruitment-document-service', () => {
  it('lists documents for a recruitment', async () => {
    const { http } = await import('../api/http');
    const { listRecruitmentDocuments } = await import('./recruitment-document-service');
    vi.mocked(http.get).mockResolvedValue({
      data: { success: true, message: 'OK', data: [document] },
    });

    await expect(listRecruitmentDocuments('recruitment-1')).resolves.toEqual([document]);
    expect(http.get).toHaveBeenCalledWith('/recruitments/recruitment-1/documents');
  });

  it('uploads documents as multipart form data', async () => {
    const { http } = await import('../api/http');
    const { uploadRecruitmentDocument } = await import('./recruitment-document-service');
    const file = new File(['pdf'], 'cv.pdf', { type: 'application/pdf' });
    vi.mocked(http.post).mockResolvedValue({
      data: { success: true, message: 'OK', data: document },
    });

    await expect(
      uploadRecruitmentDocument('recruitment-1', { document_type: 'CV', file }),
    ).resolves.toEqual(document);
    expect(http.post).toHaveBeenCalledWith(
      '/recruitments/recruitment-1/documents',
      expect.any(FormData),
    );
  });

  it('creates download URLs and soft deletes documents', async () => {
    const { http } = await import('../api/http');
    const {
      createRecruitmentDocumentDownloadUrl,
      deleteRecruitmentDocument,
    } = await import('./recruitment-document-service');
    vi.mocked(http.get).mockResolvedValue({
      data: { success: true, message: 'OK', data: { url: 'https://signed.local' } },
    });
    vi.mocked(http.delete).mockResolvedValue({
      data: { success: true, message: 'OK', data: document },
    });

    await expect(createRecruitmentDocumentDownloadUrl('document-1')).resolves.toBe(
      'https://signed.local',
    );
    await expect(deleteRecruitmentDocument('document-1')).resolves.toEqual(document);
    expect(http.get).toHaveBeenCalledWith('/documents/document-1/download');
    expect(http.delete).toHaveBeenCalledWith('/documents/document-1');
  });
});
