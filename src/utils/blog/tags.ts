interface BlogTagConfig {
  slug: string;
  name: string;
}

/**
 * Tags for blog posts.
 */
export const blogTags = [
  { slug: 'devops', name: 'DevOps' },
  { slug: 'gotchas', name: 'Gotchas' },
  { slug: 'react', name: 'React' },
  { slug: 'docker', name: 'Docker' },
  { slug: 'github', name: 'GitHub' },
  { slug: 'nextjs', name: 'Next.js' },
  { slug: 'fun', name: 'Fun' },
] as const satisfies BlogTagConfig[];
