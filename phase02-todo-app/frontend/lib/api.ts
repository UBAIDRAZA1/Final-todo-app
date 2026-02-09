import axios from 'axios';
import { Task, TaskCreate, TaskUpdate } from '../types/task';

// ✅ IMPORTANT: Use correct URL for production (Hugging Face Space)
const getApiBaseUrl = () => {
  // Environment variable se lelo
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  // Production mein Hugging Face Space URL (no port needed)
  if (process.env.NODE_ENV === 'production') {
    return 'https://hafizubaid-todo-wep-app.hf.space';
  }

  // Development mein port 8001 (same as backend)
  return 'http://localhost:8001';
};

const API_BASE_URL = getApiBaseUrl();

console.log('API Base URL:', API_BASE_URL);

// Create an axios instance without the auth interceptor initially
const api = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ FIXED: Safe logging with null checks
if (process.env.NODE_ENV !== 'production') {
  api.interceptors.request.use((config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    console.log('Full URL:', `${config.baseURL || ''}${config.url || ''}`);
    return config;
  });
}

// Function to create API calls with proper authentication
const createAuthenticatedApi = (token: string | null) => {
  const authenticatedApi = axios.create({
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  return authenticatedApi;
};

export const taskAPI = {
  // ✅ GET all tasks with optional filters
  getTasks: async (
    userId: string,
    token: string | null,
    params?: {
      status?: 'all' | 'pending' | 'completed';
      priority?: 'urgent' | 'high' | 'medium' | 'low';
      tag?: string;
      due_date_from?: string;
      due_date_to?: string;
      sort_by?: 'created_at' | 'due_date' | 'priority' | 'title';
      sort_order?: 'asc' | 'desc';
      search?: string;
    }
  ): Promise<Task[]> => {
    try {
      const authenticatedApi = createAuthenticatedApi(token);
      const queryParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
      }

      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/api/${userId}/tasks${queryString ? '?' + queryString : ''}`;

      const response = await authenticatedApi.get(url);
      return response.data;
    } catch (error: any) {
      console.error('Failed to get tasks:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ CREATE new task
  createTask: async (userId: string, taskData: TaskCreate, token: string | null): Promise<Task> => {
    try {
      const authenticatedApi = createAuthenticatedApi(token);
      const response = await authenticatedApi.post(`${API_BASE_URL}/api/${userId}/tasks`, taskData);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create task:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ GET single task
  getTask: async (userId: string, taskId: number, token: string | null): Promise<Task> => {
    if (!taskId) {
      throw new Error('Task ID is required');
    }
    try {
      const authenticatedApi = createAuthenticatedApi(token);
      const response = await authenticatedApi.get(`${API_BASE_URL}/api/${userId}/tasks/${taskId}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to get task:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ UPDATE task
  updateTask: async (userId: string, taskId: number, taskData: TaskUpdate, token: string | null): Promise<Task> => {
    if (!taskId) {
      throw new Error('Task ID is required');
    }
    try {
      const authenticatedApi = createAuthenticatedApi(token);
      const response = await authenticatedApi.put(`${API_BASE_URL}/api/${userId}/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error: any) {
      console.error('Failed to update task:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ DELETE task
  deleteTask: async (userId: string, taskId: number, token: string | null): Promise<void> => {
    if (!taskId) {
      throw new Error('Task ID is required');
    }
    try {
      const authenticatedApi = createAuthenticatedApi(token);
      await authenticatedApi.delete(`${API_BASE_URL}/api/${userId}/tasks/${taskId}`);
    } catch (error: any) {
      console.error('Failed to delete task:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ TOGGLE task completion
  toggleTaskCompletion: async (userId: string, taskId: number, completed: boolean, token: string | null): Promise<Task> => {
    if (!taskId) {
      throw new Error('Task ID is required');
    }
    try {
      const authenticatedApi = createAuthenticatedApi(token);
      const response = await authenticatedApi.patch(`${API_BASE_URL}/api/${userId}/tasks/${taskId}/toggle`, {
        completed
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to toggle task:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ SEARCH tasks
  searchTasks: async (userId: string, query: string, token: string | null): Promise<Task[]> => {
    try {
      const authenticatedApi = createAuthenticatedApi(token);
      const response = await authenticatedApi.get(`${API_BASE_URL}/api/${userId}/tasks/search/?query=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to search tasks:', error.response?.data || error.message);
      throw error;
    }
  },
};

// ✅ Export individual functions
export const {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion
} = taskAPI;

// ✅ For backward compatibility
export const toggleTaskComplete = taskAPI.toggleTaskCompletion;


// ✅ Export api instance for custom requests
export default api;