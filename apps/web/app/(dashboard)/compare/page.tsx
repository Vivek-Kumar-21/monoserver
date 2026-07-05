import type { Metadata } from 'next';
import { SearchBar } from '@/components/shared/SearchBar';

export const metadata: Metadata = { title: 'Compare Developers' };

export default function ComparePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Compare Developers</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Benchmark yourself against peers on GitHub activity and Codeforces rating.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="compare-user-a" className="text-sm font-medium">
            Developer A
          </label>
          <SearchBar id="compare-user-a" placeholder="GitHub handle…" />
        </div>
        <div className="space-y-2">
          <label htmlFor="compare-user-b" className="text-sm font-medium">
            Developer B
          </label>
          <SearchBar id="compare-user-b" placeholder="GitHub handle…" />
        </div>
      </div>

      {/* Comparison panel — populated client-side via React Query */}
      <div
        id="compare-results-panel"
        className="rounded-2xl border border-border bg-card p-8 min-h-[300px] flex items-center justify-center"
      >
        <p className="text-muted-foreground text-sm">
          Enter two GitHub handles above to start comparing.
        </p>
      </div>
    </div>
  );
}
