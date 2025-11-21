import React from 'react';
import { cn } from '../../lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({ 
  value, 
  max = 100, 
  className,
  showLabel = false 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('w-full', className)}>
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-primary-600 transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-xs text-gray-600 text-right">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};

