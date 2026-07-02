import type { PropsWithChildren } from 'react';
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
  const userInitial = user?.email.slice(0, 1).toUpperCase() ?? 'U';

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-0 px-0 lg:px-6">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200/80 bg-white/90 px-5 py-6 shadow-sm shadow-slate-200/60 backdrop-blur lg:block">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-700 text-sm font-bold text-white shadow-sm">
              RMS
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-950">Recruitment Management System</h1>
              <p className="text-xs font-medium text-slate-500">Internal hiring operations</p>
            </div>
          </div>

          <nav className="mt-8 space-y-1 text-sm font-semibold" aria-label="Primary navigation">
            {navItems.map((item) => (
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
            {user?.role === 'ADMINISTRATOR' ? (
              <NavLink
                className={({ isActive }) =>
                  `flex rounded-md px-3 py-2.5 transition ${
                    isActive
                      ? 'bg-teal-50 text-teal-800'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                  }`
                }
                to="/audit-logs"
              >
                Audit Logs
              </NavLink>
            ) : null}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-slate-200/80 bg-white/90 px-5 py-4 shadow-sm shadow-slate-200/60 backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="lg:hidden">
                <h1 className="text-base font-semibold text-slate-950">RMS</h1>
                <nav className="mt-3 flex gap-2 overflow-x-auto text-sm font-semibold" aria-label="Primary navigation">
                  {navItems.map((item) => (
                    <NavLink
                      className={({ isActive }) =>
                        `whitespace-nowrap rounded-md px-3 py-2 ${
                          isActive ? 'bg-teal-50 text-teal-800' : 'text-slate-600'
                        }`
                      }
                      end={item.to === '/'}
                      key={item.to}
                      to={item.to}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                  {user?.role === 'ADMINISTRATOR' ? (
                    <NavLink
                      className={({ isActive }) =>
                        `whitespace-nowrap rounded-md px-3 py-2 ${
                          isActive ? 'bg-teal-50 text-teal-800' : 'text-slate-600'
                        }`
                      }
                      to="/audit-logs"
                    >
                      Audit Logs
                    </NavLink>
                  ) : null}
                </nav>
              </div>

              <div className="ml-auto flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-slate-950">{user?.email}</p>
                  <p className="text-xs font-medium text-slate-500">{user?.role}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                  {userInitial}
                </div>
                <button type="button" onClick={() => void logout()} className="secondary-action">
                  Logout
                </button>
              </div>
            </div>
          </header>
          <main className="w-full px-5 py-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
