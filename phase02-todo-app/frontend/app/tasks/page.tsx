'use client';

import { useState, useEffect } from "react";
import { useUndo } from "@/hooks/useUndo";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { TaskFilters } from "@/components/TaskFilters";
import { TaskCard } from "@/components/TaskCard";
import { TaskSkeleton } from "@/components/TaskSkeleton";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { Icons } from "@/components/icons";
import { useAuth } from "@/lib/auth";
import { getTasks, createTask, updateTask, deleteTask, toggleTaskComplete, searchTasks } from "@/lib/api";
import { Task } from "@/types/task";
import { Skeleton } from "@/components/ui/skeleton";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [advancedFilters, setAdvancedFilters] = useState({
    priority: undefined as 'urgent' | 'high' | 'medium' | 'low' | undefined,
    tag: undefined as string | undefined,
    dueDateFrom: undefined as string | undefined,
    dueDateTo: undefined as string | undefined,
    sortBy: undefined as 'created_at' | 'due_date' | 'priority' | undefined,
    sortOrder: undefined as 'asc' | 'desc' | undefined,
  });

  const undoManager = useUndo<Task>();

  const { session } = useAuth();
  const user = session.data?.user;
  const token = session.data?.token;

  useEffect(() => {
    if (user && token) {
      fetchTasks();
    }
  }, [user, token, filter, searchTerm, advancedFilters]);

  const fetchTasks = async () => {
    if (!user || !token) return;

    try {
      setLoading(true);

      // Prepare filter parameters for API
      const params: {
        status?: 'all' | 'pending' | 'completed';
        priority?: 'urgent' | 'high' | 'medium' | 'low';
        tag?: string;
        due_date_from?: string;
        due_date_to?: string;
        sort_by?: 'created_at' | 'due_date' | 'priority' | 'title';
        sort_order?: 'asc' | 'desc';
        search?: string;
      } = {};

      // Add status filter
      if (filter !== 'all') {
        params.status = filter as 'pending' | 'completed';
      }

      // Add search term
      if (searchTerm.trim()) {
        params.search = searchTerm;
      }

      // Add advanced filters
      if (advancedFilters.priority) {
        params.priority = advancedFilters.priority;
      }
      if (advancedFilters.tag) {
        params.tag = advancedFilters.tag;
      }
      if (advancedFilters.dueDateFrom) {
        params.due_date_from = advancedFilters.dueDateFrom;
      }
      if (advancedFilters.dueDateTo) {
        params.due_date_to = advancedFilters.dueDateTo;
      }
      if (advancedFilters.sortBy) {
        params.sort_by = advancedFilters.sortBy;
      }
      if (advancedFilters.sortOrder) {
        params.sort_order = advancedFilters.sortOrder;
      }

      // Fetch tasks with all filters applied on the backend
      const fetchedTasks = await getTasks(user.id, token, params);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData: {
    title: string;
    description?: string;
    priority?: 'urgent' | 'high' | 'medium' | 'low';
    due_date?: string;
    tags: string[];
  }) => {
    if (!user || !token) return;

    try {
      const newTask = await createTask(user.id, {
        title: taskData.title,
        description: taskData.description,
        completed: false,
        priority: taskData.priority,
        due_date: taskData.due_date,
        tags: taskData.tags.join(',') // Convert array to comma-separated string
      }, token);

      setTasks(prev => [newTask, ...prev]);
      setIsAddTaskOpen(false);
      toast.success(`Task "${newTask.title}" added successfully!`);
    } catch (error) {
      console.error("Failed to create task:", error);
      toast.error("Failed to add task. Please try again.");
    }
  };

  const handleToggleTask = async (id: number) => {
    if (!user || !token) return;

    try {
      const updatedTask = await toggleTaskComplete(user.id, id, true, token);
      setTasks(prev =>
        prev.map(t => t.id === id ? updatedTask : t)
      );

      const task = tasks.find(t => t.id === id);
      if (updatedTask.completed) {
        toast.success(`Task "${task?.title || 'Untitled'}" marked as completed!`);
      } else {
        toast.info(`Task "${task?.title || 'Untitled'}" marked as pending.`);
      }
    } catch (error) {
      console.error("Failed to toggle task:", error);
      toast.error("Failed to update task status. Please try again.");
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!user || !token) return;

    try {
      // Find the task to be deleted
      const taskToDelete = tasks.find(t => t.id === id);
      if (!taskToDelete) return;

      // Optimistically remove the task from the UI
      setTasks(prev => prev.filter(t => t.id !== id));

      // Add the action to the undo manager
      undoManager.addAction({
        type: 'delete',
        item: taskToDelete
      });

      // Show undo toast notification
      toast.custom((t) => (
        <div className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-10`}>
          <div className="flex-1 p-4">
            <div className="flex items-start">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Task "{taskToDelete.title}" deleted.
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                // Restore the task
                setTasks(prev => [...prev, taskToDelete]);
                toast.dismiss(t.id);
                // Remove the action from undo manager
                undoManager.undo();
              }}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 focus:outline-none"
            >
              Undo
            </button>
          </div>
        </div>
      ), {
        duration: 5000,
        position: 'bottom-right',
      });

      // Actually delete the task from the backend
      await deleteTask(user.id, id, token);
    } catch (error) {
      console.error("Failed to delete task:", error);
      // If deletion failed, restore the task
      setTasks(prev => [...prev, tasks.find(t => t.id === id)!]);
      toast.error("Failed to delete task. Please try again.");
    }
  };

  const handleAdvancedFilterChange = (filters: {
    priority?: 'urgent' | 'high' | 'medium' | 'low';
    tag?: string;
    dueDateFrom?: string;
    dueDateTo?: string;
    sortBy?: 'created_at' | 'due_date' | 'priority';
    sortOrder?: 'asc' | 'desc';
  }) => {
    setAdvancedFilters(prev => ({
      ...prev,
      priority: filters.priority,
      tag: filters.tag,
      dueDateFrom: filters.dueDateFrom,
      dueDateTo: filters.dueDateTo,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    }));
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container py-8">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>

            <Skeleton className="h-16 w-full mb-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <TaskSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-full">
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Tasks
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your tasks efficiently
              </p>
            </div>

            <Button onClick={() => setIsAddTaskOpen(true)}>
              <Icons.plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </motion.div>

          <TaskFilters
            onFilterChange={setFilter}
            filter={filter}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onAdvancedFilterChange={handleAdvancedFilterChange}
            counts={{
              all: tasks.length,
              pending: tasks.filter(t => !t.completed).length,
              completed: tasks.filter(t => t.completed).length
            }}
          />
        </div>

        {tasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-full mb-4">
              <Icons.task className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              No tasks found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filter === "completed"
                ? "You have no completed tasks yet."
                : filter === "pending"
                ? "You have no pending tasks. Great job!"
                : "Get started by creating a new task."}
            </p>

            <Button onClick={() => setIsAddTaskOpen(true)}>
              <Icons.plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <TaskCard
                  task={{
                    id: task.id,
                    title: task.title,
                    description: task.description ?? "",
                    priority: task.priority || "low",
                    dueDate: task.due_date || task.created_at,
                    tags: task.tags || "",
                    completed: task.completed,
                  }}
                  onToggle={() => handleToggleTask(task.id)}
                  onDelete={() => handleDeleteTask(task.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        <AddTaskDialog
          open={isAddTaskOpen}
          onOpenChange={setIsAddTaskOpen}
          onAddTask={handleAddTask}
          tagSuggestions={[...new Set(tasks.flatMap(task => task.tags?.split(',') || []).map(tag => tag.trim()))]}
        />
      </div>
    </div>
  );
}
