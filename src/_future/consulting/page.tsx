'use client';

import { Mail, X } from 'lucide-react';
import Link from 'next/link';
import { Navigation } from '@components/nav';
import { Card } from '@components/card';
import Image from 'next/image';

const logos = [
  'fedex.png',
  'bbva.png',
  'raiffeisen.png',
  'saks-5th-ave.png',
  'taylormade.png',
  'barneys-nyc.webp',
  'neighborhoods.png',
  'shoprunner.png',
  'neiman-marcus.png',
];

const services = [
  {
    title: 'Fractional CTO',
    description:
      'Need a seasoned startup CTO to help you build your MVP, scale your team, and make sure you are on the right track? I can help.',
    price: '$3,000/mo - $5,000/mo',
  },
  {
    title: 'DevOps for Startups',
    description:
      'Full end-to-end Dev(Sec)Ops setup for your startup. Includes CI/CD using GitHub Actions, automated release notes, ChatOps, security scans & more.',
    price: '$2,500 - $5,000 (one-time)',
  },
  {
    title: 'Custom Consulting',
    description:
      'Sometimes you just need some extra help with your node.js project, or you need a second opinion on your architecture. I can help with that.',
    price: 'TBD, we can discuss',
  },
];

export default function ConsultingPage() {
  return (
    <div className=' bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0'>
      <Navigation />
      <div className='container flex items-center justify-center min-h-screen px-4 mx-auto'>
        <div className='flex flex-col'>
          <div className='flex flex-col mb-8'>
            <h1 className='text-4xl font-bold text-center text-zinc-200 lg:text-6xl font-display'>
              Consulting
            </h1>
            <p className='mt-4 text-lg text-center text-zinc-400'>
              I offer consulting services for a variety of topics. If you have a
              project in mind, feel free to reach out.
            </p>
          </div>
          <div className='flex flex-col mb-8'>
            <h3 className='text-3xl lg:text-3xl font-bold text-center text-zinc-200 font-display'>
              Who I've Worked With
            </h3>
            <p className='mt-4 text-lg text-center text-zinc-400'>
              I've worked for and worked with some of the largest companies in
              the world, including top financial institutions, luxury retailers,
              and more.
            </p>
            <div className='grid w-full grid-cols-2 sm:grid-cols-6 gap-1 mx-auto mt-32 sm:mt-0  lg:gap-2'>
              {logos.map((logo, index) => (
                <Image
                  src={`/img/logos/${logo}`}
                  alt={`${logo.split('.')[0]} logo`}
                  width={200}
                  height={200}
                  key={logo}
                  className='rounded-lg'
                />
              ))}
            </div>
          </div>
          <div className='grid w-full grid-cols-1 gap-8 mx-auto mt-32 sm:mt-0 sm:grid-cols-3 lg:gap-16'>
            {services.map((service, index) => (
              <Card key={service.title}>
                <span
                  className='absolute w-px h-2/3 bg-gradient-to-b from-zinc-500 via-zinc-500/50 to-transparent'
                  aria-hidden='true'
                />
                {/* <span className='relative z-10 flex items-center justify-center w-12 h-12 text-sm duration-1000 border rounded-full text-zinc-200 group-hover:text-white group-hover:bg-zinc-900 border-zinc-500 bg-zinc-900 group-hover:border-zinc-200 drop-shadow-orange'>
                  {s.icon}
                </span>{' '} */}
                <div className='z-10 flex flex-col items-center p-8'>
                  <span className='lg:text-3xl font-medium duration-150 xl:text-4xl text-zinc-200 group-hover:text-white font-display'>
                    {service.title}
                  </span>
                  <span className='mt-4 text-sm text-center duration-1000 text-zinc-400 group-hover:text-zinc-200'>
                    {service.description}
                  </span>
                </div>
              </Card>
            ))}
          </div>
          <Link href='/contact'>
            <Mail className='w-6 h-6 mr-2' /> Contact Me
          </Link>
        </div>
      </div>
    </div>
  );
}
