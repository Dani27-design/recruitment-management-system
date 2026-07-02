import { Link } from 'react-router-dom';
import type { Vacancy } from '../../../types/vacancy';

interface VacancyTableProps {
  vacancies: Vacancy[];
  canManage: boolean;
  onDelete(vacancy: Vacancy): void;
}

export function VacancyTable({ vacancies, canManage, onDelete }: VacancyTableProps) {
  if (vacancies.length === 0) {
    return <p className="empty-state">No vacancies found.</p>;
  }

  return (
    <div className="table-shell overflow-x-auto">
      <table className="data-table">
        <thead>
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
              <td className="font-semibold text-slate-950">{vacancy.position_name}</td>
              <td>{vacancy.department}</td>
              <td>{vacancy.hiring_needed}</td>
              <td>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                    vacancy.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {vacancy.status}
                </span>
              </td>
              {canManage ? (
                <td className="space-x-3 whitespace-nowrap">
                  <Link className="text-action" to={`/vacancies/${vacancy.id}/edit`}>
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="danger-text-action"
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
