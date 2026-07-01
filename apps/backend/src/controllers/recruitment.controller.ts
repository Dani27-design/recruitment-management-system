import type { Request, Response } from 'express';
import { RecruitmentService } from '../services/recruitment.service';
import { sendSuccess } from '../utils/api-response';

export class RecruitmentController {
  constructor(private readonly recruitmentService = new RecruitmentService()) {}

  list = async (req: Request, res: Response) => {
    const recruitments = await this.recruitmentService.list(req.user!);

    return sendSuccess(res, 200, 'Recruitments retrieved successfully', recruitments);
  };

  getById = async (req: Request, res: Response) => {
    const recruitment = await this.recruitmentService.getById(req.params.id, req.user!);

    return sendSuccess(res, 200, 'Recruitment retrieved successfully', recruitment);
  };

  create = async (req: Request, res: Response) => {
    const recruitment = await this.recruitmentService.create(req.body, req.user!.id);

    return sendSuccess(res, 201, 'Recruitment created successfully', recruitment);
  };
}
