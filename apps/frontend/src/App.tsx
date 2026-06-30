import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthProvider';
import { CandidateDetailPage } from './pages/CandidateDetailPage';
import { CandidateListPage } from './pages/CandidateListPage';
import { CreateCandidatePage } from './pages/CreateCandidatePage';
import { EditCandidatePage } from './pages/EditCandidatePage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './routes/ProtectedRoute';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/candidates" element={<CandidateListPage />} />
              <Route path="/candidates/new" element={<CreateCandidatePage />} />
              <Route path="/candidates/:id" element={<CandidateDetailPage />} />
              <Route path="/candidates/:id/edit" element={<EditCandidatePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
