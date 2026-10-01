import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'rounded';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rounded',
  width,
  height,
  className = '',
  style,
  ...props
}) => {
  const variantClasses = {
    rectangular: 'rounded-none',
    circular: 'rounded-full',
    rounded: 'rounded-2xl',
  };

  return (
    <div
      className={`bg-stone-200/70 animate-pulse ${variantClasses[variant]} ${className}`}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200/60 p-0 shadow-sm">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="p-4 space-y-2.5">
        <Skeleton className="h-3 w-1/3 rounded-md" />
        <Skeleton className="h-4 w-4/5 rounded-md" />
        <Skeleton className="h-3 w-1/4 rounded-md" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-5 w-2/5 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
