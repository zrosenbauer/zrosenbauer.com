import { allBlogPosts, allDesigns, allPages, allProjects } from '@content';

const SITE_URL = 'https://zrosenbauer.com';

const link = (path: string): string => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

// Pages live at /gui/{slug}, not at the contentlayer source /pages/{slug} path.
const pageHref = (slug: string): string => link(`/gui/${slug}`);

const sortedBlog = () =>
  [...allBlogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

const formatList = (
  heading: string,
  items: ReadonlyArray<{ title: string; href: string; description?: string }>
): string => {
  if (items.length === 0) return '';
  const lines = items.map((i) =>
    i.description ? `- [${i.title}](${i.href}): ${i.description}` : `- [${i.title}](${i.href})`
  );
  return `## ${heading}\n\n${lines.join('\n')}\n`;
};

export const buildLlmsTxt = (): string => {
  const intro = [
    '# zrosenbauer.com',
    '',
    '> Personal site of Zac Rosenbauer — co-founder of joggr.ai (the developer toolkit for building with AI agents). TypeScript, Node, Rust, and a purveyor of all languages.',
    '',
    'This site has two front-ends: a terminal interface at `/tui` and a graphical web interface at `/gui`. All written content is also published as Markdown — fetch `/llms-full.txt` for the full corpus.',
    '',
  ].join('\n');

  const pages = formatList(
    'Pages',
    allPages.map((p) => ({
      title: p.title,
      href: pageHref(p.slug),
      description: p.description,
    }))
  );

  const blog = formatList(
    'Blog',
    sortedBlog().map((p) => ({
      title: p.title,
      href: link(p.path),
      description: p.description,
    }))
  );

  const projects = formatList(
    'Projects',
    allProjects.map((p) => ({
      title: p.title,
      href: link(p.path),
      description: `github: ${p.repository}${p.deprecated ? ' (deprecated)' : ''}`,
    }))
  );

  const designs = formatList(
    'Designs',
    allDesigns.map((d) => ({
      title: d.title,
      href: link(d.path),
      description: d.description,
    }))
  );

  return [intro, pages, blog, projects, designs].filter(Boolean).join('\n');
};

const fenceBody = (raw: string): string => raw.trim();

const renderDoc = (
  title: string,
  href: string,
  meta: ReadonlyArray<string>,
  body: string
): string => {
  const metaLine = meta.length > 0 ? `\n_${meta.join(' · ')}_\n` : '';
  return `# ${title}\n\nsource: ${href}\n${metaLine}\n${fenceBody(body)}\n`;
};

export const buildLlmsFullTxt = (): string => {
  const sections: string[] = [];

  sections.push(
    [
      '# zrosenbauer.com — full corpus',
      '',
      '> Full Markdown corpus for LLM consumption. Generated from the site content at build time.',
      '',
      `index: ${link('/llms.txt')}`,
      '',
    ].join('\n')
  );

  for (const page of allPages) {
    sections.push(
      renderDoc(
        page.title,
        pageHref(page.slug),
        page.description ? [page.description] : [],
        page.body.raw
      )
    );
  }

  for (const post of sortedBlog()) {
    const meta: string[] = [
      new Date(post.publishedAt).toISOString().slice(0, 10),
      `${post.readTime} min`,
      `@${post.authorGithubUsername}`,
    ];
    if (post.tags && post.tags.length > 0) meta.push(`tags: ${post.tags.join(', ')}`);
    sections.push(renderDoc(post.title, link(post.path), meta, post.body.raw));
  }

  for (const project of allProjects) {
    const meta = [
      `repo: github.com/${project.repository}`,
      project.deprecated ? 'status: deprecated' : 'status: active',
    ];
    sections.push(renderDoc(project.title, link(project.path), meta, project.body.raw));
  }

  for (const design of allDesigns) {
    sections.push(
      renderDoc(
        design.title,
        link(design.path),
        [design.description, `mode: ${design.mode}`],
        design.body.raw
      )
    );
  }

  return `${sections.join('\n---\n\n')}\n`;
};
