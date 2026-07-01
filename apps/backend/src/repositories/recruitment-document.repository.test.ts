import { describe, expect, it, vi } from 'vitest';
import { RecruitmentDocumentRepository } from './recruitment-document.repository';

describe('RecruitmentDocumentRepository', () => {
  it('creates document metadata', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'document-1' });
    const repository = new RecruitmentDocumentRepository({
      recruitmentDocument: { create },
    } as any);

    await expect(
      repository.create({
        recruitment_id: 'recruitment-1',
        document_type: 'CV',
        original_filename: 'cv.pdf',
        stored_filename: 'stored.pdf',
        mime_type: 'application/pdf',
        file_size: 100,
        storage_provider: 'database',
        storage_path: 'recruitment-1/stored.pdf',
        uploaded_by: 'admin-1',
      }),
    ).resolves.toEqual({ id: 'document-1' });
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          document_type: 'CV',
          storage_provider: 'database',
        }),
      }),
    );
  });

  it('finds and lists only non-deleted document metadata', async () => {
    const findFirst = vi.fn().mockResolvedValue({ id: 'document-1' });
    const findMany = vi.fn().mockResolvedValue([{ id: 'document-1' }]);
    const repository = new RecruitmentDocumentRepository({
      recruitmentDocument: { findFirst, findMany },
    } as any);

    await expect(repository.findById('document-1')).resolves.toEqual({ id: 'document-1' });
    await expect(repository.listByRecruitmentId('recruitment-1')).resolves.toEqual([
      { id: 'document-1' },
    ]);
    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'document-1', deleted_at: null },
      }),
    );
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { recruitment_id: 'recruitment-1', deleted_at: null },
      }),
    );
  });

  it('soft deletes document metadata', async () => {
    const update = vi.fn().mockResolvedValue({ id: 'document-1', deleted_at: new Date() });
    const repository = new RecruitmentDocumentRepository({
      recruitmentDocument: { update },
    } as any);

    await expect(repository.softDelete('document-1')).resolves.toEqual(
      expect.objectContaining({ id: 'document-1' }),
    );
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'document-1' },
        data: { deleted_at: expect.any(Date) },
      }),
    );
  });
});
