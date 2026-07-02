import { useState } from 'react';

interface CandidateSearchBarProps {
  initialValue?: string;
  onSearch(search: string): void;
}

export function CandidateSearchBar({ initialValue = '', onSearch }: CandidateSearchBarProps) {
  const [search, setSearch] = useState(initialValue);

  return (
    <form
      className="surface-panel flex gap-2 p-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(search.trim());
      }}
    >
      <label className="sr-only" htmlFor="candidate-search">
        Search candidates
      </label>
      <input
        id="candidate-search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search candidates"
        className="form-input mt-0"
      />
      <button type="submit" className="secondary-action">
        Search
      </button>
    </form>
  );
}
