import { db } from '@/lib/db';
import { githubActivity, codeforcesActivity } from '@/lib/db/schema';
import { eq, desc, and, gte } from 'drizzle-orm';
import { subDays } from 'date-fns';

/**
 * Service for handling business logic around activity data.
 */
export const activityService = {
  /**
   * Calculates the current activity streak based on GitHub contributions.
   */
  async calculateStreak(userId: string): Promise<number> {
    const activities = await db.query.githubActivity.findMany({
      where: and(
        eq(githubActivity.userId, userId),
        gte(githubActivity.occurredAt, subDays(new Date(), 365)) // Look back 1 year
      ),
      orderBy: desc(githubActivity.occurredAt),
      columns: { occurredAt: true },
    });

    if (activities.length === 0) return 0;

    const uniqueDates = new Set(
      activities.map((a) => new Date(a.occurredAt).toDateString())
    );

    let streak = 0;
    let currentDate = new Date();

    // Check today or yesterday as starting point for active streak
    let activeDate = new Date(currentDate);
    if (!uniqueDates.has(activeDate.toDateString())) {
      activeDate.setDate(activeDate.getDate() - 1);
    }

    while (uniqueDates.has(activeDate.toDateString())) {
      streak++;
      activeDate.setDate(activeDate.getDate() - 1);
    }

    return streak;
  },
};
