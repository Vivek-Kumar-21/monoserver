/**
 * lib/validations/index.ts
 *
 * Named re-exports of all API-layer Zod validation schemas.
 * Using named exports (instead of export *) avoids ambiguity with
 * the shared `@bamblu/validations` package which lives in the same
 * TypeScript project via path aliases.
 */

// ─── Auth ─────────────────────────────────────────────────────────────────────
export {
  CallbackQuerySchema,
  UpdateProfileSchema,
  type CallbackQuery,
  type UpdateProfileInput,
} from './auth';

// ─── Sync ─────────────────────────────────────────────────────────────────────
export {
  SyncBodySchema,
  CronSyncBodySchema,
  type SyncBody,
  type CronSyncBody,
} from './sync';

// ─── Activity ─────────────────────────────────────────────────────────────────
export {
  ActivityRouteQuerySchema,
  type ActivityRouteQuery,
} from './activity';

// ─── Roadmap ──────────────────────────────────────────────────────────────────
export {
  GenerateRoadmapBodySchema,
  UpdateRoadmapStepBodySchema,
  RoadmapQuerySchema,
  type GenerateRoadmapBody,
  type UpdateRoadmapStepBody,
  type RoadmapQuery,
} from './roadmap';

// ─── Card ─────────────────────────────────────────────────────────────────────
export {
  CardQuerySchema,
  CardRouteParamsSchema,
  type CardQuery,
  type CardRouteParams,
} from './card';

// ─── Stats ────────────────────────────────────────────────────────────────────
export {
  StatsQuerySchema,
  UserIdParamSchema,
  type StatsQuery,
  type UserIdParam,
} from './stats';
