import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  apiSignIn,
  apiSignUp,
  apiSignOut,
  apiGetMe,
  setToken,
  getToken,
  ApiError,
} from '@/lib/api';

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    apiGetMe()
      .then((u) => setUser(u))
      .catch(() => {
        setToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const res = await apiSignIn(email, password);
      setToken(res.token);
      setUser(res.user);
      return {};
    } catch (e) {
      if (e instanceof ApiError) return { error: e.message };
      return { error: 'Something went wrong' };
    }
  };

  const signUp = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const res = await apiSignUp(email, password);
      setToken(res.token);
      setUser(res.user);
      return {};
    } catch (e) {
      if (e instanceof ApiError) return { error: e.message };
      return { error: 'Something went wrong' };
    }
  };

  const signOut = async () => {
    try {
      await apiSignOut();
    } catch {
      // sign out locally even if the server call fails
    }
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
