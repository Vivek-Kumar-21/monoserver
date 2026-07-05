'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';

interface SkillRow {
  name: string;
  level: number;
  category: string;
}

interface SkillRadarProps {
  skills: SkillRow[];
}

export function SkillRadar({ skills }: SkillRadarProps) {
  // Take top 8 skills by level for the radar
  const data = skills
    .slice()
    .sort((a, b) => b.level - a.level)
    .slice(0, 8)
    .map((s) => ({ subject: s.name, level: Math.round(s.level) }));

  const isEmpty = data.length === 0;

  return (
    <section
      id="skill-radar"
      aria-label="Skill radar chart"
      className="rounded-2xl border border-border bg-card p-5 space-y-3"
    >
      <h2 className="text-sm font-semibold">Skill Radar</h2>

      {isEmpty ? (
        <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
          Skill analysis will appear after your first sync.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={data}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            />
            <Radar
              name="Level"
              dataKey="level"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.25}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}
