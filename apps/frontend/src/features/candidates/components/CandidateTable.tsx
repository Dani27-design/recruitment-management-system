import { Link } from 'react-router-dom';
import type { Candidate } from '../../../types/candidate';

interface CandidateTableProps {
  candidates: Candidate[];
  canManage: boolean;
  onDelete(candidate: Candidate): void;
}

export function CandidateTable({ candidates, canManage, onDelete }: CandidateTableProps) {
  if (candidates.length === 0) {
    return <p className="rounded border border-slate-200 bg-white p-4 text-slate-600">No candidates found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
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
              <td className="px-4 py-3 text-sm text-slate-950">{candidate.full_name}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{candidate.email}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{candidate.phone_number}</td>
              <td className="space-x-3 px-4 py-3 text-sm">
                <Link className="font-medium text-slate-900 underline" to={`/candidates/${candidate.id}`}>
                  View
                </Link>
                {canManage ? (
                  <>
                    <Link
                      className="font-medium text-slate-900 underline"
                      to={`/candidates/${candidate.id}/edit`}
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="font-medium text-red-700 underline"
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
