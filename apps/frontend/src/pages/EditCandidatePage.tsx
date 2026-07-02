import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { CandidateForm } from '../features/candidates/components/CandidateForm';
import { AppLayout } from '../layouts/AppLayout';
import { getCandidate, updateCandidate } from '../services/candidate-service';
import type { CandidateFormInput } from '../types/candidate';

export function EditCandidatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const candidateQuery = useQuery({
    queryKey: ['candidate', id],
    queryFn: () => getCandidate(id!),
    enabled: Boolean(id),
  });
  const mutation = useMutation({
    mutationFn: (input: CandidateFormInput) => updateCandidate(id!, input),
    onSuccess: (candidate) => {
      navigate(`/candidates/${candidate.id}`);
    },
  });

  return (
    <AppLayout>
      <section className="max-w-2xl">
        <h2 className="page-title mb-6">Edit Candidate</h2>
        {candidateQuery.isLoading ? <p className="surface-panel p-4 text-sm text-slate-600">Loading candidate...</p> : null}
        {candidateQuery.isError || mutation.isError ? (
          <p className="alert-error mb-4">Unable to update candidate.</p>
        ) : null}
        {candidateQuery.data ? (
          <CandidateForm
            defaultValues={{
              full_name: candidateQuery.data.full_name,
              email: candidateQuery.data.email,
              phone_number: candidateQuery.data.phone_number,
            }}
            submitLabel="Save Candidate"
            isSubmitting={mutation.isPending}
            onSubmit={(input) => mutation.mutate(input)}
          />
        ) : null}
      </section>
    </AppLayout>
  );
}
