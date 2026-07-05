import { z } from 'zod';

// ─── GET /api/users/[id]/stats ────────────────────────────────────────────────

export const StatsQuerySchema = z.object({
  /** Which platform stats to fetch */
  source: z.enum(['github', 'codeforces', 'all']).default('all'),
  /** Return the latest snapshot only (default) or a range */
  range: z.enum(['latest', '7d', '30d', '90d', '1y']).default('latest'),
});

export type StatsQuery = z.infer<typeof StatsQuerySchema>;

export const UserIdParamSchema = z.object({
  id: z.string().uuid({ message: 'id must be a valid UUID' }),
});

export type UserIdParam = z.infer<typeof UserIdParamSchema>;
