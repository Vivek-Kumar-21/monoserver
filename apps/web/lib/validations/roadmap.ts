import { z } from 'zod';

// ─── POST /api/roadmap ────────────────────────────────────────────────────────

export const GenerateRoadmapBodySchema = z.object({
  targetRole: z.string().min(2).max(100),
  targetCompanies: z.array(z.string().min(1).max(100)).min(1).max(10),
  timeframeWeeks: z.number().int().min(4).max(52).default(12),
});

export type GenerateRoadmapBody = z.infer<typeof GenerateRoadmapBodySchema>;

// ─── PATCH /api/roadmap ───────────────────────────────────────────────────────

export const UpdateRoadmapStepBodySchema = z.object({
  stepId: z.string().uuid(),
  status: z.enum(['not_started', 'in_progress', 'completed', 'skipped']),
});

export type UpdateRoadmapStepBody = z.infer<typeof UpdateRoadmapStepBodySchema>;

// ─── GET /api/roadmap query params ────────────────────────────────────────────

export const RoadmapQuerySchema = z.object({
  roadmapId: z.string().uuid().optional(),
  includeSteps: z.coerce.boolean().default(true),
});

export type RoadmapQuery = z.infer<typeof RoadmapQuerySchema>;
