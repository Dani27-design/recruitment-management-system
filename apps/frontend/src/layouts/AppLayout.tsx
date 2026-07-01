import type { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthProvider';

export function AppLayout({ children }: PropsWithChildren) {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-semibold text-slate-950">Recruitment Management System</h1>
            <nav className="flex items-center gap-4 text-sm font-medium text-slate-700">
              <Link className="hover:text-slate-950" to="/">
                Dashboard
              </Link>
              <Link className="hover:text-slate-950" to="/candidates">
                Candidates
              </Link>
              <Link className="hover:text-slate-950" to="/vacancies">
                Vacancies
              </Link>
              <Link className="hover:text-slate-950" to="/recruitments">
                Recruitments
              </Link>
            </nav>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
