'use client';

import { useInfiniteActivity } from '@/hooks/useInfiniteActivity';
import { timeAgo, getCFRankColor } from '@bamblu/utils';
import { GitCommit, GitPullRequest, MessageSquare, Code, AlertCircle } from 'lucide-react';
import { Fragment } from 'react';

interface ActivityFeedProps {
  userId: string;
}

const GH_ICONS = {
  commit: GitCommit,
  pr_open: GitPullRequest,
  pr_merge: GitPullRequest,
  issue: AlertCircle,
  review: MessageSquare,
};

export function ActivityFeed({ userId }: ActivityFeedProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteActivity(userId, 'all');

  if (status === 'pending') {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading activity...</div>;
  }

  if (status === 'error') {
    return <div className="p-8 text-center text-destructive">Failed to load activity.</div>;
  }

  const items = data.pages.flatMap((page) => page.items);

  if (items.length === 0) {
    return (
      <section className="rounded-2xl border border-border bg-card p-5 h-full">
        <h2 className="text-sm font-semibold mb-4">Recent Activity</h2>
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          No activity found. Connect your accounts to see events here.
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5 h-full max-h-[600px] flex flex-col">
      <h2 className="text-sm font-semibold mb-4 shrink-0">Recent Activity</h2>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {items.map((item, i) => {
          const isGitHub = item._source === 'github';
          
          return (
            <div key={`${item.id}-${i}`} className="flex gap-3 items-start animate-fade-in text-sm">
              <div className="mt-0.5 shrink-0">
                {isGitHub ? (
                  <div className="w-8 h-8 rounded-full bg-[#24292e]/10 flex items-center justify-center">
                    {(() => {
                      const Icon = GH_ICONS[(item as any).activityType as keyof typeof GH_ICONS] || GitCommit;
                      return <Icon className="w-4 h-4 text-foreground/70" />;
                    })()}
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Code className="w-4 h-4 text-blue-500" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                {isGitHub ? (
                  <>
                    <p className="text-foreground">
                      <span className="font-medium">GitHub</span>: {(item as any).activityType.replace('_', ' ')} in{' '}
                      <a href={(item as any).url} target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">
                        {(item as any).repo}
                      </a>
                    </p>
                    {(item as any).message && <p className="text-muted-foreground truncate">{(item as any).message}</p>}
                  </>
                ) : (
                  <>
                    <p className="text-foreground">
                      <span className="font-medium">Codeforces</span>:{' '}
                      <span
                        className="font-semibold"
                        style={{ color: (item as any).verdict === 'AC' ? '#00d084' : '#f43f5e' }}
                      >
                        {(item as any).verdict}
                      </span>{' '}
                      on {(item as any).problemId}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>{(item as any).language}</span>
                      {/* {item.difficulty && <span>• Rating: {item.difficulty}</span>} */}
                    </div>
                  </>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {timeAgo(new Date(item.occurredAt))}
                </p>
              </div>
            </div>
          );
        })}
        
        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="w-full py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {isFetchingNextPage ? 'Loading more...' : 'Load more activity'}
          </button>
        )}
      </div>
    </section>
  );
}
