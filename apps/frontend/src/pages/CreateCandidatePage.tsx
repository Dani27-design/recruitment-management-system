import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { CandidateForm } from '../features/candidates/components/CandidateForm';
import { AppLayout } from '../layouts/AppLayout';
import { createCandidate } from '../services/candidate-service';
import type { CandidateFormInput } from '../types/candidate';

export function CreateCandidatePage() {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (input: CandidateFormInput) => createCandidate(input),
    onSuccess: (candidate) => {
      navigate(`/candidates/${candidate.id}`);
    },
  });

  return (
    <AppLayout>
      <section className="max-w-2xl">
        <h2 className="mb-6 text-2xl font-semibold text-slate-950">Create Candidate</h2>
        {mutation.isError ? <p className="mb-4 text-red-600">Unable to create candidate.</p> : null}
        <CandidateForm
          submitLabel="Create Candidate"
          isSubmitting={mutation.isPending}
          onSubmit={(input) => mutation.mutate(input)}
        />
      </section>
    </AppLayout>
  );
}
