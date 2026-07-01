import type { Request, Response } from 'express';
import { RecruitmentDocumentService } from '../services/recruitment-document.service';
import { sendSuccess } from '../utils/api-response';

export class RecruitmentDocumentController {
  constructor(private readonly recruitmentDocumentService = new RecruitmentDocumentService()) {}

  listByRecruitment = async (req: Request, res: Response) => {
    const documents = await this.recruitmentDocumentService.listByRecruitmentId(
      req.params.id,
      req.user!,
    );

    return sendSuccess(res, 200, 'Recruitment documents retrieved successfully', documents);
  };

  upload = async (req: Request, res: Response) => {
    const document = await this.recruitmentDocumentService.upload({
      recruitmentId: req.params.id,
      documentType: req.body.document_type,
      file: req.file,
      user: req.user!,
    });

    return sendSuccess(res, 201, 'Recruitment document uploaded successfully', document);
  };

  download = async (req: Request, res: Response) => {
    const download = await this.recruitmentDocumentService.createDownloadUrl(
      req.params.id,
      req.user!,
    );

    return sendSuccess(res, 200, 'Recruitment document download URL created successfully', download);
  };

  delete = async (req: Request, res: Response) => {
    const document = await this.recruitmentDocumentService.softDelete(req.params.id, req.user!);

    return sendSuccess(res, 200, 'Recruitment document deleted successfully', document);
  };
}
