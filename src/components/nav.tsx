'use client';

import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import React from 'react';

const links = [
  {
    title: 'about',
    href: '/about',
  },
  {
    title: 'projects',
    href: '/projects',
  },
  {
    title: 'design',
    href: '/designs',
  },
  {
    title: 'blog',
    href: '/blog',
  },
  {
    title: 'contact',
    href: '/contact',
  },
];

export const Navigation: React.FC<{
  backLink?: string;
  className?: string;
}> = ({ className = '', backLink = '/' }) => {
  return (
    <nav
      className={`${className} absolute inset-x-0 top-0 z-50`}
      // ref={ref}
      // className={`${className} fixed inset-x-0 top-0 z-50 backdrop-blur duration-200 border-b  ${
      //   isIntersecting ?
      //     'bg-zinc-900/0 border-transparent'
      //   : 'bg-zinc-900/500 border-zinc-800 '
      // }`}
    >
      <div className='container flex flex-row-reverse items-center justify-between p-6 mx-auto'>
        <div className='flex justify-between gap-8'>
          {links.map((nav) => (
            <Link
              key={nav.href}
              href={nav.href}
              className='duration-200 text-zinc-400 hover:text-zinc-100'
            >
              {nav.title}
            </Link>
          ))}
        </div>
        <Link
          href={backLink}
          className='duration-200 text-zinc-300 hover:text-zinc-100'
        >
          <IconArrowLeft className='w-6 h-6 ' />
        </Link>
      </div>
    </nav>
  );
};
