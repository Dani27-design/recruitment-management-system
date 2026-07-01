import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthProvider';
import { RecruitmentTimeline } from '../features/recruitments/components/RecruitmentTimeline';
import { AppLayout } from '../layouts/AppLayout';
import { getRecruitment } from '../services/recruitment-service';
import {
  assignRecruitmentStageManager,
  listRecruitmentStages,
  updateRecruitmentStage,
} from '../services/recruitment-stage-service';
import { listManagers } from '../services/user-service';
import type { RecruitmentStageUpdateInput } from '../types/recruitment';

interface StageMutationInput {
  stageId: string;
  input: RecruitmentStageUpdateInput;
}

export function RecruitmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const recruitmentQuery = useQuery({
    queryKey: ['recruitment', id],
    queryFn: () => getRecruitment(id!),
    enabled: Boolean(id),
  });
  const stagesQuery = useQuery({
    queryKey: ['recruitment-stages', id],
    queryFn: () => listRecruitmentStages(id!),
    enabled: Boolean(id),
  });
  const managersQuery = useQuery({
    queryKey: ['managers'],
    queryFn: listManagers,
    enabled: user?.role === 'ADMINISTRATOR',
  });
  const updateStageMutation = useMutation({
    mutationFn: ({ stageId, input }: StageMutationInput) => updateRecruitmentStage(stageId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruitment', id] });
      queryClient.invalidateQueries({ queryKey: ['recruitment-stages', id] });
    },
  });
  const assignStageMutation = useMutation({
    mutationFn: ({ stageId, managerId }: { stageId: string; managerId: string }) =>
      assignRecruitmentStageManager(stageId, managerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruitment', id] });
      queryClient.invalidateQueries({ queryKey: ['recruitment-stages', id] });
    },
  });

  return (
    <AppLayout>
      <Link className="text-sm font-medium text-slate-700 underline" to="/recruitments">
        Back to recruitments
      </Link>
      {recruitmentQuery.isLoading ? <p className="mt-4 text-slate-600">Loading recruitment...</p> : null}
      {recruitmentQuery.isError ? (
        <p className="mt-4 text-red-600">Unable to load recruitment.</p>
      ) : null}
      {recruitmentQuery.data ? (
        <section className="mt-6 rounded border border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-semibold text-slate-950">
            {recruitmentQuery.data.candidate.full_name}
          </h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-slate-500">Vacancy</dt>
              <dd className="mt-1 text-slate-950">
                {recruitmentQuery.data.vacancy.position_name}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Current stage</dt>
              <dd className="mt-1 text-slate-950">
                {recruitmentQuery.data.stages.find((stage) => stage.status === 'PENDING')
                  ?.stage ??
                  recruitmentQuery.data.stages.at(-1)?.stage ??
                  '-'}
              </dd>
            </div>
          </dl>
          {stagesQuery.isLoading ? <p className="mt-4 text-slate-600">Loading timeline...</p> : null}
          {stagesQuery.isError || updateStageMutation.isError || assignStageMutation.isError ? (
            <p className="mt-4 text-red-600">Unable to update recruitment timeline.</p>
          ) : null}
          {stagesQuery.data ? (
            <RecruitmentTimeline
              stages={stagesQuery.data}
              currentUser={user}
              managers={managersQuery.data ?? []}
              isAssigning={assignStageMutation.isPending}
              isUpdating={updateStageMutation.isPending}
              onAssign={(stageId, managerId) => assignStageMutation.mutate({ stageId, managerId })}
              onUpdate={(stageId, input) => updateStageMutation.mutate({ stageId, input })}
            />
          ) : null}
        </section>
      ) : null}
    </AppLayout>
  );
}
