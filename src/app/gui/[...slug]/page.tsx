import { Mdx } from '@components/md/mdx';
import { Section } from '@components/site/section';
import { allPages } from '@content';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface ParamsShape {
  slug: string[];
}

interface Props {
  params: Promise<ParamsShape>;
}

export async function generateStaticParams(): Promise<Array<ParamsShape>> {
  return allPages.map((p) => ({
    slug: p.slug.split('/'),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = allPages.find((p) => p.slug === slug.join('/'));
  if (!page) return {};
  const image = `/og/pages/${page.slug}.png`;
  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
      type: 'website',
      url: `https://zrosenbauer.com${page.path}`,
      images: [{ url: image, width: 1200, height: 630, alt: page.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: [image],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = allPages.find((page) => page.slug === slug.join('/'));

  if (!page) {
    notFound();
  }

  return (
    <>
      <Section first>
        <div className="flex flex-col gap-4">
          <h1 className="font-pixel text-4xl font-bold tracking-tight text-primary md:text-6xl">
            {page.title}
          </h1>
          {page.description ? (
            <p className="max-w-prose text-base text-muted-foreground md:text-lg">
              {page.description}
            </p>
          ) : null}
        </div>
      </Section>

      <Section>
        <article className="prose prose-quoteless max-w-none font-mono">
          <Mdx code={page.body.code} />
        </article>
      </Section>
    </>
  );
}
