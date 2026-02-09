'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { TaskList } from '@/components/TaskList';
import { TaskForm } from '@/components/TaskForm';
import { getTasks, createTask, updateTask, deleteTask, toggleTaskComplete } from '@/lib/api';

interface TaskDashboardProps {
  userId: string;
  token: string | null;
}

export default function TaskDashboard({ userId, token }: TaskDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks(userId, token);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: { title: string; description?: string }) => {
    try {
      const newTask = await createTask(userId, { ...taskData, completed: false }, token);
      // Ensure the new task has a valid ID before adding to state
      if (newTask && newTask.id) {
        setTasks([...tasks, newTask]);
        setShowForm(false);
      } else {
        console.error('Created task does not have a valid ID:', newTask);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskId: number, taskData: Partial<Task>) => {
    if (!taskId) {
      console.error('Task ID is undefined or invalid for update:', taskId);
      return;
    }
    try {
      const updatedTask = await updateTask(userId, taskId, taskData, token);
      // Use the original task ID if the response doesn't have one (for backend compatibility)
      const taskWithId = updatedTask.id ? updatedTask : { ...updatedTask, id: taskId };
      setTasks(tasks.map(task => task.id === taskId ? taskWithId : task));
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!taskId) {
      console.error('Task ID is undefined or invalid for delete:', taskId);
      return;
    }
    try {
      await deleteTask(userId, taskId, token);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleComplete = async (taskId: number, completed: boolean) => {
    if (!taskId) {
      console.error('Task ID is undefined or invalid:', taskId);
      return;
    }
    try {
      const updatedTask = await toggleTaskComplete(userId, taskId, completed, token);
      // Use the original task ID if the response doesn't have one (for backend compatibility)
      const taskWithId = updatedTask.id ? updatedTask : { ...updatedTask, id: taskId };
      setTasks(tasks.map(task => task.id === taskId ? taskWithId : task));
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add Task
          </button>
        </div>

        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-md ${
              filter === 'active' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-md ${
              filter === 'completed' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Completed
          </button>
        </div>

        {showForm && !editingTask && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
            <TaskForm
              onSubmit={handleCreateTask}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {editingTask && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
            <TaskForm
              task={editingTask}
              onSubmit={(data) => handleUpdateTask(editingTask.id, data)}
              onCancel={() => setEditingTask(null)}
            />
          </div>
        )}

        <TaskList
            tasks={filteredTasks}
            onToggleComplete={handleToggleComplete}
            onEdit={handleUpdateTask}
            onDelete={handleDeleteTask}
          />
      </div>
    </div>
  );
}