'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface RatingPoint {
  contestId: number;
  contestName: string;
  rank: number;
  ratingChange: number;
  newRating: number;
  ratedAt: string;
}

interface RatingChartProps {
  ratingHistory: object[];
}

export function RatingChart({ ratingHistory }: RatingChartProps) {
  const data = (ratingHistory as RatingPoint[]).map((point) => ({
    ...point,
    date: format(new Date(Number(point.ratedAt) * 1000), 'MMM d, yy'),
    rating: point.newRating,
  }));

  const isEmpty = data.length === 0;

  return (
    <section
      id="rating-chart"
      aria-label="Codeforces rating history"
      className="rounded-2xl border border-border bg-card p-5 space-y-3"
    >
      <h2 className="text-sm font-semibold">CF Rating History</h2>

      {isEmpty ? (
        <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
          No rating history yet. Participate in Codeforces contests!
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number, _name: string, props) => {
                const payload = (props as { payload?: RatingPoint & { rating: number } }).payload;
                const change = payload?.ratingChange ?? 0;
                return [`${value} (${change >= 0 ? '+' : ''}${change})`, 'Rating'] as [string, string];
              }}
              labelFormatter={(label) => label}
            />
            <Line
              type="monotone"
              dataKey="rating"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 3, fill: 'hsl(var(--primary))' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}
