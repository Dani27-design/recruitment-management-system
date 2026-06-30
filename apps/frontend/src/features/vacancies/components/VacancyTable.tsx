import { Link } from 'react-router-dom';
import type { Vacancy } from '../../../types/vacancy';

interface VacancyTableProps {
  vacancies: Vacancy[];
  canManage: boolean;
  onDelete(vacancy: Vacancy): void;
}

export function VacancyTable({ vacancies, canManage, onDelete }: VacancyTableProps) {
  if (vacancies.length === 0) {
    return <p className="rounded border border-slate-200 bg-white p-4 text-slate-600">No vacancies found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Position</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Department</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Hiring needed</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
            {canManage ? (
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
            ) : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {vacancies.map((vacancy) => (
            <tr key={vacancy.id}>
              <td className="px-4 py-3 text-sm text-slate-950">{vacancy.position_name}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{vacancy.department}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{vacancy.hiring_needed}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{vacancy.status}</td>
              {canManage ? (
                <td className="space-x-3 px-4 py-3 text-sm">
                  <Link className="font-medium text-slate-900 underline" to={`/vacancies/${vacancy.id}/edit`}>
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="font-medium text-red-700 underline"
                    onClick={() => onDelete(vacancy)}
                  >
                    Delete
                  </button>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
