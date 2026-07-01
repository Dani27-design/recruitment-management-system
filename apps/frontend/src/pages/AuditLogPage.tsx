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
          <h2 className="text-2xl font-semibold text-slate-950">Audit Logs</h2>
          <p className="mt-1 text-sm text-slate-600">Trace successful system data modifications.</p>
        </div>

        <div className="mb-4 grid gap-3 rounded border border-slate-200 bg-white p-4 sm:grid-cols-2">
          <EntityFilter value={entityType} onChange={setEntityType} />
          <EventFilter value={eventType} onChange={setEventType} />
        </div>

        {auditLogsQuery.isLoading ? (
          <p className="text-slate-600">Loading audit logs...</p>
        ) : null}
        {auditLogsQuery.isError ? (
          <p className="text-red-600">Unable to load audit logs.</p>
        ) : null}
        {auditLogsQuery.data ? <AuditTable auditLogs={auditLogsQuery.data} /> : null}
      </section>
    </AppLayout>
  );
}
