import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RecruitmentDetailPage } from './RecruitmentDetailPage';

const mocks = vi.hoisted(() => ({
  currentUser: { id: 'admin-1', email: 'admin@rms.local', role: 'ADMINISTRATOR' },
  assignRecruitmentStageManager: vi.fn().mockResolvedValue({
    id: 'stage-1',
    assigned_user_id: 'manager-1',
  }),
  createRecruitmentDocumentDownloadUrl: vi.fn().mockResolvedValue('https://signed.local'),
  deleteRecruitmentDocument: vi.fn().mockResolvedValue({
    id: 'document-1',
  }),
  listRecruitmentDocuments: vi.fn().mockResolvedValue([
    {
      id: 'document-1',
      recruitment_id: 'recruitment-1',
      document_type: 'CV',
      original_filename: 'cv.pdf',
      stored_filename: 'stored.pdf',
      mime_type: 'application/pdf',
      file_size: 100,
      storage_provider: 'database',
      storage_path: 'recruitment-1/stored.pdf',
      uploaded_by: 'admin-1',
      created_at: '2026-07-02T00:00:00.000Z',
      updated_at: '2026-07-02T00:00:00.000Z',
      deleted_at: null,
      uploader: { id: 'admin-1', email: 'admin@rms.local', role: 'ADMINISTRATOR' },
    },
  ]),
  updateRecruitmentStage: vi.fn().mockResolvedValue({
    id: 'stage-1',
    status: 'PASSED',
  }),
  uploadRecruitmentDocument: vi.fn().mockResolvedValue({
    id: 'document-2',
  }),
}));

vi.mock('../features/auth/AuthProvider', () => ({
  useAuth: () => ({
    user: mocks.currentUser,
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

vi.mock('../services/recruitment-document-service', () => ({
  createRecruitmentDocumentDownloadUrl: mocks.createRecruitmentDocumentDownloadUrl,
  deleteRecruitmentDocument: mocks.deleteRecruitmentDocument,
  listRecruitmentDocuments: mocks.listRecruitmentDocuments,
  uploadRecruitmentDocument: mocks.uploadRecruitmentDocument,
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
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.currentUser = { id: 'admin-1', email: 'admin@rms.local', role: 'ADMINISTRATOR' };
  });

  it('renders recruitment detail timeline and document workflow', async () => {
    const user = userEvent.setup();
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
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
    expect(screen.getAllByText('Software Engineer').length).toBeGreaterThan(0);
    expect(await screen.findByText('Recruitment Timeline')).toBeInTheDocument();
    await user.selectOptions(await screen.findByLabelText('Assigned manager'), 'manager-1');
    await user.click(screen.getByRole('button', { name: 'Assign' }));
    await user.type(screen.getByLabelText('Notes'), 'Ready');
    await user.click(screen.getByRole('button', { name: 'Mark passed' }));
    expect(await screen.findByText('Recruitment Documents')).toBeInTheDocument();
    expect(await screen.findByText('cv.pdf')).toBeInTheDocument();
    await user.upload(screen.getByLabelText('File'), new File(['pdf'], 'new-cv.pdf', { type: 'application/pdf' }));
    await user.click(screen.getByRole('button', { name: 'Upload' }));
    await user.click(screen.getByRole('button', { name: 'Download' }));
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(mocks.assignRecruitmentStageManager).toHaveBeenCalledWith('stage-1', 'manager-1');
    expect(mocks.updateRecruitmentStage).toHaveBeenCalledWith('stage-1', {
      status: 'PASSED',
      notes: 'Ready',
    });
    expect(mocks.listRecruitmentDocuments).toHaveBeenCalledWith('recruitment-1');
    expect(mocks.uploadRecruitmentDocument).toHaveBeenCalledWith('recruitment-1', {
      document_type: 'CV',
      file: expect.any(File),
    });
    expect(mocks.createRecruitmentDocumentDownloadUrl).toHaveBeenCalledWith('document-1');
    expect(openSpy).toHaveBeenCalledWith('https://signed.local', '_blank', 'noopener,noreferrer');
    expect(mocks.deleteRecruitmentDocument).toHaveBeenCalledWith('document-1');
  });

  it('limits managers to viewing and downloading recruitment documents', async () => {
    mocks.currentUser = { id: 'manager-1', email: 'manager@rms.local', role: 'MANAGER' };
    const user = userEvent.setup();
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
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

    expect(await screen.findByText('Recruitment Documents')).toBeInTheDocument();
    expect(await screen.findByText('cv.pdf')).toBeInTheDocument();
    expect(screen.queryByLabelText('File')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Upload' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Download' }));

    expect(mocks.uploadRecruitmentDocument).not.toHaveBeenCalled();
    expect(mocks.deleteRecruitmentDocument).not.toHaveBeenCalled();
    expect(mocks.createRecruitmentDocumentDownloadUrl).toHaveBeenCalledWith('document-1');
    expect(openSpy).toHaveBeenCalledWith('https://signed.local', '_blank', 'noopener,noreferrer');
  });
});
