import type { Candidate } from '../../../types/candidate';

interface CandidateSelectorProps {
  candidates: Candidate[];
  value: string;
  onChange(value: string): void;
}

export function CandidateSelector({ candidates, value, onChange }: CandidateSelectorProps) {
  return (
    <div>
      <label className="form-label" htmlFor="candidate_id">
        Candidate
      </label>
      <select
        id="candidate_id"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="form-input"
      >
        <option value="">Select candidate</option>
        {candidates.map((candidate) => (
          <option key={candidate.id} value={candidate.id}>
            {candidate.full_name}
          </option>
        ))}
      </select>
    </div>
  );
}
