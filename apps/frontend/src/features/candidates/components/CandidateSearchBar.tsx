import { useState } from 'react';

interface CandidateSearchBarProps {
  initialValue?: string;
  onSearch(search: string): void;
}

export function CandidateSearchBar({ initialValue = '', onSearch }: CandidateSearchBarProps) {
  const [search, setSearch] = useState(initialValue);

  return (
    <form
      className="flex gap-2"
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
        className="w-full rounded border border-slate-300 px-3 py-2"
      />
      <button
        type="submit"
        className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      >
        Search
      </button>
    </form>
  );
}
