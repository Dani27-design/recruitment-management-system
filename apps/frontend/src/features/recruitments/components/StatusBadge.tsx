import type { RecruitmentStageStatus } from '../../../types/recruitment';

const statusClasses: Record<RecruitmentStageStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  PASSED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-red-100 text-red-800',
};

interface StatusBadgeProps {
  status: RecruitmentStageStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex rounded px-2 py-1 text-xs font-semibold ${statusClasses[status]}`}>
      {status}
    </span>
  );
}
