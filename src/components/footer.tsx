'use client';

import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
} from '@tabler/icons-react';
import Link from 'next/link';
import React from 'react';

const socialLinks = [
  {
    href: 'https://linkedin.com/in/zacrosenbauer',
    icon: IconBrandLinkedin,
  },
  {
    icon: IconMail,
    href: 'mailto:me@zrosenbauer.com',
  },
  {
    href: 'https://github.com/zrosenbauer',
    icon: IconBrandGithub,
  },
];

// biome-ignore lint/complexity/noBannedTypes: needed for future
export type NavigationProps = {};

export const Footer: React.FC = () => {
  return (
    <footer className={'text-zinc-100'}>
      <div className='container flex flex-row items-center justify-between p-6 mx-auto'>
        <div>@zrosenbauer All Rights Reserved.</div>
        <div className='flex-grow' />
        <div className='flex justify-between gap-8'>
          {socialLinks.map(({ href, icon: Icon }) => (
            <Link
              key={href}
              target='_blank'
              rel='noopener noreferrer'
              href={href}
            >
              <Icon className='w-6 h-6 duration-200 hover:font-medium' />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};
