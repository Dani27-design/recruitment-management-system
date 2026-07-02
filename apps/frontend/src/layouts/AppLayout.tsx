import { useState, type PropsWithChildren } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthProvider';

const navItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Candidates', to: '/candidates' },
  { label: 'Vacancies', to: '/vacancies' },
  { label: 'Recruitments', to: '/recruitments' },
];

export function AppLayout({ children }: PropsWithChildren) {
  const { logout, user } = useAuth();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const userInitial = user?.email.slice(0, 1).toUpperCase() ?? 'U';
  const navigation = user?.role === 'ADMINISTRATOR'
    ? [...navItems, { label: 'Audit Logs', to: '/audit-logs' }]
    : navItems;

  return (
    <div className="min-h-screen">
      <div className="min-h-screen lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden h-screen border-r border-slate-200/80 bg-white px-5 py-6 lg:sticky lg:top-0 lg:block">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-700 text-sm font-bold text-white shadow-sm">
              RMS
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-950">Recruitment Management System</h1>
              <p className="text-xs font-medium text-slate-500">Internal hiring operations</p>
            </div>
          </div>

          <nav className="mt-8 space-y-1 text-sm font-semibold" aria-label="Primary navigation">
            {navigation.map((item) => (
              <NavLink
                className={({ isActive }) =>
                  `flex rounded-md px-3 py-2.5 transition ${
                    isActive
                      ? 'bg-teal-50 text-teal-800'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                  }`
                }
                end={item.to === '/'}
                key={item.to}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 px-4 py-3 shadow-sm shadow-slate-200/50 backdrop-blur lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3 lg:hidden">
                <button
                  type="button"
                  aria-label="Open navigation"
                  className="secondary-action px-3"
                  onClick={() => setIsMobileNavOpen(true)}
                >
                  Menu
                </button>
                <div className="min-w-0">
                  <h1 className="truncate text-base font-semibold text-slate-950">RMS</h1>
                  <p className="truncate text-xs font-medium text-slate-500">Hiring operations</p>
                </div>
              </div>

              <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-slate-950">{user?.email}</p>
                  <p className="text-xs font-medium text-slate-500">{user?.role}</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                  {userInitial}
                </div>
                <button type="button" onClick={() => void logout()} className="secondary-action">
                  Logout
                </button>
              </div>
            </div>
          </header>
          <main className="w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>

      {isMobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-slate-950/40"
            onClick={() => setIsMobileNavOpen(false)}
          />
          <aside className="relative flex h-full w-72 max-w-[calc(100vw-2rem)] flex-col bg-white px-5 py-6 shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-700 text-sm font-bold text-white">
                  RMS
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-950">Recruitment Management System</h2>
                  <p className="text-xs font-medium text-slate-500">Internal hiring operations</p>
                </div>
              </div>
              <button
                type="button"
                className="secondary-action px-3"
                onClick={() => setIsMobileNavOpen(false)}
              >
                Close
              </button>
            </div>
            <nav className="mt-8 space-y-1 text-sm font-semibold" aria-label="Mobile navigation">
              {navigation.map((item) => (
                <NavLink
                  className={({ isActive }) =>
                    `flex rounded-md px-3 py-2.5 transition ${
                      isActive ? 'bg-teal-50 text-teal-800' : 'text-slate-600'
                    }`
                  }
                  end={item.to === '/'}
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
