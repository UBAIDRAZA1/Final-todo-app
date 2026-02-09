'use client';

import { useState } from 'react';
import { Task } from '@/types/task';
import { TaskForm } from './TaskForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onEdit: (id: number, data: Partial<Task>) => void;
  onDelete: (id: number) => void;
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return 'Date unknown';

    // Handle invalid backend default dates
    if (dateString === '0001-01-01T00:00:00' || 
        dateString === '0001-01-01 00:00:00' ||
        dateString.includes('0001-01-01')) {
      return 'Date unknown';
    }

    try {
      // Handle Python-style datetime with space
      const normalized = dateString.includes(' ') 
        ? dateString.replace(' ', 'T').split('.')[0] + 'Z'  // remove microseconds + add Z
        : dateString;

      const date = new Date(normalized);

      if (isNaN(date.getTime())) {
        return 'Date unknown';
      }

      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'  // optional: remove if you don't want year
      });
    } catch (error) {
      console.error('Date format error:', dateString, error);
      return 'Date unknown';
    }
  };

  // We cache formatted dates — they shouldn't change after mount
  const createdDate = formatDate(task.created_at);
  const completedDate = task.completed_at ? formatDate(task.completed_at) : null;

  const handleEdit = (data: {
    title: string;
    description?: string;
    priority?: 'urgent' | 'high' | 'medium' | 'low';
    due_date?: string;
    tags?: string;
  }) => {
    if (!task.id) {
      console.error('Task ID is missing on edit');
      return;
    }
    onEdit(task.id, data);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!task.id) {
      console.error('Task ID is missing on delete');
      return;
    }
    onDelete(task.id);
  };

  if (isEditing) {
    return (
      <Card className="p-4 shadow-lg border-primary/20 bg-background/95">
        <TaskForm
          task={task}
          onSubmit={handleEdit}
          onCancel={() => setIsEditing(false)}
        />
      </Card>
    );
  }

  return (
    <Card 
      className={`group relative transition-all duration-300 hover:shadow-lg border-border/60 hover:border-primary/30
        ${task.completed ? 'bg-secondary/30' : 'bg-card'}`}
    >
      <div className="flex items-start gap-4 p-4">
        <div className="flex-shrink-0 pt-1">
          <label className="relative flex items-center justify-center cursor-pointer group/checkbox">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => {
                if (!task.id) {
                  console.error('Cannot toggle — task ID missing');
                  return;
                }
                onToggle();
              }}
              className="peer sr-only"
            />
            <div className={`w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center
              ${task.completed
                ? 'bg-green-500 border-green-500 scale-105'
                : 'bg-transparent border-muted-foreground/40 group-hover/checkbox:border-primary group-hover/checkbox:scale-105'}`}
            >
              <svg 
                className={`w-3.5 h-3.5 text-white transition-all duration-300 ${task.completed ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="3"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </label>
        </div>

        <div className="flex-1 min-w-0 pt-0.5">
          <h3 className={`text-base font-medium leading-none transition-all duration-300 ${task.completed ? 'text-muted-foreground line-through decoration-border' : 'text-foreground'}`}>
            {task.title}
          </h3>

          {task.description && (
            <p className={`mt-1.5 text-sm leading-relaxed transition-colors duration-300 ${task.completed ? 'text-muted-foreground/60' : 'text-muted-foreground'}`}>
              {task.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground/70">
            <span className="flex items-center gap-1 bg-secondary/50 px-2 py-0.5 rounded-full">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {createdDate}
            </span>

            {completedDate && completedDate !== 'Date unknown' && (
              <span className="flex items-center gap-1 bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 px-2 py-0.5 rounded-full">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Completed {completedDate}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
            title="Edit task"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Button>

          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                title="Delete task"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the task
                  "{task.title}" from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDelete();
                    setIsDeleteDialogOpen(false);
                  }}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Card>
  );
}