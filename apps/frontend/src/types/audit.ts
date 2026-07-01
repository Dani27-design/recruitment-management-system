import type { UserRole } from './auth';

export type AuditEventType = 'CREATE' | 'UPDATE' | 'DELETE';

export type AuditEntityType =
  | 'CANDIDATE'
  | 'VACANCY'
  | 'RECRUITMENT'
  | 'RECRUITMENT_STAGE'
  | 'RECRUITMENT_DOCUMENT';

export interface AuditChanges {
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  changed_fields: string[];
}

export interface AuditLog {
  id: string;
  entity_type: AuditEntityType;
  entity_id: string;
  event_type: AuditEventType;
  actor_id: string;
  changes: AuditChanges;
  created_at: string;
  actor?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export interface AuditLogFilters {
  entity_type?: AuditEntityType;
  event_type?: AuditEventType;
}
