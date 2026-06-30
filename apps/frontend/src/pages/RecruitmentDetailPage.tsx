import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { getRecruitment } from '../services/recruitment-service';

export function RecruitmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const recruitmentQuery = useQuery({
    queryKey: ['recruitment', id],
    queryFn: () => getRecruitment(id!),
    enabled: Boolean(id),
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
              <dt className="text-sm font-medium text-slate-500">Initial stage</dt>
              <dd className="mt-1 text-slate-950">
                {recruitmentQuery.data.stages[0]?.stage ?? '-'} /{' '}
                {recruitmentQuery.data.stages[0]?.status ?? '-'}
              </dd>
            </div>
          </dl>
        </section>
      ) : null}
    </AppLayout>
  );
}
