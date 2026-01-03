import React from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  threshold?: number;
}

export const PullToRefreshIndicator: React.FC<PullToRefreshIndicatorProps> = ({
  pullDistance,
  isRefreshing,
  threshold = 80,
}) => {
  const progress = Math.min(pullDistance / threshold, 1);
  const rotation = progress * 360;
  const opacity = Math.min(progress * 1.5, 1);

  if (pullDistance === 0 && !isRefreshing) return null;

  return (
    <div 
      className="flex justify-center items-center overflow-hidden transition-all duration-200"
      style={{ 
        height: `${pullDistance}px`,
        opacity,
      }}
    >
      <div 
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border border-primary/20",
          isRefreshing && "animate-pulse"
        )}
      >
        <RefreshCw 
          className={cn(
            "w-5 h-5 text-primary transition-transform",
            isRefreshing && "animate-spin"
          )}
          style={{ 
            transform: isRefreshing ? undefined : `rotate(${rotation}deg)`,
          }}
        />
      </div>
    </div>
  );
};
