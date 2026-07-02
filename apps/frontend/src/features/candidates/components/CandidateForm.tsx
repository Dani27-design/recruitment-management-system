import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { CandidateFormInput } from '../../../types/candidate';

interface CandidateFormProps {
  defaultValues?: CandidateFormInput;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit(input: CandidateFormInput): void | Promise<void>;
}

const emptyValues: CandidateFormInput = {
  full_name: '',
  email: '',
  phone_number: '',
};

export function CandidateForm({
  defaultValues = emptyValues,
  submitLabel,
  isSubmitting = false,
  onSubmit,
}: CandidateFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CandidateFormInput>({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form className="section-card space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="form-label" htmlFor="full_name">
          Full name
        </label>
        <input
          id="full_name"
          className="form-input"
          {...register('full_name', { required: 'Full name is required' })}
        />
        {errors.full_name ? (
          <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
        ) : null}
      </div>
      <div>
        <label className="form-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="form-input"
          {...register('email', { required: 'Email is required' })}
        />
        {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email.message}</p> : null}
      </div>
      <div>
        <label className="form-label" htmlFor="phone_number">
          Phone number
        </label>
        <input
          id="phone_number"
          className="form-input"
          {...register('phone_number', { required: 'Phone number is required' })}
        />
        {errors.phone_number ? (
          <p className="mt-1 text-sm text-red-600">{errors.phone_number.message}</p>
        ) : null}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="primary-action"
      >
        {isSubmitting ? 'Saving' : submitLabel}
      </button>
    </form>
  );
}
