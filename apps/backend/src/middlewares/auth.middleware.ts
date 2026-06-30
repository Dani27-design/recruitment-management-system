import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../utils/app-error';
import { verifyAccessToken } from '../utils/jwt';

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing access token');
  }

  const token = authorizationHeader.replace('Bearer ', '').trim();
  req.user = verifyAccessToken(token);

  next();
}
