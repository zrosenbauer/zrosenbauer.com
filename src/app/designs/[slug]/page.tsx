import { Footer } from '@components/footer';
import { Mdx } from '@components/md/mdx';
import { Navigation } from '@components/nav';
import { allDesigns } from '@content';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import React from 'react';

import './page.css';

export const revalidate = 60;

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams(): Promise<Array<Props['params']>> {
  return allDesigns.map((p) => ({
    slug: p.slug,
  }));
}

export default async function DesignPage({ params }: Props) {
  const design = findDesignBySlug(params.slug);

  const modeClasses =
    design.mode === 'dark'
      ? 'bg-zinc-900 text-zinc-100'
      : 'bg-zinc-50 text-zinc-900';

  return (
    <div className={`${modeClasses} min-h-screen`}>
      <Navigation className=' fixed' backLink='/designs' />
      <div className='container px-4 page-container mx-auto relative isolate overflow-hidden pt-24 sm:pt-32'>
        <div className='flex flex-col items-center'>
          <div className='mx-auto text-center lg:mx-0'>
            <h1 className='text-4xl mb-2 font-bold tracking-tight sm:text-6xl font-display'>
              {design.title}
            </h1>
            <p className='mb-4 text-lg leading-8'>{design.description}</p>
            <div className='design-content'>
              <Image
                src={`/img/designs/${design.slug}/banner.png`}
                alt={design.title}
                width={1500}
                height={918}
                className='design-banner'
              />
            </div>
          </div>
        </div>
      </div>
      <div className='mx-auto page-container px-4 py-4'>
        <hr />
      </div>
      <article className='px-4 pb-12 mx-auto page-container'>
        <Mdx code={design.body.code} />
      </article>
      <Footer />
    </div>
  );
}

const findDesignBySlug = (slug: string) => {
  const design = allDesigns.find((d) => d.slug === slug);

  if (!design) {
    notFound();
  }

  return design;
};
