import type { NextFunction, Request, Response } from 'express';
import { RecruitmentStageRepository } from '../repositories/recruitment-stage.repository';
import { AppError, ForbiddenError, UnauthorizedError } from '../utils/app-error';

export function requireStageOwnership(
  recruitmentStageRepository = new RecruitmentStageRepository(),
) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    if (req.user.role === 'ADMINISTRATOR') {
      next();
      return;
    }

    const stage = await recruitmentStageRepository.findById(req.params.id);

    if (!stage) {
      throw new AppError('Recruitment stage not found', 404);
    }

    if (stage.assigned_user_id !== req.user.id) {
      throw new ForbiddenError('Managers may only update stages assigned to themselves');
    }

    next();
  };
}
