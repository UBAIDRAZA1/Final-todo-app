import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface TaskFiltersProps {
  onFilterChange: (filter: string) => void;
  filter: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  counts?: {
    all: number;
    pending: number;
    completed: number;
  };
  onAdvancedFilterChange?: (filters: {
    priority?: 'urgent' | 'high' | 'medium' | 'low';
    tag?: string;
    dueDateFrom?: string;
    dueDateTo?: string;
    sortBy?: 'created_at' | 'due_date' | 'priority';
    sortOrder?: 'asc' | 'desc';
  }) => void;
}

export function TaskFilters({
  onFilterChange,
  filter,
  searchTerm,
  onSearchChange,
  counts,
  onAdvancedFilterChange
}: TaskFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [tagFilter, setTagFilter] = useState('');
  const [dueDateFrom, setDueDateFrom] = useState('');
  const [dueDateTo, setDueDateTo] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  const handleApplyAdvancedFilters = () => {
    if (onAdvancedFilterChange) {
      onAdvancedFilterChange({
        priority: priorityFilter as 'urgent' | 'high' | 'medium' | 'low' || undefined,
        tag: tagFilter || undefined,
        dueDateFrom: dueDateFrom || undefined,
        dueDateTo: dueDateTo || undefined,
        sortBy: sortBy as 'created_at' | 'due_date' | 'priority' || undefined,
        sortOrder: sortOrder as 'asc' | 'desc' || undefined,
      });
    }
  };

  const handleClearAdvancedFilters = () => {
    setPriorityFilter('');
    setTagFilter('');
    setDueDateFrom('');
    setDueDateTo('');
    setSortBy('');
    setSortOrder('');

    if (onAdvancedFilterChange) {
      onAdvancedFilterChange({
        priority: undefined,
        tag: undefined,
        dueDateFrom: undefined,
        dueDateTo: undefined,
        sortBy: undefined,
        sortOrder: undefined,
      });
    }
  };

  return (
    <Card className="p-4 bg-card/50 backdrop-blur-sm border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
      {/* Basic Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-center sm:justify-start">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              console.log('All button clicked');
              onFilterChange('all');
            }}
            className="transition-all duration-300"
          >
            All {counts && `(${counts.all})`}
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              console.log('Pending button clicked');
              onFilterChange('pending');
            }}
            className="transition-all duration-300"
          >
            Pending {counts && `(${counts.pending})`}
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              console.log('Completed button clicked');
              onFilterChange('completed');
            }}
            className="transition-all duration-300"
          >
            Completed {counts && `(${counts.completed})`}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="transition-all duration-300"
          >
            {showAdvanced ? 'Hide Filters' : 'Advanced Filters'}
            <Icons.chevronDown className={`ml-2 h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        <div className="relative w-full sm:w-64">
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => {
              console.log('Search changed:', e.target.value);
              onSearchChange(e.target.value);
            }}
            className="pl-10 w-full bg-background/50 focus:bg-background transition-all duration-300"
          />
          <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="pt-4 border-t border-border/50 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Priority</label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Any priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Tag</label>
              <Input
                placeholder="Filter by tag"
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Due Date From</label>
              <Input
                type="date"
                value={dueDateFrom}
                onChange={(e) => setDueDateFrom(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Due Date To</label>
              <Input
                type="date"
                value={dueDateTo}
                onChange={(e) => setDueDateTo(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Default" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Created Date</SelectItem>
                  <SelectItem value="due_date">Due Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Sort Order</label>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger>
                  <SelectValue placeholder="Ascending" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClearAdvancedFilters}>
              Clear Filters
            </Button>
            <Button onClick={handleApplyAdvancedFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}