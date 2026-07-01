import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AuditLogPage } from './AuditLogPage';

const mocks = vi.hoisted(() => ({
  listAuditLogs: vi.fn(),
}));

vi.mock('../layouts/AppLayout', () => ({
  AppLayout: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock('../services/audit-service', () => ({
  listAuditLogs: mocks.listAuditLogs,
}));

function renderAuditLogPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuditLogPage />
    </QueryClientProvider>,
  );
}

describe('AuditLogPage', () => {
  it('renders audit logs and applies filters', async () => {
    const user = userEvent.setup();
    mocks.listAuditLogs.mockResolvedValue([
      {
        id: 'audit-1',
        entity_type: 'CANDIDATE',
        entity_id: 'candidate-1',
        event_type: 'CREATE',
        actor_id: 'admin-1',
        actor: { id: 'admin-1', email: 'admin@rms.local', role: 'ADMINISTRATOR' },
        changes: { before: null, after: { id: 'candidate-1' }, changed_fields: ['id'] },
        created_at: '2026-07-02T00:00:00.000Z',
      },
    ]);

    renderAuditLogPage();

    expect(await screen.findByText('Audit Logs')).toBeInTheDocument();
    expect(await screen.findByText('admin@rms.local')).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText('Entity'), 'CANDIDATE');
    await user.selectOptions(screen.getByLabelText('Event'), 'CREATE');

    expect(mocks.listAuditLogs).toHaveBeenCalledWith({});
    expect(mocks.listAuditLogs).toHaveBeenCalledWith({ entity_type: 'CANDIDATE' });
    expect(mocks.listAuditLogs).toHaveBeenCalledWith({
      entity_type: 'CANDIDATE',
      event_type: 'CREATE',
    });
  });

  it('renders audit API errors', async () => {
    mocks.listAuditLogs.mockRejectedValue(new Error('Failed'));

    renderAuditLogPage();

    expect(await screen.findByText('Unable to load audit logs.')).toBeInTheDocument();
  });
});
