'use client';

import Image from 'next/image';

import { Card } from '@components/card';
import { Navigation } from '@components/nav';
import { allDesigns } from '@content';
// import {
//   IconBrandGithub,
//   IconBrandLinkedin,
//   IconMail,
// } from '@tabler/icons-react';
import Link from 'next/link';

export default function DesignsPage() {
  return (
    <div className='bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0'>
      <Navigation />
      <div className='px-6 pt-20 mx-auto max-w-7xl lg:px-8 md:pt-24 lg:pt-32'>
        <div className='max-w-2xl mx-auto text-center my-8'>
          <h1 className='text-4xl font-bold tracking-tight text-zinc-100 sm:text-6xl'>
            design
          </h1>
          <p className='mt-6 text-lg leading-8 text-zinc-300'>
            I 🫶 figma and spend a lot of free time creating graphic designs for
            fun, for work and other projects. Check them out below.
          </p>
        </div>
      </div>
      <div className='container flex items-start justify-center min-h-screen pt-24 sm:pt-8 px-4 mx-auto'>
        <div className='grid w-full grid-cols-1 gap-8 mx-auto sm:grid-cols-3 lg:gap-16'>
          {allDesigns.map((design) => (
            <Card key={design.slug}>
              <Link
                href={`/designs/${design.slug}`}
                className='px-4 pt-6 pb-12 relative flex flex-col items-center gap-4 duration-700 group md:gap-8'
              >
                <Image
                  src={`/img/designs/${design.slug}/banner.png`}
                  alt={design.title}
                  width={400}
                  height={400}
                  className='rounded-lg'
                />
                <div className='z-10 flex flex-col items-center'>
                  <span className='lg:text-xl font-medium duration-150 xl:text-3xl text-zinc-200 group-hover:text-white font-display'>
                    {design.title}
                  </span>
                  <span className='mt-4 text-sm text-center duration-1000 text-zinc-400 group-hover:text-zinc-200'>
                    {design.description}
                  </span>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
