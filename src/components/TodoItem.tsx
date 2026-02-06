import { Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Todo } from '@/hooks/useTodos';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
      <Checkbox
        id={todo.id}
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className="h-5 w-5"
      />
      <label
        htmlFor={todo.id}
        className={cn(
          'flex-1 cursor-pointer text-base transition-colors',
          todo.completed && 'text-muted-foreground line-through'
        )}
      >
        {todo.text}
      </label>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
