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
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="page-title">Recruitments</h2>
          <p className="page-description">Track candidate applications to vacancies.</p>
        </div>
        {canCreate ? (
          <Link
            className="primary-action"
            to="/recruitments/new"
          >
            Create Recruitment
          </Link>
        ) : null}
      </div>

      {recruitmentsQuery.isLoading ? <p className="surface-panel p-4 text-sm text-slate-600">Loading recruitments...</p> : null}
      {recruitmentsQuery.isError ? (
        <p className="alert-error">Unable to load recruitments.</p>
      ) : null}
      {recruitmentsQuery.data && recruitmentsQuery.data.length === 0 ? (
        <p className="empty-state">No recruitments found.</p>
      ) : null}
      {recruitmentsQuery.data && recruitmentsQuery.data.length > 0 ? (
        <div className="table-shell overflow-x-auto">
          <table className="data-table">
            <thead>
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
                  <td className="font-semibold text-slate-950">
                    {recruitment.candidate.full_name}
                  </td>
                  <td>
                    {recruitment.vacancy.position_name}
                  </td>
                  <td>
                    <span className="inline-flex rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800">
                      {recruitment.stages.find((stage) => stage.status === 'PENDING')?.stage ??
                        recruitment.stages.at(-1)?.stage ??
                        '-'}
                    </span>
                    <span className="ml-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {recruitment.stages.find((stage) => stage.status === 'PENDING')?.status ??
                        recruitment.stages.at(-1)?.status ??
                        '-'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap">
                    <Link className="text-action" to={`/recruitments/${recruitment.id}`}>
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
