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
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = tokenStorage.getAccessToken();

    return token ? decodeAuthUser(token) : null;
  });
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

function decodeAuthUser(token: string): AuthUser | null {
  try {
    const payloadSegment = token.split('.')[1] ?? '';
    const normalizedPayload = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(normalizedPayload)) as Partial<AuthUser>;

    if (
      typeof payload.id === 'string' &&
      typeof payload.email === 'string' &&
      (payload.role === 'ADMINISTRATOR' || payload.role === 'MANAGER')
    ) {
      return {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      };
    }

    return null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
