'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DifficultyChartProps {
  data: { difficulty: string; count: number }[];
}

const COLORS = {
  '< 800': '#808080',
  '800–1000': '#008000',
  '1000–1200': '#008000',
  '1200–1400': '#03a89e',
  '1400–1600': '#03a89e',
  '1600–1800': '#0000ff',
  '1800–2000': '#aa00aa',
  '2000+': '#ff8c00',
};

export function DifficultyChart({ data }: DifficultyChartProps) {
  const isEmpty = data.length === 0 || data.every(d => d.count === 0);

  return (
    <section
      id="difficulty-chart"
      aria-label="Problems solved by difficulty"
      className="rounded-2xl border border-border bg-card p-5 space-y-3"
    >
      <h2 className="text-sm font-semibold">Difficulty Distribution</h2>

      {isEmpty ? (
        <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
          No problem data available.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="difficulty"
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={40}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [value, 'Solved']}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.difficulty as keyof typeof COLORS] || 'hsl(var(--primary))'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}
