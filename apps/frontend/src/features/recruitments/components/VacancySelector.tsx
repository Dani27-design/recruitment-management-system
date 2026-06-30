import type { Vacancy } from '../../../types/vacancy';

interface VacancySelectorProps {
  vacancies: Vacancy[];
  value: string;
  onChange(value: string): void;
}

export function VacancySelector({ vacancies, value, onChange }: VacancySelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700" htmlFor="vacancy_id">
        Vacancy
      </label>
      <select
        id="vacancy_id"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
      >
        <option value="">Select vacancy</option>
        {vacancies.map((vacancy) => (
          <option key={vacancy.id} value={vacancy.id}>
            {vacancy.position_name}
          </option>
        ))}
      </select>
    </div>
  );
}
