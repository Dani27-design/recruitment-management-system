import type { AuditLog } from '../../../types/audit';

interface AuditTableProps {
  auditLogs: AuditLog[];
}

export function AuditTable({ auditLogs }: AuditTableProps) {
  if (auditLogs.length === 0) {
    return <p className="rounded border border-slate-200 bg-white p-4 text-slate-600">No audit logs found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
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
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                {new Date(auditLog.created_at).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {auditLog.actor?.email ?? auditLog.actor_id}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                <span className="font-medium text-slate-950">{auditLog.entity_type}</span>
                <span className="block text-xs text-slate-500">{auditLog.entity_id}</span>
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">{auditLog.event_type}</td>
              <td className="px-4 py-3 text-sm text-slate-700">
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
