import { describe, expect, it, vi } from 'vitest';
import { AppError } from '../utils/app-error';
import { RecruitmentDocumentService } from './recruitment-document.service';

const admin = { id: 'admin-1', email: 'admin@rms.local', role: 'ADMINISTRATOR' as const };
const manager = { id: 'manager-1', email: 'manager@rms.local', role: 'MANAGER' as const };
const file = {
  originalname: 'cv.pdf',
  mimetype: 'application/pdf',
  size: 1024,
  buffer: Buffer.from('pdf'),
} as Express.Multer.File;
const document = {
  id: 'document-1',
  recruitment_id: 'recruitment-1',
  storage_path: 'recruitment-1/cv.pdf',
};

describe('RecruitmentDocumentService', () => {
  it('lists documents after recruitment access validation', async () => {
    const repository = {
      listByRecruitmentId: vi.fn().mockResolvedValue([document]),
    };
    const service = new RecruitmentDocumentService(
      repository as any,
      { findAssignedById: vi.fn().mockResolvedValue({ id: 'recruitment-1' }) } as any,
      {} as any,
    );

    await expect(service.listByRecruitmentId('recruitment-1', manager)).resolves.toEqual([
      document,
    ]);
  });

  it('uploads files to storage before saving metadata', async () => {
    const repository = {
      create: vi.fn().mockResolvedValue(document),
    };
    const storage = {
      upload: vi.fn().mockResolvedValue({
        storage_provider: 'database',
        storage_path: 'recruitment-1/stored.pdf',
      }),
      deletePhysicalFile: vi.fn(),
    };
    const service = new RecruitmentDocumentService(
      repository as any,
      { findById: vi.fn().mockResolvedValue({ id: 'recruitment-1' }) } as any,
      storage as any,
    );

    await expect(
      service.upload({
        recruitmentId: 'recruitment-1',
        documentType: 'CV',
        file,
        user: admin,
      }),
    ).resolves.toEqual(document);
    expect(storage.upload).toHaveBeenCalledWith(
      expect.objectContaining({
        buffer: file.buffer,
        mimeType: 'application/pdf',
      }),
    );
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        document_type: 'CV',
        original_filename: 'cv.pdf',
        uploaded_by: 'admin-1',
      }),
    );
  });

  it('rolls back physical upload when metadata save fails', async () => {
    const repository = {
      create: vi.fn().mockRejectedValue(new Error('db failed')),
    };
    const storage = {
      upload: vi.fn().mockResolvedValue({
        storage_provider: 'database',
        storage_path: 'recruitment-1/stored.pdf',
      }),
      deletePhysicalFile: vi.fn().mockResolvedValue(undefined),
    };
    const service = new RecruitmentDocumentService(
      repository as any,
      { findById: vi.fn().mockResolvedValue({ id: 'recruitment-1' }) } as any,
      storage as any,
    );

    await expect(
      service.upload({
        recruitmentId: 'recruitment-1',
        documentType: 'CV',
        file,
        user: admin,
      }),
    ).rejects.toThrow('db failed');
    expect(storage.deletePhysicalFile).toHaveBeenCalled();
  });

  it('rejects unsupported document file types and oversized files', async () => {
    const service = new RecruitmentDocumentService(
      {} as any,
      { findById: vi.fn().mockResolvedValue({ id: 'recruitment-1' }) } as any,
      {} as any,
    );

    await expect(
      service.upload({
        recruitmentId: 'recruitment-1',
        documentType: 'CV',
        file: { ...file, mimetype: 'image/png' },
        user: admin,
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      service.upload({
        recruitmentId: 'recruitment-1',
        documentType: 'CV',
        file: { ...file, size: 10 * 1024 * 1024 + 1 },
        user: admin,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('creates signed download URLs after access validation', async () => {
    const service = new RecruitmentDocumentService(
      { findById: vi.fn().mockResolvedValue(document) } as any,
      { findById: vi.fn().mockResolvedValue({ id: 'recruitment-1' }) } as any,
      { createSignedDownloadUrl: vi.fn().mockResolvedValue('https://signed.local') } as any,
    );

    await expect(service.createDownloadUrl('document-1', admin)).resolves.toEqual({
      url: 'https://signed.local',
    });
  });

  it('soft deletes documents only for administrators', async () => {
    const repository = {
      findById: vi.fn().mockResolvedValue(document),
      softDelete: vi.fn().mockResolvedValue({ ...document, deleted_at: new Date() }),
    };
    const service = new RecruitmentDocumentService(
      repository as any,
      { findById: vi.fn().mockResolvedValue({ id: 'recruitment-1' }) } as any,
      {} as any,
    );

    await expect(service.softDelete('document-1', admin)).resolves.toEqual(
      expect.objectContaining({ id: 'document-1' }),
    );
    await expect(service.softDelete('document-1', manager)).rejects.toMatchObject({
      statusCode: 403,
    });
  });
});
