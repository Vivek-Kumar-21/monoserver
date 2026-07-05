/**
 * Codeforces API integration.
 * Codeforces exposes a public REST API — no auth required for most endpoints.
 * Docs: https://codeforces.com/apiHelp
 *
 * Rate limit: ~1 req/sec. We add jitter delays for batch requests.
 */

const CF_API = 'https://codeforces.com/api';

// ─── API Response Shapes ──────────────────────────────────────────────────────

interface CFApiResponse<T> {
  status: 'OK' | 'FAILED';
  comment?: string;
  result: T;
}

export interface CFUser {
  handle: string;
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
  avatar: string;
  titlePhoto: string;
  contribution: number;
}

export interface CFSubmission {
  id: number;
  contestId?: number;
  problem: {
    contestId?: number;
    index: string;
    name: string;
    rating?: number;
    tags: string[];
  };
  verdict: 'OK' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 'MEMORY_LIMIT_EXCEEDED' | 'RUNTIME_ERROR' | 'COMPILATION_ERROR' | 'SKIPPED' | 'PARTIAL';
  programmingLanguage: string;
  timeConsumedMillis: number;
  memoryConsumedBytes: number;
  creationTimeSeconds: number;
}

export interface CFRatingChange {
  contestId: number;
  contestName: string;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

// ─── Verdict Normalization ────────────────────────────────────────────────────

const VERDICT_MAP: Record<string, 'AC' | 'WA' | 'TLE' | 'MLE' | 'RE' | 'CE' | 'SK' | 'PARTIAL'> =
  {
    OK: 'AC',
    WRONG_ANSWER: 'WA',
    TIME_LIMIT_EXCEEDED: 'TLE',
    MEMORY_LIMIT_EXCEEDED: 'MLE',
    RUNTIME_ERROR: 'RE',
    COMPILATION_ERROR: 'CE',
    SKIPPED: 'SK',
    PARTIAL: 'PARTIAL',
  };

export function normalizeVerdict(
  raw: string
): 'AC' | 'WA' | 'TLE' | 'MLE' | 'RE' | 'CE' | 'SK' | 'PARTIAL' {
  return VERDICT_MAP[raw] ?? 'WA';
}

// ─── API Fetchers ─────────────────────────────────────────────────────────────

async function cfFetch<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${CF_API}${endpoint}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Codeforces API HTTP error: ${res.status}`);
  }

  const data = (await res.json()) as CFApiResponse<T>;

  if (data.status !== 'OK') {
    throw new Error(`Codeforces API error: ${data.comment ?? 'Unknown error'}`);
  }

  return data.result;
}

export async function getCFUser(handle: string): Promise<CFUser> {
  const users = await cfFetch<CFUser[]>(`/user.info?handles=${encodeURIComponent(handle)}`);
  const user = users[0];
  if (!user) throw new Error(`Codeforces user not found: ${handle}`);
  return user;
}

export async function getCFSubmissions(
  handle: string,
  count = 500
): Promise<CFSubmission[]> {
  return cfFetch<CFSubmission[]>(
    `/user.status?handle=${encodeURIComponent(handle)}&from=1&count=${count}`
  );
}

export async function getCFRatingHistory(handle: string): Promise<CFRatingChange[]> {
  return cfFetch<CFRatingChange[]>(
    `/user.rating?handle=${encodeURIComponent(handle)}`
  );
}

// ─── Aggregators ──────────────────────────────────────────────────────────────

/** Returns unique solved problem IDs (only AC submissions). */
export function getUniqueSolvedProblems(submissions: CFSubmission[]): Set<string> {
  const solved = new Set<string>();
  for (const sub of submissions) {
    if (sub.verdict === 'OK') {
      const key = `${sub.contestId ?? 'gym'}-${sub.problem.index}`;
      solved.add(key);
    }
  }
  return solved;
}

/** Groups AC submissions by difficulty bucket for the DifficultyChart. */
export function groupByDifficulty(
  submissions: CFSubmission[]
): { difficulty: string; count: number }[] {
  const buckets: Record<string, number> = {
    '< 800': 0,
    '800–1000': 0,
    '1000–1200': 0,
    '1200–1400': 0,
    '1400–1600': 0,
    '1600–1800': 0,
    '1800–2000': 0,
    '2000+': 0,
  };

  for (const sub of submissions) {
    if (sub.verdict !== 'OK' || sub.problem.rating === undefined) continue;
    const r = sub.problem.rating;
    if (r < 800) buckets['< 800']++;
    else if (r <= 1000) buckets['800–1000']++;
    else if (r <= 1200) buckets['1000–1200']++;
    else if (r <= 1400) buckets['1200–1400']++;
    else if (r <= 1600) buckets['1400–1600']++;
    else if (r <= 1800) buckets['1600–1800']++;
    else if (r <= 2000) buckets['1800–2000']++;
    else buckets['2000+']++;
  }

  return Object.entries(buckets).map(([difficulty, count]) => ({ difficulty, count }));
}

/** Returns tag frequency map for skills inference. */
export function getTagFrequency(submissions: CFSubmission[]): Record<string, number> {
  const freq: Record<string, number> = {};
  for (const sub of submissions) {
    if (sub.verdict !== 'OK') continue;
    for (const tag of sub.problem.tags) {
      freq[tag] = (freq[tag] ?? 0) + 1;
    }
  }
  return freq;
}
