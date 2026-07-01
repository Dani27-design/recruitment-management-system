import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthProvider';
import { AppLayout } from '../layouts/AppLayout';
import { listRecruitments } from '../services/recruitment-service';

export function RecruitmentListPage() {
  const { user } = useAuth();
  const canCreate = user?.role === 'ADMINISTRATOR';
  const recruitmentsQuery = useQuery({
    queryKey: ['recruitments'],
    queryFn: listRecruitments,
  });

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Recruitments</h2>
          <p className="mt-1 text-sm text-slate-600">Track candidate applications to vacancies.</p>
        </div>
        {canCreate ? (
          <Link
            className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            to="/recruitments/new"
          >
            Create Recruitment
          </Link>
        ) : null}
      </div>

      {recruitmentsQuery.isLoading ? <p className="text-slate-600">Loading recruitments...</p> : null}
      {recruitmentsQuery.isError ? (
        <p className="text-red-600">Unable to load recruitments.</p>
      ) : null}
      {recruitmentsQuery.data && recruitmentsQuery.data.length === 0 ? (
        <p className="rounded border border-slate-200 bg-white p-4 text-slate-600">No recruitments found.</p>
      ) : null}
      {recruitmentsQuery.data && recruitmentsQuery.data.length > 0 ? (
        <div className="overflow-x-auto rounded border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Candidate</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Vacancy</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Current stage</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recruitmentsQuery.data.map((recruitment) => (
                <tr key={recruitment.id}>
                  <td className="px-4 py-3 text-sm text-slate-950">
                    {recruitment.candidate.full_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {recruitment.vacancy.position_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {recruitment.stages.find((stage) => stage.status === 'PENDING')?.stage ??
                      recruitment.stages.at(-1)?.stage ??
                      '-'}{' '}
                    /{' '}
                    {recruitment.stages.find((stage) => stage.status === 'PENDING')?.status ??
                      recruitment.stages.at(-1)?.status ??
                      '-'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link className="font-medium text-slate-900 underline" to={`/recruitments/${recruitment.id}`}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </AppLayout>
  );
}
