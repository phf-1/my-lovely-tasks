import { useTodos } from '@/hooks/useTodos';
import { TodoItem } from './TodoItem';
import { AddTodoForm } from './AddTodoForm';
import { ScrollArea } from '@/components/ui/scroll-area';

export function TodoList() {
  const { todos, isLoading, addTodo, toggleTodo, deleteTodo } = useTodos();

  if (isLoading) {
    return <p className="text-center text-muted-foreground">Loading tasks...</p>;
  }

  return (
    <div className="space-y-6">
      <AddTodoForm onAdd={addTodo} />
      
      {todos.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No tasks yet. Add one above!</p>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-3 pr-4">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
