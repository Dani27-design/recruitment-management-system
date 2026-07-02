import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CandidateSelector } from '../features/recruitments/components/CandidateSelector';
import { VacancySelector } from '../features/recruitments/components/VacancySelector';
import { AppLayout } from '../layouts/AppLayout';
import { listCandidates } from '../services/candidate-service';
import { createRecruitment } from '../services/recruitment-service';
import { listVacancies } from '../services/vacancy-service';

export function CreateRecruitmentPage() {
  const navigate = useNavigate();
  const [candidateId, setCandidateId] = useState('');
  const [vacancyId, setVacancyId] = useState('');

  const candidatesQuery = useQuery({
    queryKey: ['candidates', 'recruitment-create'],
    queryFn: () => listCandidates(),
  });
  const vacanciesQuery = useQuery({
    queryKey: ['vacancies', 'active'],
    queryFn: listVacancies,
  });
  const mutation = useMutation({
    mutationFn: () => createRecruitment({ candidate_id: candidateId, vacancy_id: vacancyId }),
    onSuccess: (recruitment) => {
      navigate(`/recruitments/${recruitment.id}`);
    },
  });

  const activeVacancies = vacanciesQuery.data?.filter((vacancy) => vacancy.status === 'ACTIVE') ?? [];
  const isSubmitDisabled = !candidateId || !vacancyId || mutation.isPending;

  return (
    <AppLayout>
      <section className="max-w-2xl">
        <h2 className="page-title mb-6">Create Recruitment</h2>
        {mutation.isError ? <p className="alert-error mb-4">Unable to create recruitment.</p> : null}
        <form
          className="section-card space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate();
          }}
        >
          <CandidateSelector
            candidates={candidatesQuery.data ?? []}
            value={candidateId}
            onChange={setCandidateId}
          />
          <VacancySelector vacancies={activeVacancies} value={vacancyId} onChange={setVacancyId} />
          {candidatesQuery.isLoading || vacanciesQuery.isLoading ? (
            <p className="text-sm text-slate-600">Loading recruitment options...</p>
          ) : null}
          {candidatesQuery.isError || vacanciesQuery.isError ? (
            <p className="alert-error">Unable to load recruitment options.</p>
          ) : null}
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="primary-action"
          >
            {mutation.isPending ? 'Creating' : 'Create Recruitment'}
          </button>
        </form>
      </section>
    </AppLayout>
  );
}
