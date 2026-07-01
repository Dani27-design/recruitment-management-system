import type { Request, Response } from 'express';
import { CandidateService } from '../services/candidate.service';
import { sendSuccess } from '../utils/api-response';

export class CandidateController {
  constructor(private readonly candidateService = new CandidateService()) {}

  list = async (req: Request, res: Response) => {
    const candidates = await this.candidateService.list(req.query);

    return sendSuccess(res, 200, 'Candidates retrieved successfully', candidates);
  };

  getById = async (req: Request, res: Response) => {
    const candidate = await this.candidateService.getById(req.params.id);

    return sendSuccess(res, 200, 'Candidate retrieved successfully', candidate);
  };

  create = async (req: Request, res: Response) => {
    const candidate = await this.candidateService.create(req.body, req.user!.id);

    return sendSuccess(res, 201, 'Candidate created successfully', candidate);
  };

  update = async (req: Request, res: Response) => {
    const candidate = await this.candidateService.update(req.params.id, req.body, req.user!.id);

    return sendSuccess(res, 200, 'Candidate updated successfully', candidate);
  };

  delete = async (req: Request, res: Response) => {
    const candidate = await this.candidateService.delete(req.params.id, req.user!.id);

    return sendSuccess(res, 200, 'Candidate deleted successfully', candidate);
  };
}
