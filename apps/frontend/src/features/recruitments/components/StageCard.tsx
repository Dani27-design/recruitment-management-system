import { useState } from 'react';
import type { RecruitmentStage, RecruitmentStageUpdateInput } from '../../../types/recruitment';
import { StageNotes } from './StageNotes';
import { StatusBadge } from './StatusBadge';

interface StageCardProps {
  stage: RecruitmentStage;
  isUpdating?: boolean;
  onUpdate: (stageId: string, input: RecruitmentStageUpdateInput) => void;
}

export function StageCard({ stage, isUpdating, onUpdate }: StageCardProps) {
  const [notes, setNotes] = useState(stage.notes ?? '');
  const isActive = stage.status === 'PENDING';

  return (
    <article className="rounded border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-950">{stage.stage}</h3>
          {stage.completed_at ? (
            <p className="mt-1 text-xs text-slate-500">Completed {stage.completed_at}</p>
          ) : null}
        </div>
        <StatusBadge status={stage.status} />
      </div>

      <StageNotes
        id={`stage-notes-${stage.id}`}
        notes={stage.notes}
        value={notes}
        disabled={!isActive}
        onChange={setNotes}
        onSave={() => onUpdate(stage.id, { notes })}
      />

      {isActive ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className="rounded bg-emerald-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
            disabled={isUpdating}
            type="button"
            onClick={() => onUpdate(stage.id, { status: 'PASSED', notes })}
          >
            Mark passed
          </button>
          <button
            className="rounded bg-red-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
            disabled={isUpdating}
            type="button"
            onClick={() => onUpdate(stage.id, { status: 'REJECTED', notes })}
          >
            Mark rejected
          </button>
        </div>
      ) : null}
    </article>
  );
}
