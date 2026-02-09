'use client';

import { useState, useCallback, useEffect } from 'react';
import { Task } from '@/types/task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: number, completed: boolean) => void;
  onEdit: (id: number, data: Partial<Task>) => void;
  onDelete: (id: number) => void;
}

export function TaskList({ tasks: initialTasks, onToggleComplete, onEdit, onDelete }: TaskListProps) {
  // ✅ FIX: Sync local state with parent props
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // ✅ FIX: Uncomment this useEffect to sync with parent
  useEffect(() => {
    console.log('TaskList: Syncing tasks from parent:', initialTasks.length);
    setTasks(initialTasks);
  }, [initialTasks]);

  // Optimistic toggle handler
  const handleToggle = useCallback(
    async (id: number, willBeCompleted: boolean) => {
      const now = new Date().toISOString();

      // 1. Optimistic update (turant UI update)
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                completed: willBeCompleted,
                completed_at: willBeCompleted ? now : undefined,
              }
            : task
        )
      );

      try {
        // 2. Real API call
        await onToggleComplete(id, willBeCompleted);
      } catch (error) {
        console.error('Toggle failed:', error);
        // 3. Rollback on failure
        setTasks((prev) =>
          prev.map((task) =>
            task.id === id
              ? {
                  ...task,
                  completed: !willBeCompleted,
                  completed_at: task.completed_at,
                }
              : task
          )
        );
      }
    },
    [onToggleComplete]
  );

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in">
        <div className="bg-primary/10 rounded-full p-4 mb-4 animate-bounce">
          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">No tasks yet</h2>
        <p className="text-muted-foreground max-w-sm">Get started by creating a new task above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          Your Tasks
          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {tasks.length}
          </span>
        </h2>
      </div>

      <div className="space-y-3">
        {tasks.map((task, index) => {
          if (!task.id) {
            console.error('Task without ID found:', task);
            return null;
          }

          return (
            <div
              key={task.id}
              className="animate-in fade-in slide-in-from-bottom-2 duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TaskItem
                task={task}
                onToggle={() => handleToggle(task.id!, !task.completed)}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          );
        }).filter(Boolean)}
      </div>
    </div>
  );
}