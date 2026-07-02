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
    <label className="form-label">
      Event
      <select
        className="form-input text-sm"
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
