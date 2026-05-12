import {
  type BlogPost,
  type Design,
  type Page,
  type Project,
  allBlogPosts,
  allDesigns,
  allPages,
  allProjects,
} from '@content';

import type { FsDir, FsFile, FsNode } from './types';

const HOME_PATH = '/home/zac';

const formatDate = (iso: string): string => {
  try {
    return new Date(iso).toISOString().slice(0, 10);
  } catch {
    return iso;
  }
};

const blogPostToFile = (post: BlogPost): FsFile => {
  const tagLine = post.tags && post.tags.length > 0 ? `tags: ${post.tags.join(', ')}\n` : '';
  const header = [
    `# ${post.title}`,
    '',
    `_${formatDate(post.publishedAt)} · ${post.readTime} min read · @${post.authorGithubUsername}_`,
    '',
    `> ${post.description}`,
    '',
    tagLine,
  ]
    .filter(Boolean)
    .join('\n');

  return {
    kind: 'file',
    name: `${post.slug}.md`,
    path: `${HOME_PATH}/blog/${post.slug}.md`,
    title: post.title,
    description: post.description,
    content: `${header}\n${post.body.raw.trim()}\n`,
    href: post.path,
    meta: {
      publishedAt: post.publishedAt,
      tags: post.tags ?? [],
    },
  };
};

const projectToFile = (project: Project): FsFile => {
  const header = [
    `# ${project.title}`,
    '',
    `_repository: [${project.repository}](https://github.com/${project.repository})_`,
    project.deprecated ? '_status: deprecated_' : '_status: active_',
    '',
  ].join('\n');

  return {
    kind: 'file',
    name: `${project.slug}.md`,
    path: `${HOME_PATH}/projects/${project.slug}.md`,
    title: project.title,
    description: project.repository,
    content: `${header}\n${project.body.raw.trim()}\n`,
    href: `https://github.com/${project.repository}`,
    meta: {
      deprecated: project.deprecated,
      repository: project.repository,
    },
  };
};

const designToFile = (design: Design): FsFile => {
  const header = [`# ${design.title}`, '', `> ${design.description}`, ''].join('\n');
  return {
    kind: 'file',
    name: `${design.slug}.md`,
    path: `${HOME_PATH}/designs/${design.slug}.md`,
    title: design.title,
    description: design.description,
    content: `${header}\n${design.body.raw.trim()}\n`,
    href: `/gui/designs/${design.slug}`,
    meta: { mode: design.mode },
  };
};

const pageToFile = (page: Page): FsFile => {
  const header = [
    `# ${page.title}`,
    '',
    page.description ? `> ${page.description}\n` : '',
    '',
  ].join('\n');
  const slug = page.slug || page._id.replace(/^pages\//, '').replace(/\.mdx$/, '');
  return {
    kind: 'file',
    name: `${slug}.md`,
    path: `${HOME_PATH}/${slug}.md`,
    title: page.title,
    description: page.description,
    content: `${header}\n${page.body.raw.trim()}\n`,
    href: page.path,
  };
};

const makeDir = (name: string, path: string, description?: string): FsDir => ({
  kind: 'dir',
  name,
  path,
  children: {},
  description,
});

const sortedByName = <T extends FsNode>(nodes: T[]): T[] =>
  [...nodes].sort((a, b) => a.name.localeCompare(b.name));

const buildTree = (): FsDir => {
  const root = makeDir('zac', HOME_PATH);

  const blogDir = makeDir('blog', `${HOME_PATH}/blog`, 'Tutorials, gotchas, and rants.');
  const projectsDir = makeDir(
    'projects',
    `${HOME_PATH}/projects`,
    'Open-source and personal work.'
  );
  const designsDir = makeDir('designs', `${HOME_PATH}/designs`, 'Visual experiments.');

  const blogFiles = sortedByName(allBlogPosts.map(blogPostToFile));
  for (const f of blogFiles) {
    blogDir.children[f.name] = f;
  }

  const projectFiles = sortedByName(allProjects.map(projectToFile));
  for (const f of projectFiles) {
    projectsDir.children[f.name] = f;
  }

  const designFiles = sortedByName(allDesigns.map(designToFile));
  for (const f of designFiles) {
    designsDir.children[f.name] = f;
  }

  root.children[blogDir.name] = blogDir;
  root.children[projectsDir.name] = projectsDir;
  root.children[designsDir.name] = designsDir;

  const pageFiles = sortedByName(allPages.map(pageToFile));
  for (const f of pageFiles) {
    root.children[f.name] = f;
  }

  const contactFile: FsFile = {
    kind: 'file',
    name: 'contact.md',
    path: `${HOME_PATH}/contact.md`,
    title: 'contact',
    content: [
      '# contact',
      '',
      '- email: [me@zrosenbauer.com](mailto:me@zrosenbauer.com)',
      '- github: [@zrosenbauer](https://github.com/zrosenbauer)',
      '- twitter: [@zrosenbauer](https://twitter.com/zrosenbauer)',
      '',
    ].join('\n'),
  };
  root.children[contactFile.name] = contactFile;

  return root;
};

const ROOT: FsDir = buildTree();
export { HOME_PATH };

const splitPath = (raw: string): string[] => raw.split('/').filter(Boolean);

export const normalizePath = (input: string, cwd: string): string => {
  if (!input || input === '~') {
    return HOME_PATH;
  }
  let working: string;
  if (input.startsWith('/')) {
    working = input;
  } else if (input.startsWith('~/')) {
    working = `${HOME_PATH}/${input.slice(2)}`;
  } else {
    working = `${cwd.replace(/\/+$/, '')}/${input}`;
  }
  const segments: string[] = [];
  for (const seg of splitPath(working)) {
    if (seg === '.') continue;
    if (seg === '..') {
      segments.pop();
      continue;
    }
    segments.push(seg);
  }
  return `/${segments.join('/')}`;
};

export const resolveNode = (path: string): FsNode | null => {
  const segments = splitPath(path);
  if (segments.length === 0) return null;
  if (segments[0] !== 'home' || segments[1] !== 'zac') return null;

  let current: FsNode = ROOT;
  for (let i = 2; i < segments.length; i += 1) {
    if (current.kind !== 'dir') return null;
    const child: FsNode | undefined = current.children[segments[i]];
    if (!child) return null;
    current = child;
  }
  return current;
};

export const listDir = (dir: FsDir): FsNode[] =>
  Object.values(dir.children).sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === 'dir' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

export const prettyPath = (path: string): string => {
  if (path === HOME_PATH) return '~';
  if (path.startsWith(`${HOME_PATH}/`)) return `~/${path.slice(HOME_PATH.length + 1)}`;
  return path;
};
