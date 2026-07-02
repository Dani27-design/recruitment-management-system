import type { RecruitmentStageStatus } from '../../../types/recruitment';

const statusClasses: Record<RecruitmentStageStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200',
  PASSED: 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200',
  REJECTED: 'bg-red-50 text-red-800 ring-1 ring-red-200',
};

interface StatusBadgeProps {
  status: RecruitmentStageStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[status]}`}>
      {status}
    </span>
  );
}
