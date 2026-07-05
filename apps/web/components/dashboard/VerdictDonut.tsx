'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface VerdictDonutProps {
  userId: string;
}

const COLORS = {
  AC: '#00d084',  // bamblu-green
  WA: '#f43f5e',  // rose-500
  TLE: '#f97316', // bamblu-orange
  MLE: '#8b5cf6', // violet-500
  RE: '#eab308',  // yellow-500
  CE: '#64748b',  // slate-500
  SK: '#94a3b8',  // slate-400
  PARTIAL: '#0ea5e9' // sky-500
};

// Dummy data for now, ideally fetched via useQuery
const mockData = [
  { name: 'AC', value: 120 },
  { name: 'WA', value: 45 },
  { name: 'TLE', value: 12 },
  { name: 'RE', value: 5 },
];

export function VerdictDonut({ userId }: VerdictDonutProps) {
  // TODO: Fetch real verdict counts for `userId`
  
  return (
    <section
      id="verdict-donut"
      aria-label="Codeforces verdict distribution"
      className="rounded-2xl border border-border bg-card p-5 space-y-3"
    >
      <h2 className="text-sm font-semibold">Verdict Distribution</h2>
      
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={mockData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {mockData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#64748b'} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            wrapperStyle={{ fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </section>
  );
}
