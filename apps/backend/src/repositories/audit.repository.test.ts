import { describe, expect, it, vi } from 'vitest';
import { AuditRepository } from './audit.repository';

describe('AuditRepository', () => {
  it('creates audit logs', async () => {
    const auditLog = { id: 'audit-1' };
    const db = {
      auditLog: {
        create: vi.fn().mockResolvedValue(auditLog),
      },
    };
    const repository = new AuditRepository(db as any);
    const input = {
      actor_id: 'admin-1',
      changes: { before: null, after: { id: 'candidate-1' }, changed_fields: ['id'] },
      entity_id: 'candidate-1',
      entity_type: 'CANDIDATE' as const,
      event_type: 'CREATE' as const,
    };

    await expect(repository.create(input)).resolves.toEqual(auditLog);
    expect(db.auditLog.create).toHaveBeenCalledWith({ data: input });
  });

  it('lists audit logs with filters and actor details', async () => {
    const db = {
      auditLog: {
        findMany: vi.fn().mockResolvedValue([]),
      },
    };
    const repository = new AuditRepository(db as any);

    await expect(
      repository.list({ entity_type: 'VACANCY', event_type: 'UPDATE' }),
    ).resolves.toEqual([]);
    expect(db.auditLog.findMany).toHaveBeenCalledWith({
      where: { entity_type: 'VACANCY', event_type: 'UPDATE' },
      include: {
        actor: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  });
});
