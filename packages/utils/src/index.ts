import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, parseISO, startOfDay, eachDayOfInterval, subYears } from 'date-fns';

// ─── Styling ──────────────────────────────────────────────────────────────────

/**
 * Merges Tailwind CSS class names, resolving conflicts intelligently.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ─── Date Formatting ──────────────────────────────────────────────────────────

/**
 * Formats a date to a human-readable string: "Jan 5, 2025"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy');
}

/**
 * Formats a date to relative time: "3 days ago"
 */
export function timeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

/**
 * Returns a compact time label: "2h ago", "3d ago"
 */
export function compactTimeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const diffMs = Date.now() - d.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return formatDate(d);
}

// ─── Heatmap Helpers ─────────────────────────────────────────────────────────

export interface HeatmapDay {
  date: string; // ISO "YYYY-MM-DD"
  count: number;
}

/**
 * Generates an empty heatmap for the past year, keyed by ISO date string.
 */
export function buildYearHeatmap(contributions: HeatmapDay[]): HeatmapDay[] {
  const today = new Date();
  const oneYearAgo = subYears(today, 1);
  const allDays = eachDayOfInterval({ start: startOfDay(oneYearAgo), end: startOfDay(today) });

  const map = new Map(contributions.map((c) => [c.date, c.count]));

  return allDays.map((day) => {
    const key = format(day, 'yyyy-MM-dd');
    return { date: key, count: map.get(key) ?? 0 };
  });
}

// ─── Slug / String Helpers ────────────────────────────────────────────────────

/**
 * Converts a string to a URL-safe slug.
 * "Data Structures & Algorithms" → "data-structures-algorithms"
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Capitalizes the first letter of every word.
 */
export function titleCase(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Truncates a string to a max length, appending "…".
 */
export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1) + '…';
}

// ─── Number Formatting ────────────────────────────────────────────────────────

/**
 * Formats large numbers compactly: 12000 → "12K", 1500000 → "1.5M"
 */
export function compactNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

/**
 * Returns a percentage string clamped to 0-100.
 */
export function toPercent(value: number, total: number, decimals = 1): string {
  if (total === 0) return '0%';
  const pct = Math.min(100, Math.max(0, (value / total) * 100));
  return `${pct.toFixed(decimals)}%`;
}

// ─── GitHub Helpers ───────────────────────────────────────────────────────────

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Ruby: '#701516',
  Kotlin: '#A97BFF',
};

export function getLanguageColor(language: string): string {
  return LANGUAGE_COLORS[language] ?? '#8b949e';
}

// ─── Codeforces Rank Colors ───────────────────────────────────────────────────

export const CF_RANK_COLORS: Record<string, string> = {
  newbie: '#808080',
  pupil: '#008000',
  specialist: '#03a89e',
  expert: '#0000ff',
  'candidate master': '#aa00aa',
  master: '#ff8c00',
  'international master': '#ff8c00',
  grandmaster: '#ff0000',
  'international grandmaster': '#ff0000',
  'legendary grandmaster': '#ff0000',
};

export function getCFRankColor(rank: string): string {
  return CF_RANK_COLORS[rank.toLowerCase()] ?? '#808080';
}
