'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('overflow-auto', className)}
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 transparent' }}
        {...props}
      >
        <div style={{ minWidth: 'fit-content', width: '100%' }}>
          {children}
        </div>
      </div>
    );
  }
);
ScrollArea.displayName = 'ScrollArea';

const ScrollBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'relative touch-none select-none bg-gray-700 rounded-full',
        className
      )}
      {...props}
    />
  );
});
ScrollBar.displayName = 'ScrollBar';

export { ScrollArea, ScrollBar };