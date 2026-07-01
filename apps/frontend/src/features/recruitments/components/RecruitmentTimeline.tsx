import type { AuthUser } from '../../../types/auth';
import type { RecruitmentStage, RecruitmentStageUpdateInput } from '../../../types/recruitment';
import { StageCard } from './StageCard';

interface RecruitmentTimelineProps {
  stages: RecruitmentStage[];
  currentUser: AuthUser | null;
  managers?: AuthUser[];
  isAssigning?: boolean;
  isUpdating?: boolean;
  onAssign?: (stageId: string, managerId: string) => void;
  onUpdate: (stageId: string, input: RecruitmentStageUpdateInput) => void;
}

export function RecruitmentTimeline({
  stages,
  currentUser,
  managers = [],
  isAssigning,
  isUpdating,
  onAssign,
  onUpdate,
}: RecruitmentTimelineProps) {
  return (
    <section className="mt-6">
      <h3 className="text-lg font-semibold text-slate-950">Recruitment Timeline</h3>
      <div className="mt-3 grid gap-3">
        {stages.map((stage) => (
          <StageCard
            key={stage.id}
            stage={stage}
            managers={managers}
            canAssign={currentUser?.role === 'ADMINISTRATOR'}
            canUpdate={canUpdateStage(stage, currentUser)}
            isAssigning={isAssigning}
            isUpdating={isUpdating}
            onAssign={onAssign}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </section>
  );
}

function canUpdateStage(stage: RecruitmentStage, currentUser: AuthUser | null) {
  if (!currentUser) {
    return false;
  }

  if (currentUser.role === 'ADMINISTRATOR') {
    return true;
  }

  return stage.assigned_user_id === currentUser.id;
}
