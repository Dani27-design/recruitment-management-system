import { describe, expect, it, vi } from 'vitest';
import { AppError } from '../utils/app-error';
import { DocumentStorageService } from './document-storage.service';

function createClientMock() {
  const upload = vi.fn().mockResolvedValue({ data: {}, error: null });
  const createSignedUrl = vi.fn().mockResolvedValue({
    data: { signedUrl: 'https://signed.local/document' },
    error: null,
  });
  const remove = vi.fn().mockResolvedValue({ data: {}, error: null });
  const createBucket = vi.fn().mockResolvedValue({ data: {}, error: null });

  return {
    client: {
      storage: {
        createBucket,
        from: vi.fn().mockReturnValue({ upload, createSignedUrl, remove }),
      },
    },
    createBucket,
    upload,
    createSignedUrl,
    remove,
  };
}

describe('DocumentStorageService', () => {
  it('uploads documents to configured storage bucket', async () => {
    const mock = createClientMock();
    const service = new DocumentStorageService(() => mock.client as any, 'database');

    await expect(
      service.upload({
        buffer: Buffer.from('file'),
        mimeType: 'application/pdf',
        storagePath: 'recruitment-1/document.pdf',
      }),
    ).resolves.toEqual({
      storage_provider: 'database',
      storage_path: 'recruitment-1/document.pdf',
    });
    expect(mock.client.storage.from).toHaveBeenCalledWith('database');
    expect(mock.upload).toHaveBeenCalledWith(
      'recruitment-1/document.pdf',
      Buffer.from('file'),
      {
        contentType: 'application/pdf',
        upsert: false,
      },
    );
  });

  it('creates signed download URLs', async () => {
    const mock = createClientMock();
    const service = new DocumentStorageService(() => mock.client as any, 'database');

    await expect(service.createSignedDownloadUrl('path/file.pdf')).resolves.toBe(
      'https://signed.local/document',
    );
    expect(mock.createSignedUrl).toHaveBeenCalledWith('path/file.pdf', 60);
  });

  it('soft delete callers can remove physical files only for rollback', async () => {
    const mock = createClientMock();
    const service = new DocumentStorageService(() => mock.client as any, 'database');

    await service.deletePhysicalFile('path/file.pdf');

    expect(mock.remove).toHaveBeenCalledWith(['path/file.pdf']);
  });

  it('wraps storage upload errors', async () => {
    const mock = createClientMock();
    mock.upload.mockResolvedValue({ data: null, error: new Error('failed') });
    const service = new DocumentStorageService(() => mock.client as any, 'database');

    await expect(
      service.upload({
        buffer: Buffer.from('file'),
        mimeType: 'application/pdf',
        storagePath: 'file.pdf',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
