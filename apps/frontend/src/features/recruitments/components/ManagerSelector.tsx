import type { AuthUser } from '../../../types/auth';

interface ManagerSelectorProps {
  managers: AuthUser[];
  value: string;
  disabled?: boolean;
  onChange: (managerId: string) => void;
}

export function ManagerSelector({ managers, value, disabled, onChange }: ManagerSelectorProps) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      Assigned manager
      <select
        className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-950"
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
