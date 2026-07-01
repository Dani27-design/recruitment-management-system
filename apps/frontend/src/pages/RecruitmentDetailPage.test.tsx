import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { RecruitmentDetailPage } from './RecruitmentDetailPage';

const mocks = vi.hoisted(() => ({
  assignRecruitmentStageManager: vi.fn().mockResolvedValue({
    id: 'stage-1',
    assigned_user_id: 'manager-1',
  }),
  updateRecruitmentStage: vi.fn().mockResolvedValue({
    id: 'stage-1',
    status: 'PASSED',
  }),
}));

vi.mock('../features/auth/AuthProvider', () => ({
  useAuth: () => ({
    user: { id: 'admin-1', email: 'admin@rms.local', role: 'ADMINISTRATOR' },
  }),
}));

vi.mock('../layouts/AppLayout', () => ({
  AppLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../services/recruitment-service', () => ({
  getRecruitment: vi.fn().mockResolvedValue({
    id: 'recruitment-1',
    candidate: { full_name: 'Jane Doe' },
    vacancy: { position_name: 'Software Engineer' },
    stages: [
      {
        id: 'stage-1',
        recruitment_id: 'recruitment-1',
        stage: 'APPLIED',
        status: 'PENDING',
        assigned_user_id: null,
        scheduled_at: null,
        completed_at: null,
        notes: null,
        created_at: '2026-07-01T00:00:00.000Z',
        updated_at: '2026-07-01T00:00:00.000Z',
      },
    ],
  }),
}));

vi.mock('../services/recruitment-stage-service', () => ({
  assignRecruitmentStageManager: mocks.assignRecruitmentStageManager,
  listRecruitmentStages: vi.fn().mockResolvedValue([
    {
      id: 'stage-1',
      recruitment_id: 'recruitment-1',
      stage: 'APPLIED',
      status: 'PENDING',
      assigned_user_id: null,
      scheduled_at: null,
      completed_at: null,
      notes: null,
      created_at: '2026-07-01T00:00:00.000Z',
      updated_at: '2026-07-01T00:00:00.000Z',
    },
  ]),
  updateRecruitmentStage: mocks.updateRecruitmentStage,
}));

vi.mock('../services/user-service', () => ({
  listManagers: vi.fn().mockResolvedValue([
    { id: 'manager-1', email: 'manager@rms.local', role: 'MANAGER' },
  ]),
}));

describe('RecruitmentDetailPage', () => {
  it('renders recruitment detail timeline and submits stage updates and assignments', async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/recruitments/recruitment-1']}>
          <Routes>
            <Route path="/recruitments/:id" element={<RecruitmentDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(await screen.findByText('Recruitment Timeline')).toBeInTheDocument();
    await user.selectOptions(await screen.findByLabelText('Assigned manager'), 'manager-1');
    await user.click(screen.getByRole('button', { name: 'Assign' }));
    await user.type(screen.getByLabelText('Notes'), 'Ready');
    await user.click(screen.getByRole('button', { name: 'Mark passed' }));

    expect(mocks.assignRecruitmentStageManager).toHaveBeenCalledWith('stage-1', 'manager-1');
    expect(mocks.updateRecruitmentStage).toHaveBeenCalledWith('stage-1', {
      status: 'PASSED',
      notes: 'Ready',
    });
  });
});
