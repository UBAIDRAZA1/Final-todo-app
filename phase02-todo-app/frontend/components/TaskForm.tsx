'use client';

import { useState } from 'react';
import { Task } from '@/types/task';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { TagInput } from '@/components/TagInput';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: {
    title: string;
    description?: string;
    priority?: 'urgent' | 'high' | 'medium' | 'low';
    due_date?: string;
    tags?: string;
  }) => void;
  onCancel?: () => void;
}

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<'urgent' | 'high' | 'medium' | 'low'>(task?.priority || 'medium');
  const [dueDate, setDueDate] = useState(task?.due_date || '');
  const [tags, setTags] = useState<string[]>(task?.tags?.split(',')?.map(tag => tag.trim()).filter(tag => tag) || []);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setError('');
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      due_date: dueDate || undefined,
      tags: tags.join(',') || undefined  // Convert array back to comma-separated string
    });

    if (!task) {
      // Only reset form if creating a new task
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setTags([]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {error && (
        <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded-md animate-shake">
          <p className="text-sm text-destructive font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-foreground font-medium">
            Task Title
          </Label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-background/50 backdrop-blur-sm focus:bg-background transition-all duration-300"
            placeholder="What needs to be done?"
            maxLength={255}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-foreground font-medium">
            Description (Optional)
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="bg-background/50 backdrop-blur-sm focus:bg-background transition-all duration-300 resize-none"
            placeholder="Add more details..."
            maxLength={1000}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-foreground font-medium">
              Priority
            </Label>
            <Select value={priority} onValueChange={(value) => setPriority(value as 'urgent' | 'high' | 'medium' | 'low')}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-foreground font-medium">
              Due Date
            </Label>
            <Input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-background/50 backdrop-blur-sm focus:bg-background transition-all duration-300"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags" className="text-foreground font-medium">
            Tags
          </Label>
          <TagInput
            value={tags}
            onChange={setTags}
            placeholder="Add a tag..."
            maxTags={12}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant={task ? "default" : "gradient"}
            className="w-full sm:w-auto"
          >
            {task ? 'Update Task' : 'Add Task'}
          </Button>
        </div>
      </div>
    </form>
  );
}