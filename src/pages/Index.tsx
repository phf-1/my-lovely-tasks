import { Navigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { TodoList } from '@/components/TodoList';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { user, isLoading, signOut } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-semibold">My Tasks</h1>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user.email}
            </span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <TodoList />
        </div>
      </main>
    </div>
  );
};

export default Index;
