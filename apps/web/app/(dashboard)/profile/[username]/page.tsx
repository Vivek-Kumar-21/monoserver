import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { users, githubStats, codeforcesStats } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { SkillBadge } from '@/components/shared/SkillBadge';
import { RatingChart } from '@/components/dashboard/RatingChart';
import { ActivityHeatmap } from '@/components/dashboard/ActivityHeatmap';
import { getCFRankColor } from '@bamblu/utils';

interface ProfilePageProps {
  params: { username: string };
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  return { title: `@${params.username}` };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = params;

  const user = await db.query.users.findFirst({
    where: eq(users.githubHandle, username),
    with: { skills: true },
  });

  if (!user) notFound();

  const [ghStats, cfStats] = await Promise.all([
    db.query.githubStats.findFirst({
      where: eq(githubStats.userId, user.id),
      orderBy: desc(githubStats.snapshotAt),
    }),
    db.query.codeforcesStats.findFirst({
      where: eq(codeforcesStats.userId, user.id),
      orderBy: desc(codeforcesStats.snapshotAt),
    }),
  ]);

  const cfRankColor = getCFRankColor(cfStats?.rank ?? '');

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-6">
        <UserAvatar
          id="profile-avatar"
          src={user.image}
          name={user.name ?? username}
          size="lg"
        />
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{user.name ?? username}</h1>
          <p className="text-muted-foreground">@{username}</p>
          {cfStats && (
            <span
              id="profile-cf-rank-badge"
              className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full border"
              style={{ color: cfRankColor, borderColor: cfRankColor }}
            >
              {cfStats.rank} · {cfStats.rating}
            </span>
          )}
        </div>
        {/* Embeddable card link */}
        <div className="ml-auto">
          <a
            id="profile-embed-link"
            href={`/api/card/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
          >
            Get embed card ↗
          </a>
        </div>
      </div>

      {/* Heatmap */}
      <ActivityHeatmap heatmapData={ghStats?.contributionHeatmap as Record<string, number> | undefined} />

      {/* Rating chart */}
      {cfStats && (
        <RatingChart ratingHistory={(cfStats.ratingHistory as object[] | null) ?? []} />
      )}

      {/* Skills */}
      {user.skills && user.skills.length > 0 && (
        <section aria-label="Skills">
          <h2 className="text-lg font-semibold mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill) => (
              <SkillBadge key={skill.id} skill={skill} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
