import { useState } from 'react';
import type { AuthUser } from '../../../types/auth';
import type { RecruitmentStage, RecruitmentStageUpdateInput } from '../../../types/recruitment';
import { AssignedManagerBadge } from './AssignedManagerBadge';
import { ManagerSelector } from './ManagerSelector';
import { StageNotes } from './StageNotes';
import { StatusBadge } from './StatusBadge';

interface StageCardProps {
  stage: RecruitmentStage;
  managers?: AuthUser[];
  canAssign?: boolean;
  canUpdate?: boolean;
  isAssigning?: boolean;
  isUpdating?: boolean;
  onAssign?: (stageId: string, managerId: string) => void;
  onUpdate: (stageId: string, input: RecruitmentStageUpdateInput) => void;
}

export function StageCard({
  stage,
  managers = [],
  canAssign = false,
  canUpdate = false,
  isAssigning,
  isUpdating,
  onAssign,
  onUpdate,
}: StageCardProps) {
  const [notes, setNotes] = useState(stage.notes ?? '');
  const [selectedManagerId, setSelectedManagerId] = useState(stage.assigned_user_id ?? '');
  const isActive = stage.status === 'PENDING';
  const canModifyActiveStage = isActive && canUpdate;

  return (
    <article className={`surface-panel p-5 ${isActive ? 'border-teal-200 ring-2 ring-teal-100' : ''}`}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-950">{stage.stage}</h3>
          {stage.completed_at ? (
            <p className="mt-1 text-xs text-slate-500">Completed {stage.completed_at}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <AssignedManagerBadge manager={stage.assigned_user ?? null} />
          <StatusBadge status={stage.status} />
        </div>
      </div>

      {canAssign ? (
        <div className="mt-4 grid gap-2 rounded-lg bg-slate-50 p-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <ManagerSelector
            managers={managers}
            value={selectedManagerId}
            disabled={isAssigning}
            onChange={setSelectedManagerId}
          />
          <button
            className="primary-action"
            disabled={isAssigning || !selectedManagerId}
            type="button"
            onClick={() => {
              if (selectedManagerId) {
                onAssign?.(stage.id, selectedManagerId);
              }
            }}
          >
            Assign
          </button>
        </div>
      ) : null}

      <StageNotes
        id={`stage-notes-${stage.id}`}
        notes={stage.notes}
        value={notes}
        disabled={!canModifyActiveStage}
        onChange={setNotes}
        onSave={() => onUpdate(stage.id, { notes })}
      />

      {canModifyActiveStage ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className="primary-action bg-emerald-700 hover:bg-emerald-800"
            disabled={isUpdating}
            type="button"
            onClick={() => onUpdate(stage.id, { status: 'PASSED', notes })}
          >
            Mark passed
          </button>
          <button
            className="danger-action"
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
