import type { AuditEntityType } from '../../../types/audit';

const ENTITY_OPTIONS: { label: string; value: AuditEntityType }[] = [
  { label: 'Candidate', value: 'CANDIDATE' },
  { label: 'Vacancy', value: 'VACANCY' },
  { label: 'Recruitment', value: 'RECRUITMENT' },
  { label: 'Recruitment Stage', value: 'RECRUITMENT_STAGE' },
  { label: 'Recruitment Document', value: 'RECRUITMENT_DOCUMENT' },
];

interface EntityFilterProps {
  value: AuditEntityType | '';
  onChange: (value: AuditEntityType | '') => void;
}

export function EntityFilter({ value, onChange }: EntityFilterProps) {
  return (
    <label className="text-sm font-medium text-slate-700">
      Entity
      <select
        className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-950"
        value={value}
        onChange={(event) => onChange(event.target.value as AuditEntityType | '')}
      >
        <option value="">All entities</option>
        {ENTITY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
