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
    <label className="form-label">
      Entity
      <select
        className="form-input text-sm"
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
