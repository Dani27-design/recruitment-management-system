import { describe, expect, it, vi } from 'vitest';
import { RecruitmentDocumentController } from './recruitment-document.controller';

function createResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any;
}

const user = { id: 'admin-1', email: 'admin@rms.local', role: 'ADMINISTRATOR' };

describe('RecruitmentDocumentController', () => {
  it('returns standardized document list responses', async () => {
    const controller = new RecruitmentDocumentController({
      listByRecruitmentId: vi.fn().mockResolvedValue([{ id: 'document-1' }]),
    } as any);
    const res = createResponse();

    await controller.listByRecruitment({ params: { id: 'recruitment-1' }, user } as any, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Recruitment documents retrieved successfully',
      data: [{ id: 'document-1' }],
    });
  });

  it('uploads documents through the service', async () => {
    const service = {
      upload: vi.fn().mockResolvedValue({ id: 'document-1' }),
    };
    const controller = new RecruitmentDocumentController(service as any);
    const res = createResponse();
    const file = { originalname: 'cv.pdf' };

    await controller.upload(
      {
        params: { id: 'recruitment-1' },
        body: { document_type: 'CV' },
        file,
        user,
      } as any,
      res,
    );

    expect(service.upload).toHaveBeenCalledWith({
      recruitmentId: 'recruitment-1',
      documentType: 'CV',
      file,
      user,
    });
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('returns download URLs and soft delete responses', async () => {
    const service = {
      createDownloadUrl: vi.fn().mockResolvedValue({ url: 'https://signed.local' }),
      softDelete: vi.fn().mockResolvedValue({ id: 'document-1', deleted_at: 'now' }),
    };
    const controller = new RecruitmentDocumentController(service as any);

    await controller.download({ params: { id: 'document-1' }, user } as any, createResponse());
    await controller.delete({ params: { id: 'document-1' }, user } as any, createResponse());

    expect(service.createDownloadUrl).toHaveBeenCalledWith('document-1', user);
    expect(service.softDelete).toHaveBeenCalledWith('document-1', user);
  });
});
