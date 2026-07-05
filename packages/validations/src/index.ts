import { z } from 'zod';

// ─── User ────────────────────────────────────────────────────────────────────

export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1).max(100).optional(),
  githubHandle: z
    .string()
    .regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/, 'Invalid GitHub handle')
    .optional(),
  codeforcesHandle: z
    .string()
    .min(3)
    .max(24)
    .regex(/^[a-zA-Z0-9._-]+$/, 'Invalid Codeforces handle')
    .optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = CreateUserSchema.partial();
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

// ─── Sync ─────────────────────────────────────────────────────────────────────

export const SyncRequestSchema = z.object({
  sources: z.array(z.enum(['github', 'codeforces'])).min(1),
  force: z.boolean().default(false),
});

export type SyncRequestInput = z.infer<typeof SyncRequestSchema>;

// ─── Activity ─────────────────────────────────────────────────────────────────

export const ActivityQuerySchema = z.object({
  userId: z.string().uuid(),
  source: z.enum(['github', 'codeforces', 'all']).default('all'),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export type ActivityQueryInput = z.infer<typeof ActivityQuerySchema>;

// ─── Roadmap ──────────────────────────────────────────────────────────────────

export const GenerateRoadmapSchema = z.object({
  targetRole: z.string().min(2).max(100),
  targetCompanies: z.array(z.string()).min(1).max(10),
  timeframeWeeks: z.number().int().min(4).max(52).default(12),
});

export type GenerateRoadmapInput = z.infer<typeof GenerateRoadmapSchema>;

export const UpdateRoadmapStepSchema = z.object({
  stepId: z.string().uuid(),
  status: z.enum(['not_started', 'in_progress', 'completed', 'skipped']),
});

export type UpdateRoadmapStepInput = z.infer<typeof UpdateRoadmapStepSchema>;

// ─── Compare ──────────────────────────────────────────────────────────────────

export const CompareQuerySchema = z.object({
  userA: z.string().min(1),
  userB: z.string().min(1),
});

export type CompareQueryInput = z.infer<typeof CompareQuerySchema>;

// ─── Card ─────────────────────────────────────────────────────────────────────

export const CardParamsSchema = z.object({
  handle: z.string().min(1).max(39),
  theme: z.enum(['dark', 'light', 'ocean', 'forest']).default('dark'),
  show: z
    .string()
    .transform((s) => s.split(','))
    .pipe(
      z.array(z.enum(['github', 'codeforces', 'skills', 'streak']))
    )
    .default('github,codeforces,skills'),
});

export type CardParamsInput = z.infer<typeof CardParamsSchema>;

// ─── Environment ──────────────────────────────────────────────────────────────

export const EnvSchema = z.object({
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 chars'),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  CODEFORCES_API_KEY: z.string().optional(),
  CODEFORCES_API_SECRET: z.string().optional(),
  CRON_SECRET: z.string().min(1),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export type Env = z.infer<typeof EnvSchema>;
