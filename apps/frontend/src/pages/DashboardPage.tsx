import { useQuery } from '@tanstack/react-query';
import { StatisticCard } from '../features/dashboard/components/StatisticCard';
import { SummaryPanel } from '../features/dashboard/components/SummaryPanel';
import { AppLayout } from '../layouts/AppLayout';
import { getDashboardSummary } from '../services/dashboard-service';
import type { DashboardStageCounts, DashboardStatusCounts } from '../types/dashboard';

const STAGE_LABELS: Record<keyof DashboardStageCounts, string> = {
  ACCEPTANCE: 'Acceptance',
  APPLIED: 'Applied',
  INTERVIEW: 'Interview',
  SCREENING: 'Screening',
  TECHNICAL_TEST: 'Technical Test',
};

const STATUS_LABELS: Record<keyof DashboardStatusCounts, string> = {
  PASSED: 'Passed',
  PENDING: 'Pending',
  REJECTED: 'Rejected',
};

function toSummaryItems<T extends string>(counts: Record<T, number>, labels: Record<T, string>) {
  return (Object.keys(labels) as T[]).map((key) => ({
    label: labels[key],
    value: counts[key as T] ?? 0,
  }));
}

export function DashboardPage() {
  const dashboardQuery = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: getDashboardSummary,
  });
  const summary = dashboardQuery.data;

  return (
    <AppLayout>
      <section>
        <div className="mb-5">
          <div>
            <h2 className="page-title">Dashboard</h2>
            <p className="page-description">Recruitment summary information.</p>
          </div>
        </div>

        {dashboardQuery.isLoading ? (
          <p className="surface-panel p-4 text-sm text-slate-600">Loading dashboard...</p>
        ) : null}
        {dashboardQuery.isError ? (
          <p className="alert-error">Unable to load dashboard summary.</p>
        ) : null}

        {summary ? (
          <>
            {summary.total_candidates === 0 &&
            summary.total_active_vacancies === 0 &&
            summary.total_recruitments === 0 ? (
              <p className="empty-state mb-4">No dashboard data available.</p>
            ) : null}
            <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <StatisticCard label="Total Candidates" value={summary.total_candidates} />
              <StatisticCard
                label="Total Active Vacancies"
                value={summary.total_active_vacancies}
              />
              <StatisticCard label="Total Recruitments" value={summary.total_recruitments} />
            </dl>
            <div className="mt-4 grid gap-4 xl:grid-cols-2">
              <SummaryPanel
                title="Recruitment Count by Current Stage"
                items={toSummaryItems(
                  summary.recruitment_count_by_current_stage,
                  STAGE_LABELS,
                )}
              />
              <SummaryPanel
                title="Recruitment Count by Current Status"
                items={toSummaryItems(
                  summary.recruitment_count_by_current_status,
                  STATUS_LABELS,
                )}
              />
            </div>
          </>
        ) : null}
      </section>
    </AppLayout>
  );
}
