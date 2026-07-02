import { Link } from 'react-router-dom';
import type { Candidate } from '../../../types/candidate';

interface CandidateTableProps {
  candidates: Candidate[];
  canManage: boolean;
  onDelete(candidate: Candidate): void;
}

export function CandidateTable({ candidates, canManage, onDelete }: CandidateTableProps) {
  if (candidates.length === 0) {
    return <p className="empty-state">No candidates found.</p>;
  }

  return (
    <div className="table-shell overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Name</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Email</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Phone</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {candidates.map((candidate) => (
            <tr key={candidate.id}>
              <td className="font-semibold text-slate-950">{candidate.full_name}</td>
              <td>{candidate.email}</td>
              <td>{candidate.phone_number}</td>
              <td className="space-x-3 whitespace-nowrap">
                <Link className="text-action" to={`/candidates/${candidate.id}`}>
                  View
                </Link>
                {canManage ? (
                  <>
                    <Link
                      className="text-action"
                      to={`/candidates/${candidate.id}/edit`}
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="danger-text-action"
                      onClick={() => onDelete(candidate)}
                    >
                      Delete
                    </button>
                  </>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
