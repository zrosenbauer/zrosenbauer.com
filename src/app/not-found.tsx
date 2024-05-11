import { Starfield } from '@components/starfield';
import Link from 'next/link';
import React from 'react';


export default function NotFoundPage() {
  return (
    <div className='flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black'>
      <div className='container flex items-center justify-center min-h-screen px-4 mx-auto'>
        <div className='flex flex-col'>
          <h1 className='text-4xl font-bold text-center text-zinc-200 lg:text-6xl font-display'>
            Not Found
          </h1>
          <p className='mt-4 text-lg text-center text-zinc-400 mb-8'>
            Sorry the page you are looking for cannot be found.
          </p>
          <Link
            className='bg-transparent text-center hover:bg-zinc-900 text-zinc-200 font-semibold hover:text-white py-2 px-4 border border-zinc-500 hover:border-transparent rounded'
            href='/'
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
