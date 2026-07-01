import type { Request, Response } from 'express';
import { RecruitmentStageService } from '../services/recruitment-stage.service';
import { sendSuccess } from '../utils/api-response';

export class RecruitmentStageController {
  constructor(private readonly recruitmentStageService = new RecruitmentStageService()) {}

  listByRecruitment = async (req: Request, res: Response) => {
    const stages = await this.recruitmentStageService.listByRecruitmentId(
      req.params.id,
      req.user!,
    );

    return sendSuccess(res, 200, 'Recruitment stages retrieved successfully', stages);
  };

  updateStatus = async (req: Request, res: Response) => {
    const stage = await this.recruitmentStageService.updateStatus(
      req.params.id,
      req.body,
      req.user!,
    );

    return sendSuccess(res, 200, 'Recruitment stage updated successfully', stage);
  };

  assignManager = async (req: Request, res: Response) => {
    const stage = await this.recruitmentStageService.assignManager(
      req.params.id,
      req.body,
      req.user!,
    );

    return sendSuccess(res, 200, 'Recruitment stage assignment updated successfully', stage);
  };
}
