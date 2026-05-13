import { allBlogPosts } from '@content';

/**
 * Blog posts whose `publishedAt` date has arrived. Future-dated posts are excluded
 * from the site at build time, then surfaced on their scheduled date when the
 * daily deploy cron rebuilds.
 *
 * Every route, RSS/llms feed, and TUI listing should import this instead of
 * `allBlogPosts` directly. Using `allBlogPosts` anywhere user-facing leaks
 * scheduled drafts onto the live site.
 */
export const publishedBlogPosts = allBlogPosts.filter(
  (post) => new Date(post.publishedAt).getTime() <= Date.now()
);
