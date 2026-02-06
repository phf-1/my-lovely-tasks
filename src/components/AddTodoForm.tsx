import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddTodoFormProps {
  onAdd: (text: string) => void;
}

export function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="What needs to be done?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" disabled={!text.trim()}>
        <Plus className="mr-2 h-4 w-4" />
        Add
      </Button>
    </form>
  );
}
