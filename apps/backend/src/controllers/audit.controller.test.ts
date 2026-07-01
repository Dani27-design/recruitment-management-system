import { describe, expect, it, vi } from 'vitest';
import { AuditController } from './audit.controller';

describe('AuditController', () => {
  it('returns audit logs with standardized responses', async () => {
    const auditLogs = [{ id: 'audit-1' }];
    const controller = new AuditController({
      list: vi.fn().mockResolvedValue(auditLogs),
    } as any);
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };

    await controller.list({ query: { entity_type: 'CANDIDATE' } } as any, res as any);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Audit logs retrieved successfully',
      data: auditLogs,
    });
  });
});
