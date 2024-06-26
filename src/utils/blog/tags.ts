import { IconProps } from '@components/ui/icon';

export interface BlogTagConfig {
  slug: string;
  name: string;
  icon: IconProps['name'];
}

/**
 * Tags for blog posts.
 */
export const blogTags = [
  { slug: 'devops', name: 'DevOps', icon: 'tools' },
  { slug: 'gotchas', name: 'Gotchas', icon: 'exclamation-circle' },
  { slug: 'react', name: 'React', icon: 'brand-react' },
  { slug: 'docker', name: 'Docker', icon: 'brand-docker' },
  { slug: 'github', name: 'GitHub', icon: 'brand-github' },
  { slug: 'nextjs', name: 'Next.js', icon: 'brand-nextjs' },
  { slug: 'fun', name: 'Fun', icon: 'building-carousel' },
] as const satisfies BlogTagConfig[];

export type BlogTagSlug = (typeof blogTags)[number]['slug'];

/**
 * Get a blog tag by its slug.
 *
 * @param slug The slug of the tag.
 */
export const getBlogTagBySlug = (slug: BlogTagSlug): BlogTagConfig => {
  const result = blogTags.find((tag) => tag.slug === slug);

  if (!result) {
    throw new Error(`Tag not found: ${slug}`);
  }

  return result;
};
