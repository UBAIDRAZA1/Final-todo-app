import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TaskSkeleton() {
  return (
    <Card className="border-l-4 border-l-green-500">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Skeleton className="mt-1 h-5 w-5 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t bg-gray-50 dark:bg-gray-800/50 p-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        <Skeleton className="h-8 w-8 rounded-full" />
      </CardFooter>
    </Card>
  );
}