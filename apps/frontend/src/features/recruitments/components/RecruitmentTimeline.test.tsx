import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RecruitmentTimeline } from './RecruitmentTimeline';

describe('RecruitmentTimeline', () => {
  it('renders stage cards in the timeline', () => {
    render(
      <RecruitmentTimeline
        currentUser={{ id: 'admin-1', email: 'admin@rms.local', role: 'ADMINISTRATOR' }}
        stages={[
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
        ]}
        onUpdate={vi.fn()}
      />,
    );

    expect(screen.getByText('Recruitment Timeline')).toBeInTheDocument();
    expect(screen.getByText('APPLIED')).toBeInTheDocument();
  });
});
