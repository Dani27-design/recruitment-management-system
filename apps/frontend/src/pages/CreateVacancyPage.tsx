import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { VacancyForm } from '../features/vacancies/components/VacancyForm';
import { AppLayout } from '../layouts/AppLayout';
import { createVacancy } from '../services/vacancy-service';
import type { VacancyFormInput } from '../types/vacancy';

export function CreateVacancyPage() {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (input: VacancyFormInput) => createVacancy(input),
    onSuccess: () => {
      navigate('/vacancies');
    },
  });

  return (
    <AppLayout>
      <section className="max-w-2xl">
        <h2 className="page-title mb-6">Create Vacancy</h2>
        {mutation.isError ? <p className="alert-error mb-4">Unable to create vacancy.</p> : null}
        <VacancyForm
          submitLabel="Create Vacancy"
          isSubmitting={mutation.isPending}
          onSubmit={(input) => mutation.mutate(input)}
        />
      </section>
    </AppLayout>
  );
}
