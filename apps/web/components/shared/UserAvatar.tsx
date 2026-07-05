'use client';

import { cn } from '@bamblu/utils';

interface UserAvatarProps {
  id?: string;
  src?: string | null;
  name?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_MAP = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-16 w-16 text-xl',
  xl: 'h-24 w-24 text-3xl',
};

export function UserAvatar({ id, src, name, size = 'md', className }: UserAvatarProps) {
  const initials = name ? name.substring(0, 2).toUpperCase() : '??';

  return (
    <div
      id={id}
      className={cn(
        'relative inline-flex items-center justify-center rounded-full overflow-hidden bg-primary/10 shrink-0',
        SIZE_MAP[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={name ?? 'Avatar'}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="font-semibold text-primary">{initials}</span>
      )}
    </div>
  );
}
