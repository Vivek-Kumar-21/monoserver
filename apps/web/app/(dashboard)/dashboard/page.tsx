import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { githubStats, codeforcesStats, skills } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { StatCard } from '@/components/dashboard/StatCard';
import { ActivityHeatmap } from '@/components/dashboard/ActivityHeatmap';
import { RatingChart } from '@/components/dashboard/RatingChart';
import { SkillRadar } from '@/components/dashboard/SkillRadar';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { VerdictDonut } from '@/components/dashboard/VerdictDonut';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [ghStats, cfStats, userSkills] = await Promise.all([
    db.query.githubStats.findFirst({
      where: eq(githubStats.userId, userId),
      orderBy: desc(githubStats.snapshotAt),
    }),
    db.query.codeforcesStats.findFirst({
      where: eq(codeforcesStats.userId, userId),
      orderBy: desc(codeforcesStats.snapshotAt),
    }),
    db.query.skills.findMany({ where: eq(skills.userId, userId) }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your coding activity at a glance.
        </p>
      </div>

      {/* Stat Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="stat-gh-commits"
          label="GitHub Commits"
          value={ghStats?.totalCommits ?? 0}
          icon="git-commit"
        />
        <StatCard
          id="stat-gh-streak"
          label="Streak"
          value={`${ghStats?.contributionStreak ?? 0}d`}
          icon="flame"
        />
        <StatCard
          id="stat-cf-rating"
          label="CF Rating"
          value={cfStats?.rating ?? 0}
          icon="zap"
        />
        <StatCard
          id="stat-cf-solved"
          label="Problems Solved"
          value={cfStats?.solvedCount ?? 0}
          icon="check-circle"
        />
      </div>

      {/* Heatmap */}
      <ActivityHeatmap heatmapData={ghStats?.contributionHeatmap as Record<string, number> | undefined} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RatingChart ratingHistory={(cfStats?.ratingHistory as object[] | null) ?? []} />
        <SkillRadar skills={userSkills} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityFeed userId={userId} />
        </div>
        <VerdictDonut userId={userId} />
      </div>
    </div>
  );
}
