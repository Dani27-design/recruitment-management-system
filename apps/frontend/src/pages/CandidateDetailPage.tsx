import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { getCandidate } from '../services/candidate-service';

export function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const candidateQuery = useQuery({
    queryKey: ['candidate', id],
    queryFn: () => getCandidate(id!),
    enabled: Boolean(id),
  });

  return (
    <AppLayout>
      <Link className="text-sm font-medium text-slate-700 underline" to="/candidates">
        Back to candidates
      </Link>
      {candidateQuery.isLoading ? <p className="mt-4 text-slate-600">Loading candidate...</p> : null}
      {candidateQuery.isError ? (
        <p className="mt-4 text-red-600">Unable to load candidate.</p>
      ) : null}
      {candidateQuery.data ? (
        <section className="mt-6 rounded border border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-semibold text-slate-950">
            {candidateQuery.data.full_name}
          </h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-slate-500">Email</dt>
              <dd className="mt-1 text-slate-950">{candidateQuery.data.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Phone</dt>
              <dd className="mt-1 text-slate-950">{candidateQuery.data.phone_number}</dd>
            </div>
          </dl>
        </section>
      ) : null}
    </AppLayout>
  );
}
