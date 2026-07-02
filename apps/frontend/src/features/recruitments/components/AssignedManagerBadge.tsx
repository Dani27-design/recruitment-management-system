import type { RecruitmentStage } from '../../../types/recruitment';

interface AssignedManagerBadgeProps {
  manager: RecruitmentStage['assigned_user'];
}

export function AssignedManagerBadge({ manager }: AssignedManagerBadgeProps) {
  return (
    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
      {manager?.email ?? 'Unassigned'}
    </span>
  );
}
