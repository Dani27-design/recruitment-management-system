import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { VacancyFormInput } from '../../../types/vacancy';

interface VacancyFormProps {
  defaultValues?: VacancyFormInput;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit(input: VacancyFormInput): void | Promise<void>;
}

const emptyValues: VacancyFormInput = {
  position_name: '',
  department: '',
  hiring_needed: 1,
  status: 'ACTIVE',
};

export function VacancyForm({
  defaultValues = emptyValues,
  submitLabel,
  isSubmitting = false,
  onSubmit,
}: VacancyFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VacancyFormInput>({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="position_name">
          Position name
        </label>
        <input
          id="position_name"
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
          {...register('position_name', { required: 'Position name is required' })}
        />
        {errors.position_name ? (
          <p className="mt-1 text-sm text-red-600">{errors.position_name.message}</p>
        ) : null}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="department">
          Department
        </label>
        <input
          id="department"
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
          {...register('department', { required: 'Department is required' })}
        />
        {errors.department ? (
          <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
        ) : null}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="hiring_needed">
          Hiring needed
        </label>
        <input
          id="hiring_needed"
          type="number"
          min={1}
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
          {...register('hiring_needed', {
            required: 'Hiring needed is required',
            valueAsNumber: true,
            min: { value: 1, message: 'Hiring needed must be at least 1' },
          })}
        />
        {errors.hiring_needed ? (
          <p className="mt-1 text-sm text-red-600">{errors.hiring_needed.message}</p>
        ) : null}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="status">
          Status
        </label>
        <select
          id="status"
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
          {...register('status', { required: 'Status is required' })}
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
        {errors.status ? (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        ) : null}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? 'Saving' : submitLabel}
      </button>
    </form>
  );
}
