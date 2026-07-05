import { z } from 'zod';

// ─── POST /api/sync ────────────────────────────────────────────────────────────

export const SyncBodySchema = z.object({
  sources: z.array(z.enum(['github', 'codeforces'])).min(1, {
    message: 'At least one sync source is required',
  }),
  force: z.boolean().default(false),
});

export type SyncBody = z.infer<typeof SyncBodySchema>;

// ─── Cron Job Body (POST /api/jobs/sync-activity) ────────────────────────────

export const CronSyncBodySchema = z.object({
  /** Secret set in Vercel Cron configuration to authenticate the call */
  secret: z.string().min(1),
  sources: z.array(z.enum(['github', 'codeforces'])).default(['github', 'codeforces']),
  limit: z.number().int().positive().max(1000).default(100),
});

export type CronSyncBody = z.infer<typeof CronSyncBodySchema>;
