import type { Prisma } from '@prisma/client';
import {
  AUDIT_EVENT_TYPES,
  type AuditEntityType,
  type AuditEventType,
} from '../constants/audit';
import {
  AuditRepository,
  type AuditLogListFilters,
  type AuditLogWithActor,
} from '../repositories/audit.repository';

type AuditRecord = Record<string, unknown>;

interface AuditInput {
  actorId: string;
  after?: unknown;
  before?: unknown;
  entityId: string;
  entityType: AuditEntityType;
  eventType: AuditEventType;
}

export interface AuditChanges {
  before: AuditRecord | null;
  after: AuditRecord | null;
  changed_fields: string[];
}

export class AuditService {
  constructor(private readonly auditRepository = new AuditRepository()) {}

  list(filters: AuditLogListFilters): Promise<AuditLogWithActor[]> {
    return this.auditRepository.list(filters);
  }

  record(input: AuditInput) {
    const before = this.toAuditRecord(input.before ?? null);
    const after = this.toAuditRecord(input.after ?? null);
    const changes = this.buildChanges(
      input.eventType,
      before,
      after,
    );

    return this.auditRepository.create({
      actor_id: input.actorId,
      changes: changes as unknown as Prisma.InputJsonValue,
      entity_id: input.entityId,
      entity_type: input.entityType,
      event_type: input.eventType,
    });
  }

  private buildChanges(
    eventType: AuditEventType,
    before: AuditRecord | null,
    after: AuditRecord | null,
  ): AuditChanges {
    if (eventType === AUDIT_EVENT_TYPES.CREATE) {
      return {
        before: null,
        after,
        changed_fields: after ? Object.keys(after).sort() : [],
      };
    }

    if (eventType === AUDIT_EVENT_TYPES.DELETE) {
      return {
        before,
        after: null,
        changed_fields: before ? Object.keys(before).sort() : [],
      };
    }

    return {
      before,
      after,
      changed_fields: this.getChangedFields(before, after),
    };
  }

  private getChangedFields(before: AuditRecord | null, after: AuditRecord | null) {
    const keys = new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})]);

    return [...keys]
      .filter((key) => !this.areEqual(before?.[key], after?.[key]))
      .sort();
  }

  private areEqual(left: unknown, right: unknown) {
    return JSON.stringify(left) === JSON.stringify(right);
  }

  private toAuditRecord(record: unknown): AuditRecord | null {
    if (!record) {
      return null;
    }

    return JSON.parse(JSON.stringify(record)) as AuditRecord;
  }
}
