import { cn } from '@/lib/utils';

type StatusBadgeProps = {
  isPublished: boolean;
  className?: string;
};

export function StatusBadge({ isPublished, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-md transition-colors',
        isPublished
          ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-600 dark:text-emerald-400'
          : 'border-amber-400/30 bg-amber-400/10 text-amber-600 dark:text-amber-400',
        className
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          isPublished ? 'bg-emerald-500' : 'bg-amber-500'
        )}
      />
      {isPublished ? 'Published' : 'Draft'}
    </span>
  );
}
