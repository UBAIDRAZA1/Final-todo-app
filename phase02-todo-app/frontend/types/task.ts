export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  due_date?: string;
  tags?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  completed?: boolean;
  priority?: 'urgent' | 'high' | 'medium' | 'low';
  due_date?: string;
  tags?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'urgent' | 'high' | 'medium' | 'low';
  due_date?: string;
  tags?: string;
}

export interface TaskToggleComplete {
  completed: boolean;
}

export interface TaskFilters {
  status?: 'all' | 'completed' | 'pending';
  priority?: 'low' | 'medium' | 'high';
  search?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  tag?: string;
  sortBy?: 'created_at' | 'due_date' | 'priority';
  sortOrder?: 'asc' | 'desc';
  offset?: number;
  limit?: number;
}