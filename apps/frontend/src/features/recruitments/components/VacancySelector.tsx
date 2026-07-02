import type { Vacancy } from '../../../types/vacancy';

interface VacancySelectorProps {
  vacancies: Vacancy[];
  value: string;
  onChange(value: string): void;
}

export function VacancySelector({ vacancies, value, onChange }: VacancySelectorProps) {
  return (
    <div>
      <label className="form-label" htmlFor="vacancy_id">
        Vacancy
      </label>
      <select
        id="vacancy_id"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="form-input"
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
