import { describe, expect, it, vi } from 'vitest';

vi.mock('../api/http', () => ({
  http: {
    get: vi.fn(),
  },
}));

describe('audit-service', () => {
  it('lists audit logs with filters', async () => {
    const { http } = await import('../api/http');
    const { listAuditLogs } = await import('./audit-service');
    const auditLogs = [{ id: 'audit-1' }];
    vi.mocked(http.get).mockResolvedValue({
      data: { success: true, message: 'OK', data: auditLogs },
    });

    await expect(
      listAuditLogs({ entity_type: 'CANDIDATE', event_type: 'CREATE' }),
    ).resolves.toEqual(auditLogs);
    expect(http.get).toHaveBeenCalledWith('/audit-logs', {
      params: { entity_type: 'CANDIDATE', event_type: 'CREATE' },
    });
  });
});
