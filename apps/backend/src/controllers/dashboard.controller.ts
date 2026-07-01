import type { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { sendSuccess } from '../utils/api-response';

export class DashboardController {
  constructor(private readonly dashboardService = new DashboardService()) {}

  summary = async (_req: Request, res: Response) => {
    const summary = await this.dashboardService.getSummary();

    return sendSuccess(res, 200, 'Dashboard summary retrieved successfully', summary);
  };
}
