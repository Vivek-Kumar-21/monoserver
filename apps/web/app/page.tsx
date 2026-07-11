const STATS = [
  { label: 'Problems Solved', value: '487' },
  { label: 'Active Days', value: '6' },
  { label: 'Contest Rating', value: '1603' },
  { label: 'GitHub Contrib.', value: '42' },
];

const RADAR_AXES = [
  { label: 'DP', angle: -90, value: 0.9 },
  { label: 'Graphs', angle: -30, value: 0.75 },
  { label: 'Greedy', angle: 30, value: 0.85 },
  { label: 'Binary Search', angle: 90, value: 0.9 },
  { label: 'Maths', angle: 150, value: 0.8 },
  { label: 'Strings', angle: 210, value: 0.7 },
];

const RADAR_CENTER = 100;
const RADAR_RADIUS = 75;

const toPoint = (angle: number, r: number) => {
  const rad = (angle * Math.PI) / 180;
  return {
    x: RADAR_CENTER + r * Math.cos(rad),
    y: RADAR_CENTER + r * Math.sin(rad),
  };
};

const RADAR_POINTS = RADAR_AXES.map((a) => toPoint(a.angle, RADAR_RADIUS * a.value))
  .map((p) => `${p.x},${p.y}`)
  .join(' ');

const RADAR_RINGS = [0.33, 0.66, 1].map((scale) =>
  RADAR_AXES.map((a) => toPoint(a.angle, RADAR_RADIUS * scale))
    .map((p) => `${p.x},${p.y}`)
    .join(' ')
);

const HEAT_COLORS = ['bg-slate-800', 'bg-cyan-900', 'bg-cyan-700', 'bg-cyan-500', 'bg-teal-500'];

const HEAT_GRID = [
  4, 2, 3, 0, 1, 2, 4,
  2, 4, 1, 0, 3, 1, 3,
  3, 0, 4, 1, 3, 4, 0,
  1, 3, 0, 3, 0, 2, 1,
  2, 4, 2, 0, 1, 2, 1,
  0, 2, 0, 3, 4, 1, 0,
];

export default function Home() {
  return (
    <main className="bg-[#0a0e17] min-h-screen flex items-center px-6 lg:px-20">
      <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto w-full py-16">
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
            Track your coding.
            <br />
            Know your skill.
            <br />
            Grow your career.
          </h1>
          <p className="text-gray-400 mt-6 max-w-md text-sm lg:text-base">
            Connect GitHub and Codeforces to get AI-powered insights and personalized roadmaps that help you grow faster.
          </p>
          <button className="mt-8 bg-cyan-400 hover:bg-cyan-300 transition text-black font-semibold px-6 py-3 rounded-lg">
            Get Started Free
          </button>
        </div>

        <div className="bg-[#0f1626] border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-4 gap-3">
            {STATS.map((s) => (
              <div key={s.label} className="bg-[#1a2233] rounded-lg p-3">
                <p className="text-gray-400 text-[11px] leading-tight">{s.label}</p>
                <p className="text-white text-lg font-semibold mt-1">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#131b2e] rounded-xl p-4 h-64">
              <h3 className="text-white text-sm font-medium mb-2">Skill Radar</h3>
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {RADAR_RINGS.map((points, i) => (
                  <polygon key={i} points={points} fill="none" stroke="#2a3548" strokeWidth="1" />
                ))}
                {RADAR_AXES.map((a, i) => {
                  const p = toPoint(a.angle, RADAR_RADIUS);
                  return (
                    <line key={i} x1={RADAR_CENTER} y1={RADAR_CENTER} x2={p.x} y2={p.y} stroke="#2a3548" strokeWidth="1" />
                  );
                })}
                <polygon points={RADAR_POINTS} fill="#22d3ee" fillOpacity="0.2" stroke="#22d3ee" strokeWidth="2" />
                {RADAR_AXES.map((a, i) => {
                  const p = toPoint(a.angle, RADAR_RADIUS + 14);
                  return (
                    <text key={i} x={p.x} y={p.y} fill="#6b7280" fontSize="8" textAnchor="middle" dominantBaseline="middle">
                      {a.label}
                    </text>
                  );
                })}
              </svg>
            </div>

            <div className="bg-[#131b2e] rounded-xl p-4 h-64">
              <h3 className="text-white text-sm font-medium mb-4">Activity Heatmap</h3>
              <div className="grid grid-cols-7 gap-1">
                {HEAT_GRID.map((v, i) => (
                  <div key={i} className={`aspect-square rounded-sm ${HEAT_COLORS[v]}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
