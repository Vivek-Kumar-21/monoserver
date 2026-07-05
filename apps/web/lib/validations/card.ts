import { z } from 'zod';

// ─── GET /api/card/[handle] ───────────────────────────────────────────────────

export const CardQuerySchema = z.object({
  theme: z.enum(['dark', 'light', 'ocean', 'forest']).default('dark'),
  /**
   * Comma-separated list of sections to include.
   * e.g. ?show=github,codeforces,skills
   */
  show: z
    .string()
    .transform((s) => s.split(',').map((x) => x.trim()))
    .pipe(
      z.array(z.enum(['github', 'codeforces', 'skills', 'streak']))
    )
    .default('github,codeforces,skills'),
  /** Override card width in pixels (100–1200) */
  width: z.coerce.number().int().min(100).max(1200).default(600),
});

export type CardQuery = z.infer<typeof CardQuerySchema>;

// NOTE: Named CardRouteParamsSchema (not CardParamsSchema) to avoid
// collision with the identically-named export in @bamblu/validations.
export const CardRouteParamsSchema = z.object({
  handle: z
    .string()
    .min(1)
    .max(39)
    .regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/),
});

export type CardRouteParams = z.infer<typeof CardRouteParamsSchema>;
