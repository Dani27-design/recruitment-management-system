import type { RecruitmentStage } from '../../../types/recruitment';

interface AssignedManagerBadgeProps {
  manager: RecruitmentStage['assigned_user'];
}

export function AssignedManagerBadge({ manager }: AssignedManagerBadgeProps) {
  return (
    <span className="inline-flex rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
      {manager?.email ?? 'Unassigned'}
    </span>
  );
}
