import { allBlogPosts, allDesigns, allProjects } from '@content';

export interface NavigatorItem {
  slug: string;
  label: string;
  href: string;
  description?: string;
  external?: boolean;
  /** When true, picking the item opens the in-terminal pager instead of navigating. */
  viewable?: boolean;
  /** Resolves the markdown content for the pager. Required when `viewable`. */
  getContent?: () => string;
}

export interface Navigator {
  /** Stable identifier (used for state machine + command name). */
  id: string;
  /** Command alias the user types — usually equals id. */
  name: string;
  /** One-line summary shown in `help`. */
  summary: string;
  /** Label shown in the prompt while in select mode (e.g. `blog [1-N] >`). */
  promptLabel: string;
  /** Message when the collection is empty. */
  emptyMessage?: string;
  /** Resolves the current set of items. Re-evaluated each call so updates flow through. */
  list: () => NavigatorItem[];
}

const sortedBlog = () =>
  [...allBlogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

/**
 * Convert raw HTML `<img src="…" alt="…" />` tags found in MDX bodies into
 * markdown image syntax so ReactMarkdown (with skipHtml) renders them.
 */
const normalizeMdImages = (raw: string): string =>
  raw.replace(/<img\s+([^>]*?)\/?>/gi, (_match, attrs: string) => {
    const src = attrs.match(/src\s*=\s*["']([^"']+)["']/i)?.[1];
    if (!src) return '';
    const alt = attrs.match(/alt\s*=\s*["']([^"']*)["']/i)?.[1] ?? '';
    return `![${alt}](${src})`;
  });

const blogPostBody = (post: (typeof allBlogPosts)[number]): string => {
  const meta: string[] = [
    new Date(post.publishedAt).toISOString().slice(0, 10),
    `${post.readTime} min read`,
    `@${post.authorGithubUsername}`,
  ];
  if (post.tags && post.tags.length > 0) meta.push(`tags: ${post.tags.join(', ')}`);
  const bannerLine = post.image ? `![${post.title}](${post.image})\n\n` : '';
  return [
    `# ${post.title}`,
    '',
    `_${meta.join(' · ')}_`,
    '',
    `> ${post.description}`,
    '',
    bannerLine,
    normalizeMdImages(post.body.raw.trim()),
    '',
  ].join('\n');
};

export const blogNavigator: Navigator = {
  id: 'blog',
  name: 'blog',
  summary: 'Browse blog posts',
  promptLabel: 'blog',
  emptyMessage: '(no posts yet — check back soon)',
  list: () =>
    sortedBlog().map((post) => ({
      slug: post.slug,
      label: post.title,
      href: post.path,
      description: post.description,
      viewable: true,
      getContent: () => blogPostBody(post),
    })),
};

export const projectsNavigator: Navigator = {
  id: 'projects',
  name: 'projects',
  summary: 'Browse projects',
  promptLabel: 'projects',
  emptyMessage: '(no projects)',
  list: () =>
    [...allProjects]
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((project) => ({
        slug: project.slug,
        label: project.title,
        href: `https://github.com/${project.repository}`,
        description: `${project.repository}${project.deprecated ? ' (deprecated)' : ''}`,
        external: true,
      })),
};

const designBody = (design: (typeof allDesigns)[number]): string =>
  [
    `# ${design.title}`,
    '',
    `> ${design.description}`,
    '',
    `![${design.title}](/img/designs/${design.slug}/banner.png)`,
    '',
    normalizeMdImages(design.body.raw.trim()),
    '',
  ].join('\n');

export const designsNavigator: Navigator = {
  id: 'designs',
  name: 'designs',
  summary: 'Browse design experiments',
  promptLabel: 'designs',
  emptyMessage: '(no designs)',
  list: () =>
    [...allDesigns]
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((design) => ({
        slug: design.slug,
        label: design.title,
        href: `/gui/designs/${design.slug}`,
        description: design.description,
        viewable: true,
        getContent: () => designBody(design),
      })),
};

/**
 * The full set of registered navigators. Adding a new section is just:
 *   1. Define a `Navigator` (or use `defineNavigator(...)`).
 *   2. Push it here.
 *   3. The shell automatically gets a new command + select-mode behavior.
 */
export const NAVIGATORS: ReadonlyArray<Navigator> = [
  blogNavigator,
  projectsNavigator,
  designsNavigator,
];

export const findNavigator = (id: string): Navigator | null =>
  NAVIGATORS.find((n) => n.id === id) ?? null;

/**
 * Every URL slug under `/tui/` that maps to a viewable pager state.
 * Singletons (about, contact) plus every navigator item with `viewable: true`.
 */
export const VIEWABLE_TUI_SLUGS: ReadonlyArray<string> = [
  'about',
  'contact',
  ...NAVIGATORS.flatMap((nav) =>
    nav
      .list()
      .filter((item) => item.viewable && item.getContent)
      .map((item) => `${nav.id}/${item.slug}`)
  ),
];

export interface ResolvedPagerView {
  title: string;
  content: string;
  href: string;
  navigatorId?: string;
  index?: number;
  collection?: ReadonlyArray<NavigatorItem>;
}

/**
 * Build the pager-friendly markdown for the special "about" / "contact" pages
 * by reading from the virtual fs node's pre-rendered content.
 */
type FsLookup = {
  resolve: (path: string) => { title: string; content: string; href?: string } | null;
};

/**
 * Resolve a `/tui/...` URL to a pager state. Returns null for `/tui` itself
 * or any unknown path.
 */
export const resolveTuiPath = (pathname: string, fs: FsLookup): ResolvedPagerView | null => {
  const segments = pathname
    .replace(/^\/tui\/?/, '')
    .split('/')
    .filter(Boolean);
  if (segments.length === 0) return null;
  const [first, ...rest] = segments;

  if (first === 'about' || first === 'contact') {
    const node = fs.resolve(`/home/zac/${first}.md`);
    if (!node) return null;
    return {
      title: node.title,
      content: node.content,
      href: node.href ?? `/gui/${first}`,
    };
  }

  const nav = findNavigator(first);
  if (!nav) return null;
  const items = nav.list();
  const slug = rest.join('/');
  const index = items.findIndex((i) => i.slug === slug);
  if (index < 0) return null;
  const item = items[index];
  if (!item.viewable || !item.getContent) return null;
  return {
    title: item.label,
    content: item.getContent(),
    href: item.href,
    navigatorId: nav.id,
    index,
    collection: items,
  };
};

/**
 * Compute the URL slug for a pager state — used to push to the browser URL bar.
 */
export const pagerSlugForState = (state: {
  navigatorId?: string;
  index?: number;
  collection?: ReadonlyArray<NavigatorItem>;
  href: string;
}): string => {
  if (state.navigatorId && state.collection && state.index !== undefined && state.index >= 0) {
    const item = state.collection[state.index];
    if (item) return `${state.navigatorId}/${item.slug}`;
  }
  // Strip `/gui/` prefix if present so /gui/about → about.
  return state.href.replace(/^\/?(gui\/)?/, '').replace(/^\//, '');
};

/**
 * Resolve a free-form query against a navigator's items.
 * Accepts: 1-based numeric index, exact slug, or case-insensitive substring on slug/label.
 */
export const resolveNavigatorItem = (
  items: ReadonlyArray<NavigatorItem>,
  query: string
): NavigatorItem | null => {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const idx = Number.parseInt(trimmed, 10);
  if (!Number.isNaN(idx) && idx >= 1 && idx <= items.length) {
    return items[idx - 1] ?? null;
  }

  const exact = items.find((i) => i.slug === trimmed);
  if (exact) return exact;

  const lower = trimmed.toLowerCase();
  const partial = items.find(
    (i) => i.slug.toLowerCase().includes(lower) || i.label.toLowerCase().includes(lower)
  );
  return partial ?? null;
};
