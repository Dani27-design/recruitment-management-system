import type { AuditEventType } from '../../../types/audit';

const EVENT_OPTIONS: { label: string; value: AuditEventType }[] = [
  { label: 'Create', value: 'CREATE' },
  { label: 'Update', value: 'UPDATE' },
  { label: 'Delete', value: 'DELETE' },
];

interface EventFilterProps {
  value: AuditEventType | '';
  onChange: (value: AuditEventType | '') => void;
}

export function EventFilter({ value, onChange }: EventFilterProps) {
  return (
    <label className="text-sm font-medium text-slate-700">
      Event
      <select
        className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-950"
        value={value}
        onChange={(event) => onChange(event.target.value as AuditEventType | '')}
      >
        <option value="">All events</option>
        {EVENT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
