import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthProvider';
import { DocumentTable } from '../features/recruitments/components/DocumentTable';
import { RecruitmentTimeline } from '../features/recruitments/components/RecruitmentTimeline';
import { UploadDialog } from '../features/recruitments/components/UploadDialog';
import { AppLayout } from '../layouts/AppLayout';
import {
  createRecruitmentDocumentDownloadUrl,
  deleteRecruitmentDocument,
  listRecruitmentDocuments,
  uploadRecruitmentDocument,
} from '../services/recruitment-document-service';
import { getRecruitment } from '../services/recruitment-service';
import {
  assignRecruitmentStageManager,
  listRecruitmentStages,
  updateRecruitmentStage,
} from '../services/recruitment-stage-service';
import { listManagers } from '../services/user-service';
import type { RecruitmentDocumentUploadInput } from '../types/recruitment-document';
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
  const documentsQuery = useQuery({
    queryKey: ['recruitment-documents', id],
    queryFn: () => listRecruitmentDocuments(id!),
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
  const uploadDocumentMutation = useMutation({
    mutationFn: (input: RecruitmentDocumentUploadInput) => uploadRecruitmentDocument(id!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruitment-documents', id] });
    },
  });
  const downloadDocumentMutation = useMutation({
    mutationFn: (documentId: string) => createRecruitmentDocumentDownloadUrl(documentId),
    onSuccess: (url) => {
      window.open(url, '_blank', 'noopener,noreferrer');
    },
  });
  const deleteDocumentMutation = useMutation({
    mutationFn: (documentId: string) => deleteRecruitmentDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruitment-documents', id] });
    },
  });
  const canUploadDocuments = user?.role === 'ADMINISTRATOR';
  const canDeleteDocuments = user?.role === 'ADMINISTRATOR';

  return (
    <AppLayout>
      <Link className="text-action" to="/recruitments">
        Back to recruitments
      </Link>
      {recruitmentQuery.isLoading ? <p className="surface-panel mt-4 p-4 text-sm text-slate-600">Loading recruitment...</p> : null}
      {recruitmentQuery.isError ? (
        <p className="alert-error mt-4">Unable to load recruitment.</p>
      ) : null}
      {recruitmentQuery.data ? (
        <section className="mt-6">
          <div className="section-card">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="page-title">{recruitmentQuery.data.candidate.full_name}</h2>
                <p className="page-description">{recruitmentQuery.data.vacancy.position_name}</p>
              </div>
              <span className="inline-flex w-fit rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 ring-1 ring-teal-200">
                {recruitmentQuery.data.stages.find((stage) => stage.status === 'PENDING')?.status ??
                  recruitmentQuery.data.stages.at(-1)?.status ??
                  '-'}
              </span>
            </div>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-4">
              <dt className="text-sm font-medium text-slate-500">Vacancy</dt>
              <dd className="mt-1 font-semibold text-slate-950">
                {recruitmentQuery.data.vacancy.position_name}
              </dd>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <dt className="text-sm font-medium text-slate-500">Current stage</dt>
              <dd className="mt-1 font-semibold text-slate-950">
                {recruitmentQuery.data.stages.find((stage) => stage.status === 'PENDING')
                  ?.stage ??
                  recruitmentQuery.data.stages.at(-1)?.stage ??
                  '-'}
              </dd>
            </div>
          </dl>
          </div>
          {stagesQuery.isLoading ? <p className="surface-panel mt-4 p-4 text-sm text-slate-600">Loading timeline...</p> : null}
          {stagesQuery.isError || updateStageMutation.isError || assignStageMutation.isError ? (
            <p className="alert-error mt-4">Unable to update recruitment timeline.</p>
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
          <section className="section-card mt-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-xl font-semibold text-slate-950">Recruitment Documents</h3>
              <p className="text-sm font-medium text-slate-500">
                {documentsQuery.data?.length ?? 0} documents
              </p>
            </div>
            {canUploadDocuments ? (
              <UploadDialog
                disabled={uploadDocumentMutation.isPending}
                onUpload={(input) => uploadDocumentMutation.mutate(input)}
              />
            ) : null}
            {documentsQuery.isLoading ? (
              <p className="mt-4 text-sm text-slate-600">Loading documents...</p>
            ) : null}
            {documentsQuery.isError ||
            uploadDocumentMutation.isError ||
            downloadDocumentMutation.isError ||
            deleteDocumentMutation.isError ? (
              <p className="alert-error mt-4">Unable to update recruitment documents.</p>
            ) : null}
            {documentsQuery.data ? (
              <DocumentTable
                canDelete={canDeleteDocuments}
                documents={documentsQuery.data}
                isDeleting={deleteDocumentMutation.isPending}
                isDownloading={downloadDocumentMutation.isPending}
                onDelete={(documentId) => deleteDocumentMutation.mutate(documentId)}
                onDownload={(documentId) => downloadDocumentMutation.mutate(documentId)}
              />
            ) : null}
          </section>
        </section>
      ) : null}
    </AppLayout>
  );
}
