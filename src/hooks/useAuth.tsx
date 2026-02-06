import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
    const storedUser = localStorage.getItem('todo-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    const users = JSON.parse(localStorage.getItem('todo-users') || '{}');
    
    if (!users[email]) {
      return { error: 'No account found with this email' };
    }
    
    if (users[email] !== password) {
      return { error: 'Incorrect password' };
    }
    
    const user = { email };
    localStorage.setItem('todo-user', JSON.stringify(user));
    setUser(user);
    return {};
  };

  const signUp = async (email: string, password: string): Promise<{ error?: string }> => {
    const users = JSON.parse(localStorage.getItem('todo-users') || '{}');
    
    if (users[email]) {
      return { error: 'An account with this email already exists' };
    }
    
    users[email] = password;
    localStorage.setItem('todo-users', JSON.stringify(users));
    
    const user = { email };
    localStorage.setItem('todo-user', JSON.stringify(user));
    setUser(user);
    return {};
  };

  const signOut = () => {
    localStorage.removeItem('todo-user');
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
