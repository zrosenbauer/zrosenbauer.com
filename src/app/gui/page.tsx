import { HeroBanner } from '@components/site/hero-banner';
import { Section } from '@components/site/section';
import { allBlogPosts, allProjects } from '@content';
import { fetchProjectsWithStars, formatStars } from '@utils/github/projects';
import { IconStarFilled } from '@tabler/icons-react';
import Link from 'next/link';

const FEATURED_PROJECT_SLUGS = ['voltagent', 'viteval', 'kidd'];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export default async function GuiHome() {
  const featuredProjects = FEATURED_PROJECT_SLUGS.map((slug) =>
    allProjects.find((p) => p.slug === slug)
  ).filter((p): p is NonNullable<typeof p> => p !== undefined);

  const featuredWithStars = await fetchProjectsWithStars(featuredProjects);

  const recentPosts = [...allBlogPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  return (
    <>



      {/* 00 — index/hero */}
      <Section index="00" label="index" first>
        <div className="flex flex-col gap-6">
          <HeroBanner withMario />
          <p className="max-w-prose text-base text-muted-foreground md:text-lg">
            Co-founder of{' '}
            <Link
              href="https://joggr.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4 hover:text-accent"
            >
              joggr.ai
            </Link>
            — the developer toolkit for building with AI agents. Mostly typescript, node, and rust. Purveyor of all languages. I ship open-source tools and write about the things I learned the hard way.
          </p>
        </div>
      </Section>

      {/* 01 — about */}
      <Section index="01" label="about">
        <ul className="space-y-3 text-sm md:text-base">
          <Stat k="now" v="building joggr.ai · open-source on the side" />
          <Stat k="prev" v="fedex dataworks · shoprunner · precognitive · techstars" />
          <Stat k="stack" v="typescript · node · rust · purveyor of all the codez" />
          <Stat k="based" v="ny · usa" />
        </ul>
      </Section>

      {/* 02 — projects */}
      <Section index="02" label="selected work" id="projects">
        <ul className="divide-y-2 divide-border border-y-2 border-border">
          {featuredWithStars.map(({ project, stars }) => (
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
        <div className="mt-4 text-xs">
          <Link href="/gui/projects" className="text-muted-foreground hover:text-foreground">
            → all {allProjects.length} projects
          </Link>
        </div>
      </Section>

      {/* 03 — writing */}
      <Section index="03" label="recent writing">
        <ul className="divide-y-2 divide-border border-y-2 border-border">
          {recentPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/gui/blog/posts/${post.slug}`}
                className="group flex flex-col gap-1 px-2 py-4 hover:bg-primary/5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <span className="text-base font-bold text-foreground group-hover:text-primary md:text-lg">
                    {post.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(post.publishedAt)} · {post.readTime} min
                  </span>
                </div>
                <p className="text-xs text-muted-foreground md:text-sm line-clamp-2">
                  {post.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-xs">
          <Link href="/gui/blog" className="text-muted-foreground hover:text-foreground">
            → all posts
          </Link>
        </div>
      </Section>

      {/* 04 — contact */}
      <Section index="04" label="contact">
        <ul className="space-y-3 text-sm md:text-base">
          <Stat
            k="email"
            v={
              <Link
                href="mailto:zac@joggr.ai"
                className="text-foreground underline underline-offset-4 hover:text-primary"
              >
                zac@joggr.ai
              </Link>
            }
          />
          <Stat
            k="github"
            v={
              <Link
                href="https://github.com/zrosenbauer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4 hover:text-primary"
              >
                @zrosenbauer
              </Link>
            }
          />
          <Stat
            k="linkedin"
            v={
              <Link
                href="https://linkedin.com/in/zacrosenbauer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4 hover:text-primary"
              >
                /in/zacrosenbauer
              </Link>
            }
          />
        </ul>
      </Section>


    </>
  );
}

function Stat({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <li className="grid grid-cols-1 items-baseline gap-1 sm:grid-cols-[8rem_1fr] sm:gap-4">
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{k}</span>
      <span className="text-foreground">{v}</span>
    </li>
  );
}

function RoleBadge({ role }: { role: 'author' | 'contributor' }) {
  const className =
    role === 'contributor'
      ? 'rounded-sm border border-accent/50 bg-accent/15 px-1.5 py-0 text-[10px] font-bold uppercase tracking-widest text-accent'
      : 'rounded-sm border border-primary/50 bg-primary/15 px-1.5 py-0 text-[10px] font-bold uppercase tracking-widest text-primary';
  return <span className={className}>{role}</span>;
}

