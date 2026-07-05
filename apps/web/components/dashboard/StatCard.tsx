import { cn, compactNumber } from '@bamblu/utils';
import { GitCommit, Flame, Zap, CheckCircle, LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  'git-commit': GitCommit,
  flame: Flame,
  zap: Zap,
  'check-circle': CheckCircle,
};

interface StatCardProps {
  id: string;
  label: string;
  value: number | string;
  icon: string;
  delta?: number; // % change since last sync
  className?: string;
}

export function StatCard({ id, label, value, icon, delta, className }: StatCardProps) {
  const Icon = ICON_MAP[icon] ?? Zap;
  const displayValue = typeof value === 'number' ? compactNumber(value) : value;

  return (
    <div
      id={id}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20',
        className
      )}
    >
      {/* Background glow */}
      <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-colors duration-300" />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          <p className="text-3xl font-bold tracking-tight text-foreground">{displayValue}</p>
          {delta !== undefined && (
            <p
              className={cn(
                'text-xs font-medium',
                delta >= 0 ? 'text-bamblu-green' : 'text-destructive'
              )}
            >
              {delta >= 0 ? '+' : ''}
              {delta.toFixed(1)}% this week
            </p>
          )}
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
