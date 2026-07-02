import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthProvider';
import type { LoginRequest } from '../types/auth';

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (values: LoginRequest) => {
    setErrorMessage(null);

    try {
      await login(values);
    } catch {
      setErrorMessage('Invalid email or password');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <section className="w-full max-w-md rounded-xl border border-slate-200/80 bg-white/95 p-8 shadow-xl shadow-slate-200/70">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-700 text-sm font-bold text-white">
            RMS
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-950">Recruitment Management System</h1>
            <p className="text-sm font-medium text-slate-500">Internal access</p>
          </div>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="form-input"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email.message}</p> : null}
          </div>
          <div>
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="form-input"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password ? (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            ) : null}
          </div>
          {errorMessage ? <p className="alert-error">{errorMessage}</p> : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="primary-action w-full"
          >
            {isSubmitting ? 'Signing in' : 'Login'}
          </button>
        </form>
      </section>
    </main>
  );
}
