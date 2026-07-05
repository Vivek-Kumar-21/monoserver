import { z } from 'zod';

// ─── GET /api/activity ────────────────────────────────────────────────────────
// NOTE: Named ActivityRouteQuerySchema (not ActivityQuerySchema) to avoid
// collision with the identically-named export in @bamblu/validations.
// This version is web-route-specific and includes the `acOnly` filter.

export const ActivityRouteQuerySchema = z.object({
  userId: z.string().uuid({ message: 'userId must be a valid UUID' }),
  source: z.enum(['github', 'codeforces', 'all']).default('all'),
  /** ISO date string — lower bound */
  from: z.coerce.date().optional(),
  /** ISO date string — upper bound */
  to: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  /** Only return items with verdict == AC (Codeforces only) */
  acOnly: z.coerce.boolean().default(false),
});

export type ActivityRouteQuery = z.infer<typeof ActivityRouteQuerySchema>;
