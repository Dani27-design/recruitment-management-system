import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { AuditTable } from '../features/audit/components/AuditTable';
import { EntityFilter } from '../features/audit/components/EntityFilter';
import { EventFilter } from '../features/audit/components/EventFilter';
import { AppLayout } from '../layouts/AppLayout';
import { listAuditLogs } from '../services/audit-service';
import type { AuditEntityType, AuditEventType } from '../types/audit';

export function AuditLogPage() {
  const [entityType, setEntityType] = useState<AuditEntityType | ''>('');
  const [eventType, setEventType] = useState<AuditEventType | ''>('');
  const filters = useMemo(
    () => ({
      ...(entityType ? { entity_type: entityType } : {}),
      ...(eventType ? { event_type: eventType } : {}),
    }),
    [entityType, eventType],
  );
  const auditLogsQuery = useQuery({
    queryKey: ['audit-logs', filters],
    queryFn: () => listAuditLogs(filters),
  });

  return (
    <AppLayout>
      <section>
        <div className="mb-6">
          <h2 className="page-title">Audit Logs</h2>
          <p className="page-description">Trace successful system data modifications.</p>
        </div>

        <div className="surface-panel mb-4 grid gap-3 p-4 sm:grid-cols-2">
          <EntityFilter value={entityType} onChange={setEntityType} />
          <EventFilter value={eventType} onChange={setEventType} />
        </div>

        {auditLogsQuery.isLoading ? (
          <p className="surface-panel p-4 text-sm text-slate-600">Loading audit logs...</p>
        ) : null}
        {auditLogsQuery.isError ? (
          <p className="alert-error">Unable to load audit logs.</p>
        ) : null}
        {auditLogsQuery.data ? <AuditTable auditLogs={auditLogsQuery.data} /> : null}
      </section>
    </AppLayout>
  );
}
