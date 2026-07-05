import { z } from 'zod';

// ─── Auth Callback Query ───────────────────────────────────────────────────────

export const CallbackQuerySchema = z.object({
  callbackUrl: z.string().optional(),
  error: z.string().optional(),
  code: z.string().optional(),
  state: z.string().optional(),
});

export type CallbackQuery = z.infer<typeof CallbackQuerySchema>;

// ─── Settings Update ──────────────────────────────────────────────────────────

export const UpdateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  githubHandle: z
    .string()
    .regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/)
    .optional()
    .or(z.literal('')),
  codeforcesHandle: z
    .string()
    .min(3)
    .max(24)
    .regex(/^[a-zA-Z0-9._-]+$/)
    .optional()
    .or(z.literal('')),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
