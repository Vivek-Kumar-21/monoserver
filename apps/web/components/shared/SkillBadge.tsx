'use client';

import { cn } from '@bamblu/utils';

interface Skill {
  name: string;
  level: number;
  category: string;
}

interface SkillBadgeProps {
  skill: Skill;
  className?: string;
}

export function SkillBadge({ skill, className }: SkillBadgeProps) {
  // Determine color based on level
  let colorClass = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  if (skill.level >= 80) {
    colorClass = 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
  } else if (skill.level >= 50) {
    colorClass = 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
  } else if (skill.level >= 20) {
    colorClass = 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        colorClass,
        className
      )}
      title={`${skill.category}: ${skill.level.toFixed(0)}/100`}
    >
      <span>{skill.name}</span>
      <span className="opacity-60 text-[10px]">{Math.round(skill.level)}</span>
    </div>
  );
}
