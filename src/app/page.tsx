import { Starfield } from '@components/starfield';
import Link from 'next/link';
import React from 'react';


const navigation = [
  { name: 'about', href: '/about' },
  // { name: 'Consulting', href: '/consulting' },
  { name: 'projects', href: '/projects' },
  { name: 'blog', href: '/blog' },
  { name: 'contact', href: '/contact' },
];

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black'>
      <nav className='my-16 animate-fade-in'>
        <ul className='flex items-center justify-center gap-4'>
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className='text-sm duration-500 text-zinc-500 hover:text-zinc-300'
            >
              {item.name}
            </Link>
          ))}
        </ul>
      </nav>
      <div className='hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0' />
      <div className='inset-0 -z-10 animate-fade-in'>
        <Starfield
          starCount={1000}
          starColor={[255, 255, 255]}
          speedFactor={0.05}
        />
      </div>
      <h1 className='z-10 text-4xl text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text '>
        zrosenbauer
      </h1>
      <div className='hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0' />
      <div className='my-16 text-center animate-fade-in'>
        <h2 className='text-sm text-zinc-500 '>
          I'm building{' '}
          <Link
            target='_blank'
            href='https://joggr.io'
            className='underline duration-500 hover:text-zinc-300'
          >
            joggr.io
          </Link>{' '}
          to help developers write great documentation.
        </h2>
      </div>
    </div>
  );
}
