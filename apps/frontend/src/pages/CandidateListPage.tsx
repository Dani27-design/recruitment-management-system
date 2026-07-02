import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CandidateSearchBar } from '../features/candidates/components/CandidateSearchBar';
import { CandidateTable } from '../features/candidates/components/CandidateTable';
import { DeleteConfirmationDialog } from '../features/candidates/components/DeleteConfirmationDialog';
import { useAuth } from '../features/auth/AuthProvider';
import { AppLayout } from '../layouts/AppLayout';
import { deleteCandidate, listCandidates } from '../services/candidate-service';
import type { Candidate } from '../types/candidate';

export function CandidateListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(null);
  const search = searchParams.get('search') ?? '';
  const canManage = user?.role === 'ADMINISTRATOR';

  const candidatesQuery = useQuery({
    queryKey: ['candidates', search],
    queryFn: () => listCandidates({ search }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCandidate(id),
    onSuccess: async () => {
      setCandidateToDelete(null);
      await queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
  });

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="page-title">Candidates</h2>
          <p className="page-description">Manage applicant records.</p>
        </div>
        {canManage ? (
          <Link
            className="primary-action"
            to="/candidates/new"
          >
            Create Candidate
          </Link>
        ) : null}
      </div>

      <div className="mb-4">
        <CandidateSearchBar
          initialValue={search}
          onSearch={(value) => {
            setSearchParams(value ? { search: value } : {});
          }}
        />
      </div>

      {candidatesQuery.isLoading ? <p className="surface-panel p-4 text-sm text-slate-600">Loading candidates...</p> : null}
      {candidatesQuery.isError ? (
        <p className="alert-error">Unable to load candidates.</p>
      ) : null}
      {candidatesQuery.data ? (
        <CandidateTable
          candidates={candidatesQuery.data}
          canManage={canManage}
          onDelete={setCandidateToDelete}
        />
      ) : null}

      <DeleteConfirmationDialog
        candidate={candidateToDelete}
        isDeleting={deleteMutation.isPending}
        onCancel={() => setCandidateToDelete(null)}
        onConfirm={() => {
          if (candidateToDelete) {
            deleteMutation.mutate(candidateToDelete.id);
          }
        }}
      />
    </AppLayout>
  );
}
