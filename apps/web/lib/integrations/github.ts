/**
 * GitHub REST API v3 integration.
 * Uses the user's OAuth access token (from NextAuth JWT) for authenticated requests.
 * Falls back to public API for unauthenticated reads (lower rate limits: 60 req/hr).
 */

const GH_API = 'https://api.github.com';

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

interface GitHubRepo {
  name: string;
  full_name: string;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
}

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: { date: string };
  };
  html_url: string;
  stats?: { additions: number; deletions: number };
}

interface GitHubEvent {
  type: string;
  repo: { name: string };
  payload: {
    commits?: { sha: string; message: string; url: string }[];
    pull_request?: { title: string; html_url: string; merged: boolean };
    issue?: { title: string; html_url: string };
  };
  created_at: string;
}

function buildHeaders(accessToken?: string): HeadersInit {
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
}

async function ghFetch<T>(path: string, accessToken?: string): Promise<T> {
  const res = await fetch(`${GH_API}${path}`, {
    headers: buildHeaders(accessToken),
    next: { revalidate: 300 }, // 5-min ISR cache
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(`GitHub API error ${res.status}: ${body.message ?? 'Unknown error'}`);
  }

  return res.json() as Promise<T>;
}

// ─── Public Fetchers ──────────────────────────────────────────────────────────

export async function getGitHubUser(handle: string, accessToken?: string): Promise<GitHubUser> {
  return ghFetch<GitHubUser>(`/users/${handle}`, accessToken);
}

export async function getGitHubRepos(handle: string, accessToken?: string): Promise<GitHubRepo[]> {
  const pages = await Promise.all(
    [1, 2, 3].map((page) =>
      ghFetch<GitHubRepo[]>(
        `/users/${handle}/repos?per_page=100&sort=updated&type=owner&page=${page}`,
        accessToken
      )
    )
  );
  return pages.flat().filter((r) => !r.fork);
}

export async function getGitHubEvents(handle: string, accessToken?: string): Promise<GitHubEvent[]> {
  return ghFetch<GitHubEvent[]>(
    `/users/${handle}/events/public?per_page=100`,
    accessToken
  );
}

export async function getGitHubContributions(
  handle: string,
  accessToken?: string
): Promise<GitHubCommit[]> {
  return ghFetch<{ items: GitHubCommit[] }>(
    `/search/commits?q=author:${handle}&sort=committer-date&per_page=100`,
    accessToken
  ).then((res) => res.items);
}

// ─── Aggregators ──────────────────────────────────────────────────────────────

export function aggregateLanguages(
  repos: GitHubRepo[]
): { language: string; count: number; percentage: number }[] {
  const counts: Record<string, number> = {};
  for (const repo of repos) {
    if (repo.language) {
      counts[repo.language] = (counts[repo.language] ?? 0) + 1;
    }
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([language, count]) => ({
      language,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }));
}
