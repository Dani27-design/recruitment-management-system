import type { Request, Response } from 'express';
import { sendSuccess } from '../utils/api-response';

export class HealthController {
  check = (_req: Request, res: Response) =>
    sendSuccess(res, 200, 'Health check passed', {
      status: 'ok',
    });
}
