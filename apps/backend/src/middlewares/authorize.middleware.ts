import type { NextFunction, Request, Response } from 'express';
import type { UserRole } from '../constants/roles';
import { ForbiddenError, UnauthorizedError } from '../utils/app-error';

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError();
    }

    next();
  };
}
