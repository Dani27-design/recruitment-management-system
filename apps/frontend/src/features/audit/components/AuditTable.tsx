import type { AuditLog } from '../../../types/audit';

interface AuditTableProps {
  auditLogs: AuditLog[];
}

export function AuditTable({ auditLogs }: AuditTableProps) {
  if (auditLogs.length === 0) {
    return <p className="empty-state">No audit logs found.</p>;
  }

  return (
    <div className="table-shell overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Timestamp</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Actor</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Entity</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Event</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Changed Fields</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {auditLogs.map((auditLog) => (
            <tr key={auditLog.id}>
              <td className="whitespace-nowrap">
                {new Date(auditLog.created_at).toLocaleString()}
              </td>
              <td>
                {auditLog.actor?.email ?? auditLog.actor_id}
              </td>
              <td>
                <span className="font-medium text-slate-950">{auditLog.entity_type}</span>
                <span className="block text-xs text-slate-500">{auditLog.entity_id}</span>
              </td>
              <td>
                <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  {auditLog.event_type}
                </span>
              </td>
              <td>
                {auditLog.changes.changed_fields.length > 0
                  ? auditLog.changes.changed_fields.join(', ')
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
