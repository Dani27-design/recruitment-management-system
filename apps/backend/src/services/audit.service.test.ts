import { describe, expect, it, vi } from 'vitest';
import { AuditService } from './audit.service';

describe('AuditService', () => {
  it('records create audit logs with actor, entity, event, changes, and timestamp data', async () => {
    const repository = {
      create: vi.fn().mockResolvedValue({ id: 'audit-1' }),
    };
    const service = new AuditService(repository as any);

    await service.record({
      actorId: 'admin-1',
      after: { email: 'jane@example.com', id: 'candidate-1' },
      entityId: 'candidate-1',
      entityType: 'CANDIDATE',
      eventType: 'CREATE',
    });

    expect(repository.create).toHaveBeenCalledWith({
      actor_id: 'admin-1',
      entity_id: 'candidate-1',
      entity_type: 'CANDIDATE',
      event_type: 'CREATE',
      changes: {
        before: null,
        after: { email: 'jane@example.com', id: 'candidate-1' },
        changed_fields: ['email', 'id'],
      },
    });
  });

  it('records update audit logs with changed fields only', async () => {
    const repository = {
      create: vi.fn().mockResolvedValue({ id: 'audit-1' }),
    };
    const service = new AuditService(repository as any);

    await service.record({
      actorId: 'admin-1',
      before: { id: 'vacancy-1', status: 'ACTIVE', department: 'Engineering' },
      after: { id: 'vacancy-1', status: 'INACTIVE', department: 'Engineering' },
      entityId: 'vacancy-1',
      entityType: 'VACANCY',
      eventType: 'UPDATE',
    });

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        changes: {
          before: { id: 'vacancy-1', status: 'ACTIVE', department: 'Engineering' },
          after: { id: 'vacancy-1', status: 'INACTIVE', department: 'Engineering' },
          changed_fields: ['status'],
        },
      }),
    );
  });

  it('records delete audit logs and lists audit logs through the repository', async () => {
    const repository = {
      create: vi.fn().mockResolvedValue({ id: 'audit-1' }),
      list: vi.fn().mockResolvedValue([{ id: 'audit-1' }]),
    };
    const service = new AuditService(repository as any);

    await service.record({
      actorId: 'admin-1',
      before: { id: 'document-1', deleted_at: null },
      entityId: 'document-1',
      entityType: 'RECRUITMENT_DOCUMENT',
      eventType: 'DELETE',
    });
    await expect(service.list({ event_type: 'DELETE' })).resolves.toEqual([{ id: 'audit-1' }]);

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        changes: {
          before: { id: 'document-1', deleted_at: null },
          after: null,
          changed_fields: ['deleted_at', 'id'],
        },
      }),
    );
    expect(repository.list).toHaveBeenCalledWith({ event_type: 'DELETE' });
  });
});
