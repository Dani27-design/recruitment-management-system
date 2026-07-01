import type { Request, Response } from 'express';
import { AuditService } from '../services/audit.service';
import { sendSuccess } from '../utils/api-response';

export class AuditController {
  constructor(private readonly auditService = new AuditService()) {}

  list = async (req: Request, res: Response) => {
    const auditLogs = await this.auditService.list(req.query);

    return sendSuccess(res, 200, 'Audit logs retrieved successfully', auditLogs);
  };
}
