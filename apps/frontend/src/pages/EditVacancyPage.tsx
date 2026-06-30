import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { VacancyForm } from '../features/vacancies/components/VacancyForm';
import { AppLayout } from '../layouts/AppLayout';
import { getVacancy, updateVacancy } from '../services/vacancy-service';
import type { VacancyFormInput } from '../types/vacancy';

export function EditVacancyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const vacancyQuery = useQuery({
    queryKey: ['vacancy', id],
    queryFn: () => getVacancy(id!),
    enabled: Boolean(id),
  });
  const mutation = useMutation({
    mutationFn: (input: VacancyFormInput) => updateVacancy(id!, input),
    onSuccess: () => {
      navigate('/vacancies');
    },
  });

  return (
    <AppLayout>
      <section className="max-w-2xl">
        <h2 className="mb-6 text-2xl font-semibold text-slate-950">Edit Vacancy</h2>
        {vacancyQuery.isLoading ? <p className="text-slate-600">Loading vacancy...</p> : null}
        {vacancyQuery.isError || mutation.isError ? (
          <p className="mb-4 text-red-600">Unable to update vacancy.</p>
        ) : null}
        {vacancyQuery.data ? (
          <VacancyForm
            defaultValues={{
              position_name: vacancyQuery.data.position_name,
              department: vacancyQuery.data.department,
              hiring_needed: vacancyQuery.data.hiring_needed,
              status: vacancyQuery.data.status,
            }}
            submitLabel="Save Vacancy"
            isSubmitting={mutation.isPending}
            onSubmit={(input) => mutation.mutate(input)}
          />
        ) : null}
      </section>
    </AppLayout>
  );
}
