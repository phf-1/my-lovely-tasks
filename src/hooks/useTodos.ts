import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  apiListTodos,
  apiCreateTodo,
  apiUpdateTodo,
  apiDeleteTodo,
  type Todo,
} from '@/lib/api';

export type { Todo } from '@/lib/api';

export function useTodos() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTodos = useCallback(async () => {
    if (!user) {
      setTodos([]);
      setIsLoading(false);
      return;
    }
    try {
      const data = await apiListTodos();
      setTodos(data);
    } catch {
      // keep existing state on error
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async (text: string) => {
    const created = await apiCreateTodo(text);
    setTodos((prev) => [created, ...prev]);
  };

  const toggleTodo = async (id: string) => {
    const existing = todos.find((t) => t.id === id);
    if (!existing) return;
    const updated = await apiUpdateTodo(id, { completed: !existing.completed });
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const deleteTodo = async (id: string) => {
    await apiDeleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return {
    todos,
    isLoading,
    addTodo,
    toggleTodo,
    deleteTodo,
  };
}
