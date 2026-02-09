"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { taskAPI } from "@/lib/api";
import { Task } from "@/types/task";
import { isValidDate } from "@/lib/utils";
import { TaskForm } from "@/components/TaskForm";
import { TaskCard } from "@/components/TaskCard";

// Temporary interface extension for TaskCard
interface TaskWithOptionalFields extends Task {
  priority?: "low" | "medium" | "high";
  tags?: string[];
  dueDate?: string;
}

export default function TaskDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { session } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (session.data?.user?.id && id) {
      fetchTask();
    }
  }, [session.data, id]);

  const fetchTask = async () => {
    if (!session.data?.user?.id || !id) return;

    try {
      setLoading(true);
      const taskData = await taskAPI.getTask(
        session.data.user.id,
        parseInt(id as string),
        session.data.token,
      );
      setTask(taskData);
      setError(null);
    } catch (err) {
      setError("Failed to load task");
      console.error("Error fetching task:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: {
    title: string;
    description?: string;
  }) => {
    if (!session.data?.user?.id || !task) return;

    try {
      const updatedTask = await taskAPI.updateTask(
        session.data.user.id,
        task.id,
        data,
        session.data.token,
      );
      setTask(updatedTask);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update task");
      console.error("Error updating task:", err);
    }
  };

  const handleDelete = async () => {
    if (!session.data?.user?.id || !task) return;

    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskAPI.deleteTask(session.data.user.id, task.id, session.data.token);
        router.push("/");
      } catch (err) {
        setError("Failed to delete task");
        console.error("Error deleting task:", err);
      }
    }
  };

  const handleToggleComplete = async () => {
    if (!session.data?.user?.id || !task) return;

    try {
      const updatedTask = await taskAPI.toggleTaskCompletion(
        session.data.user.id,
        task.id,
        !task.completed,
        session.data.token,
      );
      setTask(updatedTask);
    } catch (err) {
      setError("Failed to update task status");
      console.error("Error updating task status:", err);
    }
  };

  if (session.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!session.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Please log in to access this task
          </h1>
          <a
            href="/auth/login"
            className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Login
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading task...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Task not found</h1>
          <button
            onClick={() => router.push("/")}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ✅ FIX: Create properly typed object for TaskCard
  const safeTaskForCard = {
    id: task.id,
    title: task.title,
    description: task.description ?? "",
    completed: task.completed,
    priority: ((task as TaskWithOptionalFields).priority as "low" | "medium" | "high") ?? "low",
    tags: (task as TaskWithOptionalFields).tags ?? [],
    dueDate: (task as TaskWithOptionalFields).dueDate,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
          >
            <svg
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Tasks
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
          >
            <svg
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete Task
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg flex items-start mb-4 border border-red-200">
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          {isEditing ? (
            <TaskForm
              task={task}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <>
              <TaskCard
                task={safeTaskForCard}
                onToggle={handleToggleComplete}
                onDelete={handleDelete}
              />
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Edit Task
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}