import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { format } from "date-fns";

interface TaskCardProps {
  task: {
    id: number;
    title: string;
    description: string; // ⚡ non-optional now
    priority: "urgent" | "high" | "medium" | "low";
    dueDate?: string;
    tags?: string; // Stored as comma-separated string from backend
    completed: boolean;
  };
  onToggle: () => void;
  onDelete: () => void;
}

export function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  const isValidDate = (dateString?: string) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500 text-white dark:bg-red-600 dark:text-white";
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <Card
      className={`border-l-4 ${
        task.priority === "urgent"
          ? "border-l-red-600"
          : task.priority === "high"
            ? "border-l-red-500"
            : task.priority === "medium"
              ? "border-l-yellow-500"
              : "border-l-green-500"
      } ${task.completed ? "opacity-70" : ""} overflow-hidden`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={onToggle}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <h3
                className={`font-semibold ${
                  task.completed
                    ? "text-gray-500 line-through dark:text-gray-400"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                {task.title}
              </h3>

              <p
                className={`mt-1 text-sm ${
                  task.completed
                    ? "text-gray-400 line-through dark:text-gray-500"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {task.description ?? "No description"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {task.tags?.split(',').map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag.trim()}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t bg-gray-50 dark:bg-gray-800/50 p-4">
        <div className="flex items-center space-x-2">
          <Badge className={getPriorityColor(task.priority)}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>

          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Icons.calendar className="mr-1 h-4 w-4" />
            <span>
              {task.dueDate && isValidDate(task.dueDate)
                ? format(new Date(task.dueDate), "MMM dd, yyyy")
                : "No due date"}
            </span>
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Icons.trash className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
