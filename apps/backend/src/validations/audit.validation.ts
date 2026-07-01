import { z } from 'zod';
import { AUDIT_ENTITY_TYPES, AUDIT_EVENT_TYPES } from '../constants/audit';

export const auditLogListQuerySchema = z.object({
  query: z.object({
    entity_type: z.nativeEnum(AUDIT_ENTITY_TYPES).optional(),
    event_type: z.nativeEnum(AUDIT_EVENT_TYPES).optional(),
  }),
});

export type AuditLogListQuery = z.infer<typeof auditLogListQuerySchema>['query'];
