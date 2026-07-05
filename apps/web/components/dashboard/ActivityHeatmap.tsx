'use client';

import { buildYearHeatmap } from '@bamblu/utils';
import { useMemo } from 'react';

interface ActivityHeatmapProps {
  heatmapData?: Record<string, number>;
}

const INTENSITY_CLASSES = [
  'bg-muted/40',
  'bg-primary/20',
  'bg-primary/40',
  'bg-primary/70',
  'bg-primary',
];

function getIntensity(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
}

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', ''];

export function ActivityHeatmap({ heatmapData }: ActivityHeatmapProps) {
  const days = useMemo(() => {
    const contributions = heatmapData
      ? Object.entries(heatmapData).map(([date, count]) => ({ date, count }))
      : [];
    return buildYearHeatmap(contributions);
  }, [heatmapData]);

  // Group days into weeks (columns of 7)
  const weeks = useMemo(() => {
    const result: typeof days[number][][] = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [days]);

  const total = days.reduce((sum, d) => sum + d.count, 0);

  return (
    <section
      id="activity-heatmap"
      aria-label="GitHub contribution heatmap"
      className="rounded-2xl border border-border bg-card p-5 space-y-3"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Activity</h2>
        <span className="text-xs text-muted-foreground">{total} contributions this year</span>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {/* Day labels */}
          <div className="flex flex-col gap-1 pt-5">
            {DAY_LABELS.map((d, i) => (
              <div key={i} className="h-3 text-[10px] text-muted-foreground leading-3 w-6 text-right">
                {d}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex flex-col">
            {/* Month labels */}
            <div className="flex gap-1 mb-1">
              {weeks.map((week, wi) => {
                const firstDay = week[0];
                if (!firstDay) return <div key={wi} className="w-3" />;
                const date = new Date(firstDay.date);
                const showLabel = date.getDate() <= 7;
                return (
                  <div key={wi} className="w-3 text-[10px] text-muted-foreground leading-3">
                    {showLabel ? MONTH_LABELS[date.getMonth()] : ''}
                  </div>
                );
              })}
            </div>
            {/* Cells */}
            <div className="flex gap-1">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((day) => (
                    <div
                      key={day.date}
                      title={`${day.date}: ${day.count} contributions`}
                      className={`h-3 w-3 rounded-sm transition-colors ${INTENSITY_CLASSES[getIntensity(day.count)]}`}
                      aria-label={`${day.date}: ${day.count} contributions`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
        <span>Less</span>
        {INTENSITY_CLASSES.map((cls, i) => (
          <div key={i} className={`h-3 w-3 rounded-sm ${cls}`} aria-hidden="true" />
        ))}
        <span>More</span>
      </div>
    </section>
  );
}
