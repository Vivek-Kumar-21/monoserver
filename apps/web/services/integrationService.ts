import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getGitHubUser, getGitHubRepos } from '@/lib/integrations/github';
import { getCFUser, getCFSubmissions } from '@/lib/integrations/codeforces';

/**
 * Service orchestrating syncing of external platforms.
 */
export const integrationService = {
  async syncGitHub(userId: string): Promise<void> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { githubHandle: true },
    });

    if (!user?.githubHandle) throw new Error('No GitHub handle connected');

    // Fetch data using the GitHub integration
    const ghUser = await getGitHubUser(user.githubHandle);
    const ghRepos = await getGitHubRepos(user.githubHandle);

    // TODO: Phase 2 - Update DB tables (githubActivity, githubStats) based on fetched data
    console.log(`Fetched ${ghUser.login} and ${ghRepos.length} repos`);
  },

  async syncCodeforces(userId: string): Promise<void> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { codeforcesHandle: true },
    });

    if (!user?.codeforcesHandle) throw new Error('No Codeforces handle connected');

    const cfUser = await getCFUser(user.codeforcesHandle);
    const submissions = await getCFSubmissions(user.codeforcesHandle);

    // TODO: Phase 2 - Update DB tables (codeforcesActivity, codeforcesStats)
    console.log(`Fetched ${cfUser.handle} and ${submissions.length} submissions`);
  },
};
