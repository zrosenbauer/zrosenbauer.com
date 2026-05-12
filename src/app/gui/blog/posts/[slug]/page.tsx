import { Mdx } from '@components/md/mdx';
import { Section } from '@components/site/section';
import { allBlogPosts } from '@content';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface ParamsShape {
  slug: string;
}

interface Props {
  params: Promise<ParamsShape>;
}

export async function generateStaticParams(): Promise<Array<ParamsShape>> {
  return allBlogPosts.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = allBlogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  const image = `/og/blog/${post.slug}.png`;
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      url: `https://zrosenbauer.com${post.path}`,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [image],
    },
  };
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = allBlogPosts.find((p) => p.slug === slug);
  if (!post) {
    notFound();
  }

  return (
    <>
      <Section first>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs uppercase tracking-widest text-muted-foreground">
            <span>{formatDate(post.publishedAt)}</span>
            <span className="text-border">·</span>
            <span>{post.readTime} min</span>
            <span className="text-border">·</span>
            <span>@{post.authorGithubUsername}</span>
          </div>
          <h1 className="font-pixel text-4xl font-bold tracking-tight text-primary md:text-6xl">
            {post.title}
          </h1>
          <p className="max-w-prose text-base text-muted-foreground md:text-lg">
            {post.description}
          </p>
          {post.tags && post.tags.length > 0 ? (
            <div className="mt-1 flex flex-wrap gap-1.5">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="border border-border bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </Section>

      {post.image ? (
        <Section bleed>
          <img
            src={post.image}
            alt={`Blog post banner for ${post.title}`}
            className="block w-full"
          />
        </Section>
      ) : null}

      <Section>
        <article className="prose prose-quoteless max-w-none font-mono">
          <Mdx code={post.body.code} />
        </article>
      </Section>
    </>
  );
}
