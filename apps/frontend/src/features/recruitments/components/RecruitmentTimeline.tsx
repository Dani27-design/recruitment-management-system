import type { RecruitmentStage, RecruitmentStageUpdateInput } from '../../../types/recruitment';
import { StageCard } from './StageCard';

interface RecruitmentTimelineProps {
  stages: RecruitmentStage[];
  isUpdating?: boolean;
  onUpdate: (stageId: string, input: RecruitmentStageUpdateInput) => void;
}

export function RecruitmentTimeline({ stages, isUpdating, onUpdate }: RecruitmentTimelineProps) {
  return (
    <section className="mt-6">
      <h3 className="text-lg font-semibold text-slate-950">Recruitment Timeline</h3>
      <div className="mt-3 grid gap-3">
        {stages.map((stage) => (
          <StageCard
            key={stage.id}
            stage={stage}
            isUpdating={isUpdating}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </section>
  );
}
