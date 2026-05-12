interface BlogTagConfig {
  slug: string;
  name: string;
}

/**
 * Tags for blog posts.
 */
export const blogTags = [
  { slug: 'devops', name: 'DevOps' },
  { slug: 'typescript', name: 'TypeScript' },
  { slug: 'javascript', name: 'JavaScript' },
  { slug: 'node', name: 'Node.js' },
  { slug: 'react', name: 'React' },
  { slug: 'rust', name: 'Rust' },
  { slug: 'ai', name: 'AI' },
  { slug: 'dx', name: 'DX' },
  { slug: 'gotchas', name: 'Gotchas' },
  { slug: 'fun', name: 'Fun' },
] as const satisfies BlogTagConfig[];
