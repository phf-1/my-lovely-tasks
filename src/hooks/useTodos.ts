import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export function useTodos() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const storageKey = user ? `todos-${user.email}` : null;

  useEffect(() => {
    if (storageKey) {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setTodos(JSON.parse(stored));
      } else {
        setTodos([]);
      }
    }
    setIsLoading(false);
  }, [storageKey]);

  const saveTodos = (newTodos: Todo[]) => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(newTodos));
    }
    setTodos(newTodos);
  };

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    saveTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id: string) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos(newTodos);
  };

  const deleteTodo = (id: string) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    saveTodos(newTodos);
  };

  return {
    todos,
    isLoading,
    addTodo,
    toggleTodo,
    deleteTodo,
  };
}
