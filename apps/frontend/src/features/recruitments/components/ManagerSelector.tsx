import type { AuthUser } from '../../../types/auth';

interface ManagerSelectorProps {
  managers: AuthUser[];
  value: string;
  disabled?: boolean;
  onChange: (managerId: string) => void;
}

export function ManagerSelector({ managers, value, disabled, onChange }: ManagerSelectorProps) {
  return (
    <label className="form-label">
      Assigned manager
      <select
        className="form-input text-sm"
        disabled={disabled}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Select manager</option>
        {managers.map((manager) => (
          <option key={manager.id} value={manager.id}>
            {manager.email}
          </option>
        ))}
      </select>
    </label>
  );
}
