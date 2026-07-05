// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  githubHandle: string | null;
  codeforcesHandle: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  githubStats: GitHubStats | null;
  codeforcesStats: CodeforcesStats | null;
  skills: Skill[];
}

// ─── GitHub ───────────────────────────────────────────────────────────────────

export interface GitHubStats {
  totalCommits: number;
  totalPRs: number;
  totalStars: number;
  totalRepos: number;
  topLanguages: LanguageStat[];
  contributionStreak: number;
  lastSyncedAt: Date;
}

export interface GitHubActivity {
  id: string;
  userId: string;
  repo: string;
  activityType: 'commit' | 'pr_open' | 'pr_merge' | 'issue' | 'review';
  message: string | null;
  url: string;
  occurredAt: Date;
}

export interface LanguageStat {
  language: string;
  linesOfCode: number;
  percentage: number;
  color: string | null;
}

// ─── Codeforces ──────────────────────────────────────────────────────────────

export interface CodeforcesStats {
  handle: string;
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
  solvedCount: number;
  contestCount: number;
  lastSyncedAt: Date;
}

export interface CodeforcesActivity {
  id: string;
  userId: string;
  contestId: number | null;
  problemId: string;
  verdict: 'AC' | 'WA' | 'TLE' | 'MLE' | 'RE' | 'CE' | 'SK' | 'PARTIAL';
  difficulty: number | null;
  tags: string[];
  language: string;
  occurredAt: Date;
}

export interface RatingHistory {
  contestId: number;
  contestName: string;
  rank: number;
  ratingChange: number;
  newRating: number;
  ratedAt: Date;
}

// ─── Skills ───────────────────────────────────────────────────────────────────

export type SkillCategory =
  | 'Data Structures'
  | 'Algorithms'
  | 'System Design'
  | 'Languages'
  | 'Frameworks'
  | 'DevOps'
  | 'Database';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number; // 0-100
  trend: 'rising' | 'stable' | 'declining';
  evidenceSources: ('github' | 'codeforces')[];
}

export interface SkillGap {
  skill: string;
  category: SkillCategory;
  currentLevel: number;
  requiredLevel: number;
  demandScore: number; // 0-100 based on job postings
}

// ─── Roadmap ──────────────────────────────────────────────────────────────────

export type RoadmapStatus = 'not_started' | 'in_progress' | 'completed' | 'skipped';

export interface RoadmapStep {
  id: string;
  order: number;
  title: string;
  description: string;
  estimatedHours: number;
  resourceUrls: string[];
  status: RoadmapStatus;
  completedAt: Date | null;
}

export interface Roadmap {
  id: string;
  userId: string;
  title: string;
  targetRole: string;
  targetCompanies: string[];
  steps: RoadmapStep[];
  generatedAt: Date;
  completionPercent: number;
}

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  requiredSkills: string[];
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  postedAt: Date;
  url: string;
  source: string;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

// ─── Sync ─────────────────────────────────────────────────────────────────────

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export interface SyncState {
  github: SyncStatus;
  codeforces: SyncStatus;
  lastSyncedAt: Date | null;
}
