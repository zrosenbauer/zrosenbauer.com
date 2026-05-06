import type { Project } from '@content';

export type ProjectWithStars = {
  project: Project;
  stars: number | null;
};

const GITHUB_API = 'https://api.github.com';

const headers = (): HeadersInit => {
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
  const base: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'zrosenbauer.com-build',
  };
  if (token) base.Authorization = `Bearer ${token}`;
  return base;
};

const fetchStars = async (repository: string): Promise<number | null> => {
  const [owner, repo] = repository.split('/');
  if (!owner || !repo) return null;
  try {
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, {
      headers: headers(),
      cache: 'force-cache',
    });
    if (!res.ok) {
      console.warn(`[github] ${repository}: ${res.status} ${res.statusText}`);
      return null;
    }
    const data = (await res.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === 'number' ? data.stargazers_count : null;
  } catch (err) {
    console.warn(`[github] ${repository} failed:`, err);
    return null;
  }
};

export const fetchProjectsWithStars = async (
  projects: ReadonlyArray<Project>
): Promise<ProjectWithStars[]> =>
  Promise.all(
    projects.map(async (project) => ({
      project,
      stars: await fetchStars(project.repository),
    }))
  );

export const formatStars = (n: number): string =>
  Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
