import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Growth Roadmap' };

export default function RoadmapPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Growth Roadmap</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your personalized SDE interview prep plan based on real job market demand.
        </p>
      </div>

      {/* Generate form */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Generate a Roadmap</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="roadmap-target-role" className="text-sm font-medium">
              Target Role
            </label>
            <input
              id="roadmap-target-role"
              type="text"
              placeholder="e.g. Software Engineer II"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="roadmap-target-companies" className="text-sm font-medium">
              Target Companies
            </label>
            <input
              id="roadmap-target-companies"
              type="text"
              placeholder="Google, Meta, Amazon…"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
        <button
          id="roadmap-generate-btn"
          type="button"
          className="rounded-xl bg-primary text-primary-foreground font-medium px-5 py-2.5 text-sm hover:bg-primary/90 transition-colors"
        >
          Generate Roadmap →
        </button>
      </div>

      {/* Roadmap steps — populated by client component */}
      <div id="roadmap-steps-container" className="space-y-3" />
    </div>
  );
}
