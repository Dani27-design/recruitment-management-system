import { AppLayout } from '../layouts/AppLayout';

export function HomePage() {
  return (
    <AppLayout>
      <section>
        <h2 className="text-2xl font-semibold text-slate-950">Protected Application</h2>
        <p className="mt-2 text-slate-600">Authentication is active.</p>
      </section>
    </AppLayout>
  );
}
