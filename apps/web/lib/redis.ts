import { Redis } from '@upstash/redis';

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('Missing Upstash Redis environment variables');
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// ─── Cache Key Factories ──────────────────────────────────────────────────────

export const cacheKeys = {
  userStats: (userId: string) => `bamblu:stats:${userId}` as const,
  userSkills: (userId: string) => `bamblu:skills:${userId}` as const,
  userRoadmap: (userId: string) => `bamblu:roadmap:${userId}` as const,
  cfStats: (handle: string) => `bamblu:cf:${handle}` as const,
  ghStats: (handle: string) => `bamblu:gh:${handle}` as const,
  card: (handle: string, theme: string) => `bamblu:card:${handle}:${theme}` as const,
  rateLimit: (ip: string) => `bamblu:rl:${ip}` as const,
  syncLock: (userId: string, source: string) => `bamblu:lock:sync:${userId}:${source}` as const,
} as const;

// ─── TTL Constants (seconds) ──────────────────────────────────────────────────

export const TTL = {
  SHORT: 60,           // 1 minute — live data
  MEDIUM: 5 * 60,     // 5 minutes — stats
  LONG: 60 * 60,      // 1 hour — card SVG, profile
  DAY: 24 * 60 * 60,  // 24 hours — expensive computations
} as const;

// ─── Typed Cache Helpers ──────────────────────────────────────────────────────

export async function getCache<T>(key: string): Promise<T | null> {
  return redis.get<T>(key);
}

export async function setCache<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  await redis.set(key, value, { ex: ttlSeconds });
}

export async function deleteCache(key: string): Promise<void> {
  await redis.del(key);
}

/**
 * Acquires a distributed lock. Returns true if lock acquired.
 * Uses SET NX EX (atomic) to prevent race conditions on sync jobs.
 */
export async function acquireLock(key: string, ttlSeconds = 120): Promise<boolean> {
  const result = await redis.set(key, '1', { nx: true, ex: ttlSeconds });
  return result === 'OK';
}

export async function releaseLock(key: string): Promise<void> {
  await redis.del(key);
}
