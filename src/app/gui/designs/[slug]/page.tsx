import { Mdx } from '@components/md/mdx';
import { Section } from '@components/site/section';
import { allDesigns } from '@content';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import './page.css';

interface ParamsShape {
  slug: string;
}

interface Props {
  params: Promise<ParamsShape>;
}

export async function generateStaticParams(): Promise<Array<ParamsShape>> {
  return allDesigns.map((d) => ({
    slug: d.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const design = allDesigns.find((d) => d.slug === slug);
  if (!design) return {};
  const image = `/og/designs/${design.slug}.png`;
  return {
    title: design.title,
    description: design.description,
    openGraph: {
      title: design.title,
      description: design.description,
      type: 'article',
      url: `https://zrosenbauer.com${design.path}`,
      images: [{ url: image, width: 1200, height: 630, alt: design.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: design.title,
      description: design.description,
      images: [image],
    },
  };
}

export default async function DesignPage({ params }: Props) {
  const { slug } = await params;
  const design = allDesigns.find((d) => d.slug === slug);
  if (!design) {
    notFound();
  }

  return (
    <>
      <Section first>
        <div className="flex flex-col gap-4">
          <h1 className="font-pixel text-4xl font-bold tracking-tight text-primary md:text-6xl">
            {design.title}
          </h1>
          <p className="max-w-prose text-base text-muted-foreground md:text-lg">
            {design.description}
          </p>
        </div>
      </Section>

      <Section>
        <div className="relative aspect-[1500/918] w-full border-2 border-border">
          <Image
            src={`/img/designs/${design.slug}/banner.png`}
            alt={design.title}
            fill
            sizes="(min-width: 1024px) 768px, 100vw"
            className="object-cover"
          />
        </div>
      </Section>

      <Section>
        <article className="prose prose-quoteless design-content max-w-none font-mono">
          <Mdx code={design.body.code} />
        </article>
      </Section>
    </>
  );
}
