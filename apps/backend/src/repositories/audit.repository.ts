import type { AuditLog, Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '../prisma/client';
import type { AuditEntityType, AuditEventType } from '../constants/audit';

const auditLogInclude = {
  actor: {
    select: {
      id: true,
      email: true,
      role: true,
    },
  },
} satisfies Prisma.AuditLogInclude;

export type AuditLogWithActor = Prisma.AuditLogGetPayload<{
  include: typeof auditLogInclude;
}>;

interface AuditLogCreateInput {
  actor_id: string;
  changes: Prisma.InputJsonValue;
  entity_id: string;
  entity_type: AuditEntityType;
  event_type: AuditEventType;
}

export interface AuditLogListFilters {
  entity_type?: AuditEntityType;
  event_type?: AuditEventType;
}

export class AuditRepository {
  constructor(private readonly db: PrismaClient = prisma) {}

  create(input: AuditLogCreateInput): Promise<AuditLog> {
    return this.db.auditLog.create({
      data: input,
    });
  }

  list(filters: AuditLogListFilters = {}): Promise<AuditLogWithActor[]> {
    return this.db.auditLog.findMany({
      where: filters,
      include: auditLogInclude,
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}
