'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/lib/auth';
import { TaskList } from '@/components/TaskList';
import { TaskForm } from '@/components/TaskForm';
import { TaskFilters } from '@/components/TaskFilters';
import { taskAPI } from '@/lib/api';
import { Task } from '@/types/task';
import { Card } from '@/components/ui/card';

interface AdvancedFilters {
  priority?: 'urgent' | 'high' | 'medium' | 'low';
  tag?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  sortBy?: 'created_at' | 'due_date' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export default function Dashboard() {
  const router = useRouter();
  const { session, signOut } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter States
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed'
  const [searchTerm, setSearchTerm] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({});

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  const fetchTasks = useCallback(async () => {
    if (!session.data?.user?.id) return;

    try {
      setLoading(true);
      const token = session.data.token;
      // Fetch all tasks for the user and filter client-side for better UX & accurate counts
      const userTasks = await taskAPI.getTasks(session.data.user.id, token, {});
      setTasks(userTasks ?? []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [session.data?.user?.id, session.data?.token]);

  // Initial load
  useEffect(() => {
    if (session.data?.user?.id) {
      fetchTasks();
    }
  }, [session.data?.user?.id, fetchTasks]);

  const handleAdvancedFilterChange = (filters: AdvancedFilters) => {
    setAdvancedFilters(prev => ({
      ...prev,
      ...filters
    }));
  };

  // ================== TASK OPERATIONS ==================

  const handleCreateTask = async (taskData: {
    title: string;
    description?: string;
    priority?: 'urgent' | 'high' | 'medium' | 'low';
    due_date?: string;
    tags?: string;
  }) => {
    if (!session.data?.user?.id) return;

    const optimisticTask: Task = {
      id: Date.now(), // temporary negative/timestamp id
      title: taskData.title,
      description: taskData.description,
      completed: false,
      priority: taskData.priority || 'medium',
      due_date: taskData.due_date,
      tags: taskData.tags,
      user_id: session.data.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Optimistic add
    setTasks((prev) => [optimisticTask, ...prev]);

    try {
      const token = session.data.token;
      const createdTask = await taskAPI.createTask(session.data.user.id, taskData, token);

      // Replace temp task with real one
      setTasks((prev) =>
        prev.map((t) => (t.id === optimisticTask.id ? createdTask : t))
      );
    } catch (err) {
      console.error('Create failed:', err);
      setError('Failed to create task');
      // Rollback
      setTasks((prev) => prev.filter((t) => t.id !== optimisticTask.id));
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!session.data?.user?.id || !taskId) return;

    const taskToDelete = tasks.find((t) => t.id === taskId);
    if (!taskToDelete) return;

    // Optimistic remove
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    try {
      const token = session.data.token;
      await taskAPI.deleteTask(session.data.user.id, taskId, token);
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to delete task');
      // Rollback
      setTasks((prev) => [...prev, taskToDelete].sort((a, b) => b.id - a.id));
    }
  };

  const handleUpdateTask = async (taskId: number, taskData: Partial<Task>) => {
    if (!session.data?.user?.id || !taskId) return;

    const originalTask = tasks.find((t) => t.id === taskId);
    if (!originalTask) return;

    // Optimistic update
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, ...taskData, updated_at: new Date().toISOString() } : task
      )
    );

    try {
      const token = session.data.token;
      await taskAPI.updateTask(session.data.user.id, taskId, taskData, token);
    } catch (err) {
      console.error('Update failed:', err);
      setError('Failed to update task');
      // Rollback
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? originalTask : task))
      );
    }
  };

  const handleToggleComplete = async (taskId: number, completed: boolean) => {
    if (!session.data?.user?.id || !taskId) return;

    const originalTask = tasks.find((t) => t.id === taskId);
    if (!originalTask) return;

    // Optimistic toggle
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, completed, updated_at: new Date().toISOString() }
          : task
      )
    );

    try {
      const token = session.data.token;
      await taskAPI.toggleTaskCompletion(session.data.user.id, taskId, completed, token);
    } catch (err) {
      console.error('Toggle failed:', err);
      setError('Failed to toggle task status');
      // Rollback
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? originalTask : task))
      );
    }
  };

  // ================== FILTERING LOGIC ==================

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 1. Basic Status Filter
      let matchesFilter = true;
      if (filter === 'pending') {
        matchesFilter = !task.completed;
      } else if (filter === 'completed') {
        matchesFilter = task.completed;
      }

      // 2. Search Term
      let matchesSearch = true;
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        matchesSearch = 
          task.title.toLowerCase().includes(searchLower) ||
          (task.description?.toLowerCase().includes(searchLower) ?? false) ||
          (task.tags?.toLowerCase().includes(searchLower) ?? false);
      }

      // 3. Advanced Filters
      let matchesPriority = true;
      if (advancedFilters.priority) {
        matchesPriority = task.priority === advancedFilters.priority;
      }

      let matchesTag = true;
      if (advancedFilters.tag) {
        matchesTag = task.tags?.toLowerCase().includes(advancedFilters.tag.toLowerCase()) ?? false;
      }

      let matchesDate = true;
      if (advancedFilters.dueDateFrom) {
        const taskDate = task.due_date ? new Date(task.due_date) : null;
        const fromDate = new Date(advancedFilters.dueDateFrom);
        if (!taskDate || taskDate < fromDate) matchesDate = false;
      }
      if (advancedFilters.dueDateTo && matchesDate) {
        const taskDate = task.due_date ? new Date(task.due_date) : null;
        const toDate = new Date(advancedFilters.dueDateTo);
        // Set to end of day
        toDate.setHours(23, 59, 59, 999);
        if (!taskDate || taskDate > toDate) matchesDate = false;
      }

      return matchesFilter && matchesSearch && matchesPriority && matchesTag && matchesDate;
    }).sort((a, b) => {
      // 4. Sorting
      if (advancedFilters.sortBy) {
        const fieldA = a[advancedFilters.sortBy as keyof Task];
        const fieldB = b[advancedFilters.sortBy as keyof Task];
        
        if (!fieldA && !fieldB) return 0;
        if (!fieldA) return 1;
        if (!fieldB) return -1;

        let comparison = 0;
        if (fieldA < fieldB) comparison = -1;
        if (fieldA > fieldB) comparison = 1;

        return advancedFilters.sortOrder === 'desc' ? -comparison : comparison;
      }
      
      // Default sort: ID descending (newest first)
      return b.id - a.id;
    });
  }, [tasks, filter, searchTerm, advancedFilters]);

  // Calculate counts for display
  const pendingCount = tasks.filter(task => !task.completed).length;
  const completedCount = tasks.filter(task => task.completed).length;
  const allCount = tasks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <Navbar user={session.data?.user || undefined} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid gap-8 md:grid-cols-12 w-full">
          {/* Left sidebar - Mobile: Stacks on top */}
          <div className="md:col-span-4 space-y-6 w-full">
            <Card className="p-6 bg-gradient-to-br from-card to-card/50">
              <h1 className="text-3xl font-bold text-card-foreground mb-2">
                Hello, {session.data?.user?.name?.split(' ')[0] ?? 'User'}! 👋
              </h1>
              <p className="text-muted-foreground">
                {pendingCount} pending tasks • {completedCount} completed
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">New Task</h2>
              <TaskForm onSubmit={handleCreateTask} />
            </Card>
          </div>

          {/* Main content - Mobile: Stacks below */}
          <div className="md:col-span-8 space-y-6 w-full">
            <TaskFilters
              filter={filter}
              onFilterChange={setFilter}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              counts={{
                all: allCount,
                pending: pendingCount,
                completed: completedCount
              }}
              onAdvancedFilterChange={handleAdvancedFilterChange}
            />

            <Card className="p-6 min-h-[500px]">
              {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4 border border-destructive/20">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground">Loading tasks...</p>
                  </div>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-2xl">
                      {filter === 'completed' ? '✅' : filter === 'pending' ? '⏳' : '📝'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {searchTerm
                      ? 'No tasks match your search'
                      : filter === 'completed'
                        ? 'No completed tasks yet'
                        : filter === 'pending'
                          ? 'No pending tasks'
                          : 'No tasks yet. Create your first task!'
                    }
                  </h3>
                  <p className="text-muted-foreground">
                    {!searchTerm && filter !== 'all' && 'Try switching to "All tasks" or create a new task.'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4 text-sm text-muted-foreground">
                    Showing {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
                    {filter !== 'all' && ` (${filter} tasks)`}
                  </div>
                  <TaskList
                    tasks={filteredTasks}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleUpdateTask}
                    onDelete={handleDeleteTask}
                  />
                </>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
