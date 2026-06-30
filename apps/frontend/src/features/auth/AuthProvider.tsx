import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { loginRequest, logoutRequest } from '../../services/auth-service';
import type { AuthUser, LoginRequest } from '../../types/auth';
import { tokenStorage } from '../../utils/token-storage';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login(input: LoginRequest): Promise<void>;
  logout(): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isTokenAvailable, setIsTokenAvailable] = useState(() => Boolean(tokenStorage.getAccessToken()));

  const login = useCallback(async (input: LoginRequest) => {
    const result = await loginRequest(input);
    tokenStorage.setAccessToken(result.accessToken);
    setUser(result.user);
    setIsTokenAvailable(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      if (tokenStorage.getAccessToken()) {
        await logoutRequest();
      }
    } finally {
      tokenStorage.clearAccessToken();
      setUser(null);
      setIsTokenAvailable(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user) || isTokenAvailable,
      login,
      logout,
    }),
    [isTokenAvailable, login, logout, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
