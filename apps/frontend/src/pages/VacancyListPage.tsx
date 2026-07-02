import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthProvider';
import { DeleteVacancyDialog } from '../features/vacancies/components/DeleteVacancyDialog';
import { VacancyTable } from '../features/vacancies/components/VacancyTable';
import { AppLayout } from '../layouts/AppLayout';
import { deleteVacancy, listVacancies } from '../services/vacancy-service';
import type { Vacancy } from '../types/vacancy';

export function VacancyListPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [vacancyToDelete, setVacancyToDelete] = useState<Vacancy | null>(null);
  const canManage = user?.role === 'ADMINISTRATOR';

  const vacanciesQuery = useQuery({
    queryKey: ['vacancies'],
    queryFn: listVacancies,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVacancy(id),
    onSuccess: async () => {
      setVacancyToDelete(null);
      await queryClient.invalidateQueries({ queryKey: ['vacancies'] });
    },
  });

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="page-title">Vacancies</h2>
          <p className="page-description">Manage job openings.</p>
        </div>
        {canManage ? (
          <Link
            className="primary-action"
            to="/vacancies/new"
          >
            Create Vacancy
          </Link>
        ) : null}
      </div>

      {vacanciesQuery.isLoading ? <p className="surface-panel p-4 text-sm text-slate-600">Loading vacancies...</p> : null}
      {vacanciesQuery.isError ? <p className="alert-error">Unable to load vacancies.</p> : null}
      {vacanciesQuery.data ? (
        <VacancyTable
          vacancies={vacanciesQuery.data}
          canManage={canManage}
          onDelete={setVacancyToDelete}
        />
      ) : null}

      <DeleteVacancyDialog
        vacancy={vacancyToDelete}
        isDeleting={deleteMutation.isPending}
        onCancel={() => setVacancyToDelete(null)}
        onConfirm={() => {
          if (vacancyToDelete) {
            deleteMutation.mutate(vacancyToDelete.id);
          }
        }}
      />
    </AppLayout>
  );
}
