import { Section } from '@components/site/section';
import { allProjects } from '@content';
import { IconStarFilled } from '@tabler/icons-react';
import { fetchProjectsWithStars, formatStars, type ProjectWithStars } from '@utils/github/projects';
import Link from 'next/link';

const FEATURED_SLUGS = ['voltagent', 'viteval', 'kidd'];

export default async function ProjectsPage() {
  const enriched = await fetchProjectsWithStars(allProjects);

  const featuredOrder = new Map(FEATURED_SLUGS.map((slug, i) => [slug, i]));
  const ordered = [...enriched].sort((a, b) => {
    const ai = featuredOrder.get(a.project.slug);
    const bi = featuredOrder.get(b.project.slug);
    if (ai !== undefined && bi !== undefined) return ai - bi;
    if (ai !== undefined) return -1;
    if (bi !== undefined) return 1;
    return a.project.title.localeCompare(b.project.title);
  });

  return (
    <>
      <Section first>
        <div className="flex flex-col gap-4">
          <h1 className="font-pixel text-4xl font-bold tracking-tight text-primary md:text-6xl">
            projects
          </h1>
          <p className="max-w-prose text-base text-muted-foreground md:text-lg">
            Open-source, work, and personal projects. Click any row to open on GitHub.
          </p>
        </div>
      </Section>

      <Section>
        <ProjectList projects={ordered} />
      </Section>
    </>
  );
}

function ProjectList({ projects }: { projects: ReadonlyArray<ProjectWithStars> }) {
  if (projects.length === 0) {
    return <p className="text-muted-foreground">(none)</p>;
  }
  return (
    <ul className="divide-y-2 divide-border border-y-2 border-border">
      {projects.map(({ project, stars }) => (
        <li key={project.slug}>
          <Link
            href={`https://github.com/${project.repository}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid grid-cols-[1fr_auto] items-start gap-x-6 gap-y-1 px-2 py-4 hover:bg-primary/5"
          >
            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-base font-bold text-foreground group-hover:text-primary md:text-lg">
                  {project.title}
                </span>
                <RoleBadge role={project.role} />
              </div>
              <p className="text-xs text-muted-foreground md:text-sm line-clamp-2">
                {project.description}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 font-mono text-sm text-muted-foreground">
              {typeof stars === 'number' ? (
                <span className="inline-flex items-center gap-1.5">
                  <IconStarFilled
                    aria-hidden="true"
                    className="h-3.5 w-3.5 text-yellow-400 md:h-4 md:w-4"
                  />
                  {formatStars(stars)}
                </span>
              ) : null}
              {project.deprecated ? (
                <span className="text-xs text-destructive md:text-sm">deprecated</span>
              ) : null}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function RoleBadge({ role }: { role: 'author' | 'contributor' }) {
  const className =
    role === 'contributor'
      ? 'rounded-sm border border-accent/50 bg-accent/15 px-1.5 py-0 text-[10px] font-bold uppercase tracking-widest text-accent'
      : 'rounded-sm border border-primary/50 bg-primary/15 px-1.5 py-0 text-[10px] font-bold uppercase tracking-widest text-primary';
  return <span className={className}>{role}</span>;
}
